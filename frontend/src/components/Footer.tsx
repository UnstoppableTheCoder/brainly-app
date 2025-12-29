const Footer = () => {
  return (
    <div className="bg-linear-to-r from-cyan-500 to-blue-500 text-white text-center py-5">
      <div className="text-3xl font-bold">
        Made with love by UnstoppableTheCoder
      </div>
      <div className="mt-2">
        © {new Date().getFullYear()} Unstoppable Academy, All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
