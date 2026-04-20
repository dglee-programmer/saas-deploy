import { issueBillingKeyAction } from '../billing.actions';
import { revalidatePath } from 'next/cache';

// Mock next/cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

// Mock Supabase
vi.mock('@/infrastructure/config/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'user-1' } } })),
    },
  })),
  createAdminClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn(() => Promise.resolve({ data: null })),
            single: vi.fn(() => Promise.resolve({ data: { id: 'plan-1', price: 5000 }, error: null })),
          })),
        })),
        maybeSingle: vi.fn(() => Promise.resolve({ data: null })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: 'sub-1' }, error: null })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  })),
}));

// Mock fetch
global.fetch = vi.fn();

describe('issueBillingKeyAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully issue billing key and create subscription', async () => {
    // Mock Toss API success response
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ billingKey: 'b-key-123', status: 'DONE' }),
    });

    const result = await issueBillingKeyAction('auth-key-123', 'cust-key-456');
    
    expect(result.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('billing/authorizations/issue'),
      expect.any(Object)
    );
  });

  it('should throw error if Toss API fails', async () => {
    // Mock Toss API error response
    (global.fetch as any).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: '빌링키 발급 실패' }),
    });

    await expect(issueBillingKeyAction('fail-key', 'cust-fail'))
      .rejects.toThrow('빌링키 발급 실패');
  });
});
