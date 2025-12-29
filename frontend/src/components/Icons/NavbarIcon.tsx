import { useState, type ReactNode } from "react";

export const NavbarIcon = ({
  children,
  tooltip,
}: {
  children: ReactNode;
  tooltip: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative flex flex-col items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span>{children}</span>
      {open && (
        <p className="w-max absolute -bottom-8 pointer-events-none bg-linear-to-r from-blue-500 to-cyan-500 px-3 py-1 text-sm text-white rounded-lg">
          {tooltip}
        </p>
      )}
    </div>
  );
};
