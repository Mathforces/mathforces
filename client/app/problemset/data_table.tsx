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
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useProblemset, SortField, Problem } from "@/hook/useProblemset";
import { useEffect } from "react";

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
  } = useProblemset(50);

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
    setFilters({ ...filters, search: value || undefined });
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
      <div className="flex items-center gap-2">
        <div className="flex items-center py-4">
          <Input
            placeholder="Search Problem..."
            value={filters.search ?? ""}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="max-w-sm"
          />
        </div>

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
                    {sortBy === option.value && <Check className="w-4 h-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <span className="text-muted-foreground">
            ({pagination?.total ?? 0} Problems)
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-md">
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
                  Loading...
                </TableCell>
              </TableRow>
            ) : problems.length ? (
              problems.map((problem: Problem, i: number) => (
                <TableRow
                  key={problem.id}
                  className="border-none h-12 cursor-pointer hover:bg-bg-light transition-all"
                  onClick={() =>
                    router.push(
                      `/contests/93ad77b8-2b6e-49f7-a0b9-796efa0f08fb?problemId=${problem.id}`,
                    )
                  }
                >
                  {(columns as ColumnDef<TData, TValue>[]).map((_, j) => (
                    <TableCell
                      key={j}
                      className={cn(
                        i % 2 === 0 && "bg-bg",
                        j === columns.length - 1 && "rounded-r-md",
                        j === 0 && "rounded-l-md",
                      )}
                    >
                      {/* Placeholder - columns handle their own rendering */}
                    </TableCell>
                  ))}
                </TableRow>
              ))
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
        <div className="flex items-center justify-center gap-2 py-4">
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

          <div className="flex items-center gap-1">
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
