CREATE TABLE public.payment_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    order_id TEXT NOT NULL UNIQUE,
    amount INTEGER NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED', 'CANCELED')),
    fail_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.payment_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payment logs" ON public.payment_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Only service role can insert/update payment logs for security, 
-- but users can read their own. Server actions will bypass RLS or use standard auth.
-- For server actions using the service role or normal client, we allow users to insert their *own* initial pending logs.
CREATE POLICY "Users can insert own pending logs" ON public.payment_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own logs" ON public.payment_logs
  FOR UPDATE USING (auth.uid() = user_id);
