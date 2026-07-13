import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  clean?: boolean;
}

export default function Container({
  children,
  clean = false,
  className = "",
  ...props
}: ContainerProps) {
  if (clean) {
    return (
      <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div className={`mx-auto w-full max-w-7xl px-6 sm:px-12 lg:px-20 ${className}`} {...props}>
      {children}
    </div>
  );
}
