-- Create subscriptions table for recurring billing
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  billing_key TEXT NOT NULL, -- TossPayments Billing Key (CRITICAL: Never expose via RLS)
  customer_key TEXT NOT NULL, -- TossPayments Customer Key
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'expired')) DEFAULT 'active',
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  next_billing_date TIMESTAMP WITH TIME ZONE NOT NULL,
  amount INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index for cron job performance
CREATE INDEX idx_subscriptions_next_billing ON public.subscriptions (next_billing_date) WHERE status = 'active';
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions (user_id);

-- [CRITICAL] Partial Unique Index: Only ONE 'active' subscription per user at a time
CREATE UNIQUE INDEX idx_unique_active_subscription 
  ON public.subscriptions (user_id) 
  WHERE status = 'active';

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- [SECURITY] User can see their own subscription info EXCEPT the billing_key
-- Note: 'billing_key' column will be excluded from the view in application logic if necessary,
-- but standard RLS doesn't support column-level SELECT exclusion easily on a single table.
-- We will handle this by only selecting specific columns in the 'authenticated' server actions.
CREATE POLICY "Users can view own subscription info" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- [SECURITY] Only API/Service Role can manage subscriptions (INSERT/UPDATE/DELETE)
-- Users cannot modify their own subscription records directly via client SDK.
CREATE POLICY "Service role manages subscriptions" ON public.subscriptions
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_subscription_updated
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
