import { describe, it, expect } from 'vitest';
import { Folder } from './Folder';

describe('Folder Entity', () => {
  it('should create a Folder instance', () => {
    const now = new Date();
    const folder = new Folder({
      id: 'f-1',
      userId: 'user-1',
      name: 'Work',
      isPinned: true,
      createdAt: now,
      updatedAt: now
    });

    expect(folder.id).toBe('f-1');
    expect(folder.name).toBe('Work');
    expect(folder.isPinned).toBe(true);
  });

  it('should rename the folder', () => {
    const folder = new Folder({
      id: 'f-1',
      userId: 'user-1',
      name: 'Work',
      isPinned: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    folder.rename('Archived');
    expect(folder.name).toBe('Archived');
  });
});
