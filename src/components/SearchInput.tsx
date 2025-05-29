"use client";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setQuery, clearQuery } from "@/lib/features/search/searchSlice";
import { Input } from "./ui/input";

export default function SearchInput() {
  const dispatch = useAppDispatch();
  const query = useAppSelector((state) => state.search.query);

  return (
    <Input
      type="text"
      placeholder="Search posts…"
      className="input input-bordered w-full max-w-xs bg-base-200"
      value={query}
      onChange={(e) => dispatch(setQuery(e.target.value))}
      aria-label="Search posts"
    />
  );
}