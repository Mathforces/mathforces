"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export interface ProblemFilters {
  search?: string;
  difficultyMin?: number;
  difficultyMax?: number;
  tags?: string[];
}

export type SortField =
  | "name"
  | "difficulty"
  | "submission_count"
  | "likes_count"
  | "created_at";
export type SortOrder = "asc" | "desc";

export interface ProblemPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface Problem {
  id: string;
  name: string;
  full_name: string;
  submission_count: number;
  correct_submission_count: number;
  points: number;
  difficulty: number;
  likes_count: number;
  comments_count: number;
  tags: string[] | null;
  created_at: string;
}

interface UseProblemsetReturn {
  problems: Problem[];
  pagination: ProblemPagination | null;
  loading: boolean;
  error: string | null;
  filters: ProblemFilters;
  sortBy: SortField;
  sortOrder: SortOrder;
  setFilters: (filters: ProblemFilters) => void;
  setPage: (page: number) => void;
  setSort: (field: SortField, order: SortOrder) => void;
  refetch: () => void;
}

export function useProblemset(defaultLimit = 50): UseProblemsetReturn {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [pagination, setPagination] = useState<ProblemPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<ProblemFilters>({});
  const [page, setPageState] = useState(1);
  const [sortBy, setSortBy] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", defaultLimit.toString());

    if (filters.search) params.set("search", filters.search);
    if (filters.difficultyMin)
      params.set("difficulty_min", filters.difficultyMin.toString());
    if (filters.difficultyMax)
      params.set("difficulty_max", filters.difficultyMax.toString());
    if (filters.tags && filters.tags.length > 0)
      params.set("tags", filters.tags.join(","));

    params.set("sort_by", sortBy);
    params.set("sort_order", sortOrder);

    return params.toString();
  }, [page, filters, sortBy, sortOrder, defaultLimit]);

  const fetchProblems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const queryString = buildQueryParams();
      const response = await axios.get(`/api/problems?${queryString}`);
      const result = response.data;

      setProblems(result.data ?? []);
      setPagination(result.pagination ?? null);
    } catch (err) {
      console.error("Failed to fetch problems:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch problems");
    } finally {
      setLoading(false);
    }
  }, [buildQueryParams]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  const setPage = useCallback((newPage: number) => {
    setPageState(newPage);
  }, []);

  const setSort = useCallback((field: SortField, order: SortOrder) => {
    setSortBy(field);
    setSortOrder(order);
    setPageState(1);
  }, []);

  const updateFilters = useCallback((newFilters: ProblemFilters) => {
    setFilters(newFilters);
    setPageState(1);
  }, []);

  return {
    problems,
    pagination,
    loading,
    error,
    filters,
    sortBy,
    sortOrder,
    setFilters: updateFilters,
    setPage,
    setSort,
    refetch: fetchProblems,
  };
}
