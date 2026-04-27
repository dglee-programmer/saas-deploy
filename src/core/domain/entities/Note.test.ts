import { describe, it, expect } from 'vitest';
import { Note } from './Note';

describe('Note Entity', () => {
  it('should create a Note instance', () => {
    const now = new Date();
    const note = new Note({
      id: '1',
      userId: 'user-1',
      title: 'Test Note',
      content: 'Hello World',
      wordCount: 2,
      tags: ['test'],
      isPinned: false,
      isShared: false,
      createdAt: now,
      updatedAt: now
    });

    expect(note.id).toBe('1');
    expect(note.title).toBe('Test Note');
    expect(note.content).toBe('Hello World');
    expect(note.wordCount).toBe(2);
  });

  it('should update content and word count', () => {
    const note = new Note({
      id: '1',
      userId: 'user-1',
      title: 'Test Note',
      content: '',
      wordCount: 0,
      tags: [],
      isPinned: false,
      isShared: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    note.updateContent('Hello Antigravity');
    
    expect(note.content).toBe('Hello Antigravity');
    expect(note.wordCount).toBe(2);
  });

  it('should handle empty content word count correctly', () => {
    const note = new Note({
      id: '1',
      userId: 'user-1',
      title: 'Test Note',
      content: 'Initial',
      wordCount: 1,
      tags: [],
      isPinned: false,
      isShared: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    note.updateContent('   ');
    expect(note.wordCount).toBe(0);
  });
});
