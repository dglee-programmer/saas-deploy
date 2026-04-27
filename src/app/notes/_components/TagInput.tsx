'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';
import { getTagsAction, attachTagToNoteAction, detachTagFromNoteAction } from '@/app/actions/tag.actions';

interface TagInputProps {
  noteId: string;
  initialTags: string[];
}

interface TagData {
  id: string;
  name: string;
  color: string;
}

export function TagInput({ noteId, initialTags }: TagInputProps) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState('');
  const [allTags, setAllTags] = useState<TagData[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchTags() {
      const fetched = await getTagsAction();
      setAllTags(fetched);
    }
    fetchTags();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddTag = async (tagName: string) => {
    const trimmedName = tagName.trim();
    if (!trimmedName || tags.includes(trimmedName)) return;
    if (tags.length >= 5) {
      alert('태그는 최대 5개까지 달 수 있습니다.');
      return;
    }

    // 최적화: UI 먼저 업데이트
    setTags([...tags, trimmedName]);
    setInputValue('');
    setIsDropdownOpen(false);

    try {
      await attachTagToNoteAction(noteId, trimmedName);
    } catch (error: any) {
      alert(error.message);
      // 실패 시 롤백
      setTags(tags);
    }
  };

  const handleRemoveTag = async (tagName: string) => {
    setTags(tags.filter(t => t !== tagName));
    try {
      await detachTagFromNoteAction(noteId, tagName);
    } catch (error: any) {
      alert(error.message);
      setTags(tags);
    }
  };

  const filteredTags = allTags.filter(
    t => t.name.toLowerCase().includes(inputValue.toLowerCase()) && !tags.includes(t.name)
  );

  const getTagColorClass = (colorKey: string) => {
    const colors: Record<string, string> = {
      default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      pink: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    };
    return colors[colorKey] || colors.default;
  };

  return (
    <div className="space-y-3" ref={dropdownRef}>
      <div className="flex flex-wrap gap-2 items-center min-h-[36px]">
        {tags.map(tag => {
          const tagData = allTags.find(t => t.name === tag);
          return (
            <span 
              key={tag} 
              className={cn(
                "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all animate-in zoom-in-95",
                getTagColorClass(tagData?.color || 'default')
              )}
            >
              #{tag}
              <button 
                onClick={() => handleRemoveTag(tag)}
                className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
              >
                <Icon name="close" size={14} />
              </button>
            </span>
          );
        })}

        <div className="relative flex-1 min-w-[120px]">
          <div className="flex items-center gap-2 text-outline-variant/60 focus-within:text-primary transition-colors">
            <Icon name="sell" size={16} />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setIsDropdownOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && inputValue) {
                  e.preventDefault();
                  handleAddTag(inputValue);
                } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
                  handleRemoveTag(tags[tags.length - 1]);
                }
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="태그 추가 (Enter)..."
              className="w-full bg-transparent border-none focus:ring-0 text-sm p-0 placeholder:text-outline-variant/40"
            />
          </div>

          {isDropdownOpen && (inputValue || filteredTags.length > 0) && (
            <div className="absolute left-0 top-8 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-outline-variant/10 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {filteredTags.length > 0 ? (
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-outline uppercase tracking-widest px-2 py-1">기존 태그</p>
                  {filteredTags.map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => handleAddTag(tag.name)}
                      className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between group transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span className={cn("w-2 h-2 rounded-full", `bg-${tag.color === 'default' ? 'slate' : tag.color}-500`)}></span>
                        {tag.name}
                      </span>
                      <Icon name="add" size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              ) : null}
              
              {inputValue && !allTags.some(t => t.name === inputValue) && (
                <div className={cn("border-t border-outline-variant/5 mt-2 pt-2")}>
                  <button
                    onClick={() => handleAddTag(inputValue)}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-primary/5 text-primary flex items-center gap-2 transition-colors"
                  >
                    <Icon name="add_circle" size={16} />
                    <span>새 태그 생성: <strong>{inputValue}</strong></span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
