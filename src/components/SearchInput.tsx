"use client";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setQuery, clearQuery } from "@/lib/features/search/searchSlice";
import { Input } from "./ui/input";
import { SearchIcon } from "lucide-react";

export default function SearchInput() {
  const dispatch = useAppDispatch();
  const query = useAppSelector((state) => state.search.query);
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus input when it appears
  useEffect(() => {
    if (showInput) {
      inputRef.current?.focus();
    }
  }, [showInput]);

  // Handle click outside to close input
  useEffect(() => {
    if (!showInput) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowInput(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showInput]);

  return (
    <>
      {/* Desktop: always show input, aligned right */}
      <div className="hidden md:flex justify-end w-full max-w-xs ml-auto mr-3">
        <Input
          type="text"
          placeholder="Search posts…"
          className="input input-bordered w-full bg-base-200 transition-all duration-300"
          value={query}
          onChange={(e) => dispatch(setQuery(e.target.value))}
          aria-label="Search posts"
        />
      </div>
      {/* Mobile: icon aligned right, input expands from right */}
      <div className="md:hidden relative w-full mr-1" ref={containerRef}>
        {!showInput ? (
          <div className="flex justify-end w-full">
            <button
              className="p-2 transition-colors duration-200 rounded-full hover:bg-primary/20"
              aria-label="Open search"
              onClick={() => setShowInput(true)}
            >
              <SearchIcon className="w-5 h-5 text-primary-foreground" />
            </button>
          </div>
        ) : (
          <div
            className={`
              flex items-center space-x-2 w-full
              bg-base-200 rounded-lg shadow-lg px-2 py-2
              justify-end
            `}
            style={{ minWidth: 0 }}
          >
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search posts…"
              className="input input-bordered w-full bg-base-200 transition-all duration-300"
              value={query}
              onChange={(e) => dispatch(setQuery(e.target.value))}
              aria-label="Search posts"
              onBlur={() => setShowInput(false)}
            />
          </div>
        )}
      </div>
    </>
  );
}