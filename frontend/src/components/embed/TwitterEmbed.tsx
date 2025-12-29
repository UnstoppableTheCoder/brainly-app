import { useEffect } from "react";

const TwitterEmbed = ({ link }: { link: string }) => {
  useEffect(() => {
    if (window.twttr && window.twttr.widgets) {
      window.twttr.widgets.load();
    }
  }, []);

  return (
    <div className="h-56 overflow-hidden flex items-center justify-center">
      {link.includes("twitter.com") ? (
        <>
          <blockquote className="twitter-tweet">
            <a className="h-56" href={link}></a>
          </blockquote>
          <script
            async
            src="https://platform.twitter.com/widgets.js"
            charSet="utf-8"
          ></script>
        </>
      ) : (
        <>
          <div className="w-full h-56 rounded-lg flex justify-center items-center flex-col gap-y-2">
            <p className="bg-linear-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent text-5xl font-bold">
              Invalid Link Type
            </p>
            <a
              href={link}
              className="text-blue-500 text-lg hover:underline transition-all duration-100"
              target="_blank"
            >
              Click here to visit the page
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default TwitterEmbed;
