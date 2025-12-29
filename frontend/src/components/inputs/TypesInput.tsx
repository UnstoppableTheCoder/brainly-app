import { type ChangeEvent } from "react";
import { options } from "../../constants/linkTypeOptions";
import type { LinkType } from "../../types/content.type";

export default function TypesInput({
  name,
  linkType,
  onChange,
}: {
  name: string;
  linkType: LinkType;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}) {
  const inputStyle =
    "border-2 placeholder:text-blue-400 text-blue-500 rounded-md outline-none border px-2 text-xl py-1 focus:ring-2 focus:ring-cyan-500 focus:border-blue-100";

  return (
    <select
      className={`select ${inputStyle} bg-linear-to-r from-blue-500 to-cyan-500 text-white cursor-pointer`}
      onChange={onChange}
      name={name}
      {...(linkType ? { value: linkType } : { value: "Select the type" })}
    >
      <option className="text-gray-600" disabled={true}>
        Select the type
      </option>
      {options.map((option, index) => (
        <option className="text-blue-600" key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
