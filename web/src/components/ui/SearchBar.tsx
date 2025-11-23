import React, { useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  placeholder?: string;
  searchValue: string;
  isLoading?: boolean;
  setIsSearching: (value: boolean) => void;
  setSearchValue: (value: string) => void;
}

export default function SearchBar({
  placeholder = "Search chats or people...",
  searchValue,
  setSearchValue,
  setIsSearching,
  isLoading,
}: SearchBarProps) {
  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchValue.trim().length > 1) {
        setIsSearching(true);
      } else {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchValue, setIsSearching]);

  if (isLoading) {
    return (
      <div className="relative border border-transparent rounded-lg animate-pulse">
        <div className="h-12 w-full rounded bg-neutral-800/30"></div>
        <div className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-1/2 bg-neutral-700 rounded mb-1"></div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-neutral-700"></div>
      </div>
    );
  }

  return (
    <div className="relative group w-full">
      <Input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 border bg-[#262626] border-[#242424] rounded-xs px-3 pr-10 text-white placeholder-[#555555] text-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-5000 transition-all"
      />
      <Search
        size={20}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white opacity-70 pointer-events-none group-focus-within:text-blue-500 group-focus-within:opacity-100 transition-all"
      />
    </div>
  );
}
