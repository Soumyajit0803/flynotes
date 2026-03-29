"use client";

import { Search, Loader2, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition, useCallback } from "react";
import styles from "./SearchBar.module.css";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Read initial states from the URL
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [limit, setLimit] = useState(searchParams.get("limit") || "4");
  const [isPending, startTransition] = useTransition();

  // 1. A helper function to build the new URL safely
  const createQueryString = useCallback((name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name); // Clean up the URL if the value is empty
    }
    
    return params.toString();
  }, [searchParams]);

  // 2. Handle Text Search (Debounced)
  useEffect(() => {
    // THE FIX: Check if the local state matches the URL. 
    // If they are the same, do nothing and break the loop.
    const currentUrlQuery = searchParams.get("q") || "";
    if (query === currentUrlQuery) return;

    const delayDebounceFn = setTimeout(() => {
      startTransition(() => {
        router.push(`/?${createQueryString("q", query)}`);
      });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, router, createQueryString, searchParams]); // Added searchParams for React exhaustive-deps safety

  // 3. Handle Limit Change (Instant)
  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = e.target.value;
    setLimit(newLimit);
    
    startTransition(() => {
      router.push(`/?${createQueryString("limit", newLimit)}`);
    });
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchWrapper}>
        <Search className={styles.searchIcon} size={20} />
        
        <input
          type="text"
          placeholder={`Search with AI ✧`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
        />

        {isPending && <Loader2 className={styles.loadingIcon} size={18} />}

        {/* The Vertical Divider */}
        <div className={styles.divider}></div>

        {/* The Limit Dropdown */}
        <div className={styles.limitWrapper}>
          <SlidersHorizontal size={16} className={styles.limitIcon} />
          <select 
            value={limit} 
            onChange={handleLimitChange}
            className={styles.limitSelect}
            disabled={isPending}
          >
            <option value="4">4 results</option>
            <option value="10">10 results</option>
            <option value="20">20 results</option>
            <option value="50">50 results</option>
          </select>
        </div>
      </div>
    </div>
  );
}