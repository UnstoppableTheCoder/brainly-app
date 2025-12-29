const Document = ({ link }: { link: string }) => {
  return (
    <div className="flex-1 hover:scale-101 duration-300 transition-all">
      {link.includes("youtube.com") || link.includes("twitter.com") ? (
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
      ) : (
        <>
          <div className="w-full h-56 rounded-lg flex justify-center items-center flex-col gap-y-2">
            <p className="bg-linear-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent text-5xl font-bold">
              Document
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

export default Document;
