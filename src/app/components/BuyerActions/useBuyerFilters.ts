import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const useBuyerFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Debounced search function
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const updateURL = useCallback(
    (newParams: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (value && value !== "") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      // Reset to page 1 when filters change (except when page is explicitly being updated)
      if (!newParams.page) {
        params.delete("page");
      }

      router.push(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      updateURL({ search: searchTerm });
    }, 500),
    [updateURL]
  );

  const handleFilterChange = (key: string, value: string) => {
    updateURL({ [key]: value });
  };

  const handlePageChange = (page: number) => {
    updateURL({ page: page.toString() });
  };

  return {
    debouncedSearch,
    handleFilterChange,
    handlePageChange,
  };
};
