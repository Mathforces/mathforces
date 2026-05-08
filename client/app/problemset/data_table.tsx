"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { MdOutlineSort } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useProblemset, SortField, Problem } from "@/hook/useProblemset";
import { useEffect, useState, useRef } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

const sortOptions: { value: SortField; label: string }[] = [
  { value: "difficulty", label: "Difficulty" },
  { value: "name", label: "Name" },
  { value: "submission_count", label: "Number of Submissions" },
  { value: "likes_count", label: "Likes" },
  { value: "created_at", label: "Date" },
];

export function ProblemSetTable<TData, TValue>({
  columns,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const PROBLEM_COL_LIMIT = 20;
  const {
    problems,
    pagination,
    loading,
    filters,
    sortBy,
    sortOrder,
    setFilters,
    setPage,
    setSort,
  } = useProblemset(PROBLEM_COL_LIMIT);

  const [searchValue, setSearchValue] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const table = useReactTable({
    data: problems as TData[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    pageCount: pagination?.totalPages ?? -1,
  });

  const handleSearchChange = (value: string) => {
    setSearchValue(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setFilters({ ...filters, search: value || undefined });
      setPage(1);
    }, 300);
  };

  const handleSortChange = (field: SortField) => {
    if (field === sortBy) {
      setSort(field, sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSort(field, "desc");
    }
  };

  const currentPage = pagination?.page ?? 1;
  const totalPages = pagination?.totalPages ?? 1;

  const openProblem = (problem: Problem) => {
    router.push(`/contests/${problem.contest_id}?problemId=${problem.id}`);
  };

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  useEffect(() => {
    console.log("problems: ", problems);
  }, [problems]);
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="flex flex-1 items-center py-2 sm:py-4">
          <Input
            placeholder="Search Problem..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full sm:max-w-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-bg rounded-full cursor-pointer hover:bg-muted-foreground/25">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <MdOutlineSort className="w-5 h-5 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  {sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => handleSortChange(option.value)}
                    >
                      <span>{option.label}</span>
                      {sortBy === option.value && (
                        <Check className="w-4 h-4" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <span className="text-sm text-muted-foreground">
              ({pagination?.total ?? 0} Problems)
            </span>
          </div>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="h-28 rounded-md bg-bg flex items-center justify-center">
            <Loader2 className="w-7 h-7 animate-spin text-primary" />
          </div>
        ) : problems.length ? (
          problems.map((problem) => {
            const tags = problem.tags ?? [];

            return (
              <button
                key={problem.id}
                type="button"
                onClick={() => openProblem(problem)}
                className="w-full rounded-md bg-bg p-4 text-left transition-colors hover:bg-bg-light"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-xs text-primary underline">
                      {problem.id.slice(0, 8)}
                    </span>
                    <h3 className="mt-1 truncate font-medium">
                      {problem.full_name}
                    </h3>
                  </div>
                  <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                    {problem.difficulty ?? "Unset"}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                  {tags.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{tags.length - 3}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{problem.submission_count ?? 0} submissions</span>
                  <span>{problem.likes_count ?? 0} likes</span>
                </div>
              </button>
            );
          })
        ) : (
          <div className="h-24 rounded-md bg-bg flex items-center justify-center text-sm text-muted-foreground">
            No results.
          </div>
        )}
      </div>

      <div className="hidden md:block overflow-hidden rounded-md">
        <Table className="[&_td]:text-center [&_th]:text-center">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <Loader2 className="w-7 h-7 animate-spin text-primary mx-auto" />
                </TableCell>
              </TableRow>
            ) : problems.length ? (
              table.getRowModel().rows.map((row, i) => {
                const problem = row.original as Problem;
                return (
                  <TableRow
                    key={row.id}
                    className="border-none h-12 cursor-pointer hover:bg-bg-light transition-all"
                    onClick={() => openProblem(problem)}
                  >
                    {row.getVisibleCells().map((cell, j) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          i % 2 === 0 && "bg-bg",
                          j === row.getVisibleCells().length - 1 &&
                            "rounded-r-md",
                          j === 0 && "rounded-l-md",
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 sm:gap-2 py-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(1)}
            disabled={!pagination.hasPrevPage}
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(currentPage - 1)}
            disabled={!pagination.hasPrevPage}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="hidden sm:flex items-center gap-1">
            {getPageNumbers().map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-${i}`} className="px-2">
                  ...
                </span>
              ) : (
                <Button
                  key={p}
                  variant={p === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(p)}
                  className="w-10 h-10"
                >
                  {p}
                </Button>
              ),
            )}
          </div>

          <div className="sm:hidden min-w-20 text-center text-sm text-muted-foreground">
            {currentPage} / {totalPages}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(currentPage + 1)}
            disabled={!pagination.hasNextPage}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(totalPages)}
            disabled={!pagination.hasNextPage}
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
