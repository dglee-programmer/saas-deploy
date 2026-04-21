import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names safely using clsx and tailwind-merge.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateNoteUrl(id: string, title?: string) {
  return `/notes?id=${id}`;
}

export function parseNoteId(slugOrId: string) {
  if (slugOrId.length >= 36) {
    return slugOrId.slice(-36);
  }
  return slugOrId;
}

