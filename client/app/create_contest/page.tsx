"use client";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import MathNoise from "@/components/ui/MathNoise";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";

const problemSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  submission_count: z.number().nullable(),
  correct_submission_count: z.number().nullable(),
  points: z.number().nullable(),
  likes: z.number().nullable(),
  comments_num: z.number().nullable(),
  tags: z.array(z.string()).nullable(),
  description_latex: z.string().nullable(),
  description_html: z.string().nullable(),
  answer: z.string().nullable(),
  editorial: z.string(),
  index_in_contest: z.number(),
});

const problemsSchema = z.array(problemSchema);
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { getFormattedDate, HEADER_MARGIN } from "@/lib/utils";
import DatePicker from "@/components/ui/date_picker";
import TimePicker from "@/components/ui/timePicker";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProblemCard from "./problemCard";

type Props = Record<string, never>;
const contestSchema = z.object({
  name: z
    .string()
    .min(2, "Name should be at least 2 characters long")
    .max(100, "Name should be at most 100 characters long"),
  description: z
    .string()
    .min(2, "Description should be at least 2 characters long")
    .optional(),
  difficulty: z.enum(["hard", "medium", "easy"]),
  authors: z
    .string()
    .min(8, "Authors field is too short")
    .max(100, "Authors field is too long"),
  topics: z
    .string()
    .min(8, "Topics field is too short")
    .max(100, "Topics field is too long"),
  start_date: z.date(),
  start_time: z.string(),

  end_date: z.date(),
  end_time: z.string(),
  problems: problemsSchema,
});

export type CreateContestFormValues = z.infer<typeof contestSchema>;

const CreateContest = ({}: Props) => {
  const form = useForm<CreateContestFormValues>({
    resolver: zodResolver(contestSchema),
    defaultValues: {
      name: "",
      description: "",
      difficulty: "easy",
      authors: "",
      topics: "",
      start_date: new Date(),
      start_time: getFormattedDate(new Date()).timeFull,

      end_date: new Date(),
      end_time: getFormattedDate(new Date()).timeFull,
      problems: [],
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "problems",
  });

  const onSubmit = async (data: CreateContestFormValues) => {
    const contestData = {
      ...data,
      problems: data.problems.map((problem, index) => ({
        ...problem,
        index_in_contest: index,
      })),
    };

    axios
      .post("/api/contests", contestData)
      .then(() => {
        toast.success("Contest created successfully!");
      })
      .catch((err) => {
        if (err.response && err.response.data.error) {
          toast.error(err.response.data.error);
        }
      });
  };

  const handleProblemDragEnd = (event: DragEndEvent) => {
    if (event.canceled) return;

    const sourceId = event.operation.source?.id;
    const targetId = event.operation.target?.id;
    if (!sourceId || !targetId || sourceId === targetId) return;

    const sourceIndex = fields.findIndex((field) => field.id === sourceId);
    const targetIndex = fields.findIndex((field) => field.id === targetId);
    if (sourceIndex === -1 || targetIndex === -1) return;

    move(sourceIndex, targetIndex);
  };

  return (
    <main
      className="relative flex justify-center items-center max-w-[1444]! px-0 "
      style={{ height: `calc(100vh - ${HEADER_MARGIN}px)` }}
    >
      <section className="z-10 w-full lg:w-2/4 px-5 md:px-10 max-w-4xl my-auto space-y-4">
        {/* Heading */}
        <div>
          <h3 className="text-text">Create your contest</h3>
          <p className="text-text-muted">By the community, for the community</p>
        </div>

        <form
          className="max-w-2xl mx-auto flex flex-col gap-5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">Contest Name</FieldLabel>
                <Input {...field} id="name" placeholder="Algebra Blitz 201" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="description">
                  Description{" "}
                  <span className="text-sm text-muted-foreground">
                    (optional)
                  </span>
                </FieldLabel>
                <Textarea
                  {...field}
                  id="description"
                  placeholder="The greatest competition to ever exist"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="difficulty"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="difficulty">Difficulty</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="authors"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="authors">Authors</FieldLabel>
                <Input {...field} id="authors" placeholder="Authors" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="topics"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="topics">Topics</FieldLabel>
                <Input {...field} id="topics" placeholder="Topics" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <FieldGroup className="flex items-center gap-4">
            <FieldGroup className="flex items-center flex-row gap-2">
              <Controller
                name="start_date"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState?.invalid}>
                    <FieldLabel htmlFor="date-picker">Start Date</FieldLabel>

                    <DatePicker
                      initial_date={new Date()}
                      onChangeFunc={(date) => field.onChange(date)}
                    />
                    {fieldState?.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="start_time"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState?.invalid}>
                    <FieldLabel htmlFor="date-picker">Start Time</FieldLabel>

                    <TimePicker onChangeFunc={(time) => field.onChange(time)} />

                    {fieldState?.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup className="flex items-center flex-row gap-2">
              <Controller
                name="end_date"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState?.invalid}>
                    <FieldLabel htmlFor="date-picker">End Date</FieldLabel>

                    <DatePicker
                      initial_date={new Date()}
                      onChangeFunc={(date) => field.onChange(date)}
                    />
                    {fieldState?.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="end_time"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState?.invalid}>
                    <FieldLabel htmlFor="date-picker">End Time</FieldLabel>

                    <TimePicker onChangeFunc={(time) => field.onChange(time)} />

                    {fieldState?.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldGroup>

          <Separator className="my-4" />
          <h4 className="text-text">Problems</h4>

          <DragDropProvider onDragEnd={handleProblemDragEnd}>
            {fields.map((field, index) => (
              <ProblemCard
                key={field.id}
                fieldId={field.id}
                index={index}
                control={form.control}
                remove={remove}
              />
            ))}
          </DragDropProvider>

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                id: crypto.randomUUID(),
                name: null,
                submission_count: null,
                correct_submission_count: null,
                points: null,
                likes: null,
                comments_num: null,
                tags: null,
                description_latex: null,
                description_html: null,
                answer: null,
                editorial: "",
                index_in_contest: fields.length,
              })
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Problem
          </Button>

          <Button type="submit">Submit</Button>
        </form>
      </section>
      <section className="h-full absolute w-full">
        <div className="relative w-full h-full  hidden lg:flex justify-center items-center bg-acc ent  overflow-hidden select-none">
          {/* Shadow layer */}
          <h1 className="absolute text-[150px] font-bold text-primary opacity-30 blur-3xl scale-110 flex flex-col items-center pointer-events-none ">
            <span>
              <span className="text-[170px]">N</span>UM
            </span>
            <span>ITZ</span>
          </h1>

          <MathNoise />
        </div>
      </section>
    </main>
  );
};

export default CreateContest;
