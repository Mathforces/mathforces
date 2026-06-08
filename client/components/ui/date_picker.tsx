"use client";
import { ChevronDownIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Field, FieldError, FieldLabel } from "./field";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { useState } from "react";
import { format } from "date-fns";
import { ControllerRenderProps } from "react-hook-form";
type Props = {
  initial_date?: Date;
  onChangeFunc?: (date: Date | undefined) => void;
};

function DatePicker({ initial_date, onChangeFunc }: Props) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    initial_date ?? new Date(),
  );
  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker"
            className="w-fit justify-between font-normal"
          >
            {date ? format(date, "PPP") : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto border-none overflow-hidden p-0"
          align="start"
        >
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            defaultMonth={date}
            onSelect={(date) => {
              onChangeFunc && onChangeFunc(date);
              setDate(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DatePicker;
