import { describe, it, expect, vi, beforeEach } from 'vitest';
import { confirmPaymentAction } from '../billing.actions';

// Mock Supabase
vi.mock('@/infrastructure/config/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'user-1' } } })),
    },
    from: vi.fn(() => ({
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  })),
}));

// Mock fetch
global.fetch = vi.fn();

describe('confirmPaymentAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully confirm payment and update user tier', async () => {
    // Mock Toss API success response
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ status: 'DONE' }),
    });

    const result = await confirmPaymentAction('p-key-123', 'order-456', '5000');
    
    expect(result.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('api.tosspayments.com'),
      expect.any(Object)
    );
  });

  it('should throw error if Toss API fails', async () => {
    // Mock Toss API error response
    (global.fetch as any).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: '결제 실패 상세 사유' }),
    });

    await expect(confirmPaymentAction('fail-key', 'order-fail', '5000'))
      .rejects.toThrow('결제 실패 상세 사유');
  });
});
