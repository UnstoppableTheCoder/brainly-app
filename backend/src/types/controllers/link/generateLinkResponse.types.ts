import type { LinkType } from "../../link.types.js";

export interface GenerateLinkRes {
  link: LinkType;
  url: string | null;
}

export interface FetchLinkRes {
  link: LinkType;
  url: string | null;
}
