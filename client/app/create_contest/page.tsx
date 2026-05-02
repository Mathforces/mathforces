"use client";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import MathNoise from "@/components/ui/MathNoise";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import { HEADER_MARGIN } from "@/lib/utils";
import DatePicker from "@/components/ui/date_picker";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = Record<string, never>;

const CreateContest = ({}: Props) => {
  const schema = z.object({
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
    end_date: z.date(),
    problems: problemsSchema,
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      difficulty: "easy",
      authors: "",
      topics: "",
      start_date: new Date(),
      end_date: new Date(),
      problems: [],
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "problems",
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    axios
      .post("/api/contests", data)
      .then(() => {
        toast.success("Contest created successfully!");
      })
      .catch((err) => {
        if (err.response && err.response.data.error) {
          toast.error(err.response.data.error);
        }
      });
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

          <Controller
            name="start_date"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState?.invalid}>
                <FieldLabel htmlFor="date-picker">Date</FieldLabel>

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
          {/**/}
          {/* <Controller */}
          {/*   name="end_date" */}
          {/*   control={form.control} */}
          {/*   render={({ field, fieldState }) => ( */}
          {/*     <DatePicker field={field} fieldState={fieldState} /> */}
          {/*   )} */}
          {/* /> */}
          <Separator className="my-4" />
          <h4 className="text-text">Problems</h4>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border p-4 rounded-lg flex flex-col gap-3"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">Problem {index + 1}</span>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
              </div>

              <Controller
                name={`problems.${index}.name`}
                control={form.control}
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
                name={`problems.${index}.editorial`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Editorial</FieldLabel>
                    <Input {...field} placeholder="Editorial" />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name={`problems.${index}.points`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Points</FieldLabel>
                    <Input
                      type="number"
                      {...field}
                      placeholder="Points"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : null,
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
                name={`problems.${index}.description_latex`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Description (LaTeX)</FieldLabel>
                    <Input
                      {...field}
                      placeholder="LaTeX description"
                      value={field.value ?? ""}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name={`problems.${index}.index_in_contest`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Index in Contest</FieldLabel>
                    <Input
                      type="number"
                      {...field}
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          ))}

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
