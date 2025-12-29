import YouTubeEmbed from "./YouTubeEmbed";
import TwitterEmbed from "./TwitterEmbed";
import DocsEmbed from "./DocsEmbed";
import ArticleEmbed from "./ArticleEmbed";
import OtherEmbed from "./OtherEmbed";

const Embed = ({ linkType, link }: { linkType: string; link: string }) => {
  const embed = (linkType: string, link: string) => {
    switch (linkType) {
      case "youtube":
        return <YouTubeEmbed link={link} />;

      case "twitter":
        return <TwitterEmbed link={link} />;

      case "document":
        return <DocsEmbed link={link} />;

      case "article":
        return <ArticleEmbed link={link} />;

      case "other":
        return <OtherEmbed link={link} />;
    }
  };

  return (
    <div className="dark:bg-gray-800 bg-white">{embed(linkType, link)}</div>
  );
};

export default Embed;
