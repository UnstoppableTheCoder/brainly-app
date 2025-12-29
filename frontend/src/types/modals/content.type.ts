import type { LinkType, Tag } from "../content.type";

export interface ContentPayloadTypes {
  title: string;
  link: string;
  linkType: LinkType;
  tags: Tag[];
}
