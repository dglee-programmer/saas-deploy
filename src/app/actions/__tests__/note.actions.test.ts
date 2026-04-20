import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createNewNoteAction } from '../note.actions';

// Mock dependencies
vi.mock('@/infrastructure/config/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'user-1' } } })),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: 'user-1', subscription_tier: 'standard' }, error: null })),
        })),
        delete: vi.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  })),
}));

// Mock current server action dependencies
let mockProfile = { id: 'user-1', subscription_tier: 'standard' };

vi.mock('@/app/actions/auth.actions', () => ({
  ensureUserProfile: vi.fn(),
  getUserSession: vi.fn(() => Promise.resolve({ id: 'user-1' })),
  getUserProfile: vi.fn(() => Promise.resolve(mockProfile)),
}));

// Mock Supabase with more functions
vi.mock('@/infrastructure/config/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'user-1' } } })),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: mockProfile, error: null })),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: 'note-1' }, error: null })),
        })),
      })),
    })),
  })),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => { throw new Error(`REDIRECT_TO_${url}`); }),
}));

describe('Note Actions Authorization Guard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('SHOUD block standard user from creating a note', async () => {
    mockProfile.subscription_tier = 'standard';
    await expect(createNewNoteAction())
      .rejects.toThrow('REDIRECT_TO_/dashboard/billing');
  });

  it('SHOULD allow premium user to create a note', async () => {
    mockProfile.subscription_tier = 'premium';
    // Success scenario: it should proceed to create and then redirect to a UUID-based note page
    await expect(createNewNoteAction())
      .rejects.toThrow(/REDIRECT_TO_\/notes\/[0-9a-fA-F-]{36}/);
  });
});
