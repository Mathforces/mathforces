"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Problem } from "@/hook/useProblemset";

export const columns: ColumnDef<Problem>[] = [
  {
    accessorKey: "id",
    header: "Id",
    cell: ({ row }) => {
      return (
        <span className="underline text-primary">
          {row.original.displayId}
        </span>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const tags = row.original.tags ?? [];
      return (
        <div className="flex min-w-0 flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-4 w-full">
          <span className="block max-w-[16rem] truncate font-medium text-left lg:max-w-[24rem] xl:max-w-[32rem]">
            {row.original.displayName}
          </span>
          <div className="flex shrink-0 flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="text-xs text-muted-foreground bg-muted px-1 rounded"
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
        </div>
      );
    },
  },
  {
    accessorKey: "submission_count",
    header: "Submissions",
    cell: ({ row }) => {
      return (
        <span className="text-text/60">{row.original.submission_count ?? 0}</span>
      );
    },
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) => {
      return <span className="text-text/60">{row.original.difficulty}</span>;
    },
  },
  {
    accessorKey: "likes",
    header: "Likes",
    cell: ({ row }) => {
      return <span className="text-text/60">{row.original.likes_count}</span>;
    },
  },
];
