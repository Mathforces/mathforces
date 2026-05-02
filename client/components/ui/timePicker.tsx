"use client";
import { Input } from "./input";

type Props = {
  initial_time?: string;
  onChangeFunc?: (time: string | undefined) => void;
};

function TimePicker({ initial_time, onChangeFunc }: Props) {
  return (
    <div>
      <Input
        type="time"
        id="time-picker"
        step="1"
        defaultValue={initial_time ? initial_time : "20:30:00"}
        onChange={(e) => onChangeFunc && onChangeFunc(e.target.value)}
        className="w-fit appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
      />
    </div>
  );
}

export default TimePicker;
