"use client";

import { useState } from "react";
import {
  Controller,
  type Control,
  type UseFieldArrayRemove,
} from "react-hook-form";
import { useSortable } from "@dnd-kit/react/sortable";
import { ChevronDown, GripVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { CreateContestFormValues } from "./page";

const PROBLEM_SORT_GROUP = "create-contest-problems";

type SortableProblemCardProps = {
  fieldId: string;
  index: number;
  control: Control<CreateContestFormValues>;
  remove: UseFieldArrayRemove;
};

export default function ProblemCard({
  fieldId,
  index,
  control,
  remove,
}: SortableProblemCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const { handleRef, isDragSource, ref } = useSortable({
    id: fieldId,
    index,
    group: PROBLEM_SORT_GROUP,
  });

  return (
    <div
      ref={ref}
      className={`relative border p-4 pt-12 rounded-lg flex flex-col gap-3 transition-all duration-150 ${
        isDragSource
          ? "border-primary/60 border-dashed bg-primary/15 shadow-inner"
          : "bg-background"
      }`}
    >
      <button
        ref={handleRef}
        type="button"
        aria-label={`Drag problem ${index + 1} to reorder`}
        title="Drag to reorder"
        className={`absolute left-3 top-3 flex h-7 w-7 cursor-grab touch-none items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing ${
          isDragSource ? "opacity-0" : "opacity-100"
        }`}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className={`flex flex-col gap-3 transition-opacity ${
          isDragSource ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="flex justify-between items-center gap-3">
          <div>
            <span className="font-semibold">Problem {index + 1}</span>
            <p className="text-xs text-muted-foreground">
              {isOpen ? `Contest position ${index + 1}` : "Minimized"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CollapsibleTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label={isOpen ? "Minimize problem" : "Expand problem"}
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => remove(index)}
            >
              Remove
            </Button>
          </div>
        </div>

        <CollapsibleContent className="flex flex-col gap-3">
          <Controller
            name={`problems.${index}.name`}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Name</FieldLabel>
                <Input
                  {...field}
                  placeholder="Problem name"
                  value={field.value ?? ""}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name={`problems.${index}.description_latex`}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Problem Latex</FieldLabel>
                <Input
                  {...field}
                  placeholder="Problem Latex"
                  value={field.value ?? ""}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name={`problems.${index}.editorial`}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Editorial in Latex</FieldLabel>
                <Input {...field} placeholder="Editorial in Latex" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name={`problems.${index}.points`}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Points</FieldLabel>
                <Input
                  type="number"
                  {...field}
                  placeholder="Points"
                  value={field.value ?? ""}
                  onChange={(event) =>
                    field.onChange(
                      event.target.value ? Number(event.target.value) : null,
                    )
                  }
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
