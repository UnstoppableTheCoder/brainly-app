import type { Types } from "mongoose";
import type { Dispatch, SetStateAction } from "react";

export type LinkType =
  | "youtube"
  | "twitter"
  | "document"
  | "article"
  | "other"
  | "";

export interface Tag {
  _id: string | Types.ObjectId;
  tag: string;
}

export interface ContentType {
  _id?: Types.ObjectId;
  title: string;
  link: string;
  linkType: LinkType;
  tags: [{ _id: Types.ObjectId; tag: string }];
  userId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export type ContentsType = ContentType[];

export interface ContentContextType {
  contents: ContentsType;
  setContents: Dispatch<SetStateAction<ContentsType>>;
  filteredContents: ContentsType;
  filter: Filter;
  setFilter: Dispatch<SetStateAction<Filter>>;
}

export type Filter =
  | "youtube"
  | "twitter"
  | "document"
  | "article"
  | "other"
  | "all";
