import { BookOpenText, FileText, Link, Twitter, Youtube } from "lucide-react";
import type { LinkType } from "../../types/content.type";

const CardIcon = ({ linkType }: { linkType: LinkType }) => {
  const icon = (linkType: string) => {
    switch (linkType) {
      case "youtube":
        return <Youtube />;
      case "twitter":
        return <Twitter />;
      case "document":
        return <FileText />;
      case "article":
        return <BookOpenText />;
      case "other":
        return <Link />;
    }
  };

  return <div>{icon(linkType)}</div>;
};

export default CardIcon;
