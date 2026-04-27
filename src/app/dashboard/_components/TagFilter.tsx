'use client'

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface TagFilterProps {
  tags: Tag[];
}

export function TagFilter({ tags }: TagFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTagId = searchParams.get('tag') || '';

  const handleTagClick = (tagId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (activeTagId === tagId) {
      params.delete('tag');
    } else {
      params.set('tag', tagId);
    }
    router.replace(`/dashboard?${params.toString()}`);
  };

  const getTagColorClass = (colorKey: string, isActive: boolean) => {
    const colors: Record<string, string> = {
      default: isActive ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300',
      red: isActive ? 'bg-red-500 text-white' : 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400',
      blue: isActive ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400',
      green: isActive ? 'bg-green-500 text-white' : 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400',
      yellow: isActive ? 'bg-yellow-500 text-white' : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400',
      purple: isActive ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400',
      orange: isActive ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400',
      pink: isActive ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-600 hover:bg-pink-100 dark:bg-pink-900/20 dark:text-pink-400',
    };
    return colors[colorKey] || colors.default;
  };

  if (tags.length === 0) return null;

  return (
    <div className="mb-8 overflow-x-auto no-scrollbar pb-2">
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('tag');
            router.replace(`/dashboard?${params.toString()}`);
          }}
          className={cn(
            "px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0",
            !activeTagId 
              ? "bg-primary text-white shadow-lg shadow-primary/20" 
              : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
          )}
        >
          전체
        </button>
        {tags.map(tag => (
          <button
            key={tag.id}
            onClick={() => handleTagClick(tag.id)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5",
              getTagColorClass(tag.color, activeTagId === tag.id),
              activeTagId === tag.id && "shadow-lg"
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full bg-current")}></span>
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
}
