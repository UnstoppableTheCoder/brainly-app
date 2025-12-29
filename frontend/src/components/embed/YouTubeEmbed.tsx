const YouTubeEmbed = ({ link }: { link: string }) => {
  return (
    <div className="flex-1 hover:scale-101 duration-300 transition-all">
      {link.includes("youtube.com") ? (
        <iframe
          className="w-full h-56 rounded-lg"
          // src="https://www.youtube.com/embed/-uY0KP7K2Fw"
          src={link}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>
      ) : (
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
      )}
    </div>
  );
};

export default YouTubeEmbed;
