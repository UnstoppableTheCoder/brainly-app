import type { Filter } from "../../content.type";

export interface Option {
  label: string;
  value: Filter;
}

export type Options = Option[];
