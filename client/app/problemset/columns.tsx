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
          {row.original.id.slice(0, 8)}
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-4 w-full">
          <span className="font-medium truncate">{row.original.full_name}</span>
          <div className="flex flex-wrap gap-1">
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
        <span className="text-text/60">{row.original.submission_count}</span>
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
