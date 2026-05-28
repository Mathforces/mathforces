"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { safeNumber } from "@/lib/utils";

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
  name: string | null;
  full_name: string | null;
  displayName: string;
  displayId: string;
  contest_id: string;
  submission_count: number;
  correct_submission_count: number | null;
  points: number;
  difficulty: number;
  likes_count: number | null;
  comments_count: number;
  tags: string[] | null;
  created_at: string;
  contests?: { name: string | null } | { name: string | null }[] | null;
}

type ProblemApiRecord = Omit<Problem, "displayName" | "displayId">;

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

export function useProblemset(defaultLimit = 20): UseProblemsetReturn {
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
      const normalizedProblems = (result.data ?? []).map((problem: ProblemApiRecord) => {
        const contest = Array.isArray(problem.contests)
          ? problem.contests[0]
          : problem.contests;
        const problemName =
          problem.name?.trim() || problem.full_name?.trim() || "Untitled problem";
        const contestName = contest?.name?.trim();
        const displayName = contestName
          ? `${problemName} - ${contestName}`
          : problemName;
        const displayId = problem.id ? problem.id.slice(0, 8) : "Unknown";

        return {
          ...problem,
          displayName,
          displayId,
          submission_count: safeNumber(problem.submission_count),
          correct_submission_count: safeNumber(
            problem.correct_submission_count,
          ),
          points: safeNumber(problem.points),
          difficulty: safeNumber(problem.difficulty),
          likes_count: safeNumber(problem.likes_count),
          comments_count: safeNumber(problem.comments_count),
        };
      });

      setProblems(normalizedProblems);
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
