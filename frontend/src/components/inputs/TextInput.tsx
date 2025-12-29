import type { ChangeEvent } from "react";

export default function TextInput({
  name,
  placeholder,
  value,
  onChange,
}: {
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  const inputStyle =
    "border-2 placeholder:text-blue-400 text-blue-500 rounded-md outline-none border px-2 text-xl py-1 focus:ring-2 focus:ring-cyan-500 focus:border-blue-100";

  return (
    <input
      type="text"
      name={name}
      placeholder={placeholder}
      className={inputStyle}
      value={value}
      onChange={onChange}
      required
    />
  );
}
