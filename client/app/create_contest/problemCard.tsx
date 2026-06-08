"use client";

import { useState } from "react";
import {
  Controller,
  useWatch,
  type Control,
  type UseFieldArrayRemove,
} from "react-hook-form";
import { useSortable } from "@dnd-kit/react/sortable";
import { ChevronDown, GripVertical, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { CreateContestFormValues } from "./page";
import { randomNum } from "@/lib/utils";

const PROBLEM_SORT_GROUP = "create-contest-problems";
const TEST_PROBLEM_LATEX_LIST = [
  String.raw`Consider a circle $\Omega$ with radius 9 and center at the origin $(0,0)$, and a disc $\Delta$ with radius 1 and center at $(r,0)$, where $0 \leq r \leq 8$. Two points $P$ and $Q$ are chosen independently and uniformly at random on $\Omega$. Which value(s) of $r$ minimize the probability that the chord $\overline{PQ}$ intersects $\Delta$?`,
  String.raw`Denote by $\mathbb{Z}^2$ the set of all points $(x,y)$ in the plane with integer coordinates. For each integer $n \geq 0$, let $P_n$ be the subset of $\mathbb{Z}^2$ consisting of the point $(0,0)$ together with all points $(x,y)$ such that $x^2 + y^2 = 2^k$ for some integer $k \leq n$. Determine, as a function of $n$, the number of four-point subsets of $P_n$ whose elements are the vertices of a square.`,
  String.raw`Determine all positive integers $n$ for which there exist positive integers $a$, $b$, and $c$ satisfying
\[
2a^n + 3b^n = 4c^n.
\]`,
  String.raw`Consider an $m$-by-$n$ grid of unit squares, indexed by $(i,j)$ with $1 \leq i \leq m$ and $1 \leq j \leq n$. There are $(m-1)(n-1)$ coins, which are initially placed in the squares $(i,j)$ with $1 \leq i \leq m-1$ and $1 \leq j \leq n-1$. If a coin occupies the square $(i,j)$ with $i \leq m-1$ and $j \leq n-1$ and the squares $(i+1,j), (i,j+1)$, and $(i+1,j+1)$ are unoccupied, then a legal move is to slide the coin from $(i,j)$ to $(i+1,j+1)$. How many distinct configurations of coins can be reached starting from the initial configuration by a (possibly empty) sequence of legal moves?`,
  String.raw`For a positive integer $N$, let $f_N$\footnote{Corrected from $F_N$ in the source.} be the function defined by 
\[
f_N(x) = \sum_{n=0}^N \frac{N+1/2-n}{(N+1)(2n+1)} \sin((2n+1)x).
\]
Determine the smallest constant $M$ such that $f_N(x) \leq M$ for all $N$ and all real $x$.`,
];
const TEST_EDITORIAL_LATEX_LIST = [
  String.raw` 
The answer is $578$. 

Each hop corresponds to adding one of the $12$ vectors $(0,\pm 5)$, $(\pm 5,0)$, $(\pm 3,\pm 4)$, $(\pm 4,\pm 3)$ to the position of the grasshopper. Since $(2021,2021) = 288(3,4)+288(4,3)+(0,5)+(5,0)$, the grasshopper can reach $(2021,2021)$ in $288+288+1+1=578$ hops.

On the other hand, let $z=x+y$ denote the sum of the $x$ and $y$ coordinates of the grasshopper, so that it starts at $z=0$ and ends at $z=4042$. Each hop changes the sum of the $x$ and $y$ coordinates of the grasshopper by at most $7$, and $4042 > 577 \times 7$; it follows immediately that the grasshopper must take more than $577$ hops to get from $(0,0)$ to $(2021,2021)$.
`,
  String.raw`

The limit is $e$.

\noindent
\textbf{First solution.}
By l'H\^opital's Rule, we have
\begin{align*}
&\lim_{r\to 0} \frac{\log((x+1)^{r+1}-x^{r+1})}{r} \\
&\quad = \lim_{r\to 0} \frac{d}{dr} \log((x+1)^{r+1}-x^{r+1}) \\
&\quad = \lim_{r\to 0} \frac{(x+1)^{r+1}\log(x+1)-x^{r+1}\log x}{(x+1)^{r+1}-x^{r+1}} \\
&\quad = (x+1)\log(x+1)-x\log x,
\end{align*}
where $\log$ denotes natural logarithm. It follows that $g(x) = e^{(x+1)\log(x+1)-x\log x} = \frac{(x+1)^{x+1}}{x^x}$. Thus
\[
\lim_{x\to\infty} \frac{g(x)}{x} = \left(\lim_{x\to\infty}\frac{x+1}{x}\right) \cdot \left(\lim_{x\to\infty} \left(1+\frac{1}{x}\right)^x\right) = 1\cdot e = e.
\]

\noindent
\textbf{Second solution.}
We first write 
\begin{align*}
\lim_{x \to \infty} \frac{g(x)}{x} &= \lim_{x \to \infty} \lim_{r \to 0} \frac{((x+1)^{r+1} - x^{r+1})^{1/r}}{x} \\
&= \lim_{x \to \infty} \lim_{r \to 0} \frac{((r+1) x^r + O(x^{r-1}))^{1/r}}{x}.
\end{align*}
We would like to interchange the order of the limits, but this requires some justification.
Using Taylor's theorem with remainder, for $x \geq 1$, $r \leq 1$
we can bound the error term $O(x^{r-1})$ in absolute value by $(r+1) r x^{r-1}$. This
means that if we continue to rewrite the orginial limit as
\[
\lim_{r\to 0} \lim_{x\to\infty} (r+1+O(x^{-1}))^{1/r},
\]
the error term $O(x^{-1})$ is bounded in absolute value by $(r+1) r/x$.
For $x \geq 1$, $r \leq 1$ this quantity is bounded in absolute value by $(r+1)r$, \emph{independently of $x$}. This allows us to continue by interchanging the order of the limits,
obtaining 
\begin{align*}
&\lim_{r\to 0} \lim_{x\to\infty} (r+1+O(x^{-1}))^{1/r} \\
&\quad = \lim_{r\to 0} (r+1)^{1/r} \\
&\quad = \lim_{s\to \infty} (1+1/s)^{s} = e,
\end{align*}
where in the last step we take $s = 1/r$.

\noindent
\textbf{Third solution.} (by Clayton Lungstrum)
We first observe that
\begin{align*}
((x+1)^{r+1} - x^{r+1})^{1/r}
&= \left( \int_x^{x+1} (r+1)u^r\,du \right)^{1/r} \\
&= (r+1)^{1/r} \left( \int_x^{x+1} u^r\,du \right)^{1/r}.
\end{align*}
Since $\lim_{r \to 0} (r+1)^{1/r} = e$, we deduce that
\[
g(x) = e \lim_{r \to 0} \left( \int_x^{x+1} u^r\,du \right)^{1/r}.
\]
For $r > 0$, $u^r$ is increasing for $x \leq u \leq x+1$, so
\[
x^r \leq \int_x^{x+1} u^r\,du \leq (x+1)^r;
\]
for $r < 0$, $u^r$ is decreasing for $x \leq u \leq x+1$, so
\[
x^r \geq \int_x^{x+1} u^r\,du \geq (x+1)^r.
\]
In both cases, we deduce that
\[
x \leq \left( \int_x^{x+1} u^r\,du \right)^{1/r} \leq x+1;
\]
applying the squeeze theorem to the resulting inequality
 $e \leq \frac{g(x)}{x} \leq e\left( 1 + \frac{1}{x} \right)$
 yields the claimed limit.
`,
];

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
  const problemName = useWatch({
    control,
    name: `problems.${index}.name`,
  });
  const cardTitle = `${index + 1}. ` + (problemName?.trim() || "New problem");

  return (
    <div
      ref={ref}
      className={`relative border py-4 rounded-lg flex flex-row justify-center items-center gap-3 transition-all duration-150 ${
        isDragSource
          ? "border-primary/60 border-dashed bg-primary/15 shadow-inner"
          : "bg-background"
      }`}
    >
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className={`flex p-0  flex-col w-full gap-3 transition-opacity ${
          isDragSource ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="flex justify-between items-center gap-3 w-full px-2">
          <div className="flex">
            {/* Drag */}
            <button
              ref={handleRef}
              type="button"
              aria-label={`Drag problem ${index + 1} to reorder`}
              title="Drag to reorder"
              className={`flex h-7 w-7 cursor-grab touch-none items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing ${
                isDragSource ? "opacity-0" : "opacity-100"
              }`}
            >
              <GripVertical className="h-4 w-4" />
            </button>

            {/* Title */}
            <div className="min-w-0">
              <span className="block truncate font-semibold">{cardTitle}</span>
              <p className="text-xs text-muted-foreground">
                {isOpen ? `Contest position ${index + 1}` : "Minimized"}
              </p>
            </div>
          </div>

          {/* Collapse & Delete */}
          <div className="flex items-center gap-2">
            {/* Delete */}

            <button
              type="button"
              aria-label={`Remove ${cardTitle}`}
              onClick={() => remove(index)}
            >
              <Trash2 className="text-destructive/60 h-4 w-4" />
            </button>
            {/* Collapse */}
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
          </div>
        </div>

        <CollapsibleContent className="flex flex-col gap-3 px-4">
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
                <div className="flex items-center justify-between gap-2">
                  <FieldLabel>Problem Latex</FieldLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      field.onChange(
                        TEST_PROBLEM_LATEX_LIST[
                          randomNum(0, TEST_PROBLEM_LATEX_LIST.length - 1)
                        ],
                      )
                    }
                  >
                    Test
                  </Button>
                </div>
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
            name={`problems.${index}.difficulty`}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Difficulty</FieldLabel>
                <Input
                  type="number"
                  min={0}
                  step={1}
                  {...field}
                  placeholder="1400"
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

          <Controller
            name={`problems.${index}.editorial`}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center justify-between gap-2">
                  <FieldLabel>Editorial in Latex</FieldLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      field.onChange(
                        TEST_EDITORIAL_LATEX_LIST[
                          randomNum(0, TEST_EDITORIAL_LATEX_LIST.length - 1)
                        ],
                      )
                    }
                  >
                    Test
                  </Button>
                </div>
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
