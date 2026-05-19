import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  as?: "div" | "article" | "section";
}

const paddingMap: Record<NonNullable<CardProps["padding"]>, string> = {
  none: "p-0",
  sm: "p-3",
  md: "p-5",
  lg: "p-6",
};

export function Card({ children, className = "", padding = "md", as: Tag = "div" }: CardProps) {
  return (
    <Tag
      className={`bg-white rounded-xl border border-gray-200 ${paddingMap[padding]} ${className}`}
    >
      {children}
    </Tag>
  );
}
