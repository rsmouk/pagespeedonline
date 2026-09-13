"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type HeaderHoverTarget =
  | { type: "response"; key: string }
  | { type: "request"; key: string }
  | { type: "general"; field: string };

interface HeaderHoverContextValue {
  hovered: HeaderHoverTarget | null;
  setHovered: (target: HeaderHoverTarget | null) => void;
  isActive: (target: HeaderHoverTarget) => boolean;
}

const HeaderHoverContext = createContext<HeaderHoverContextValue | null>(null);

function targetsMatch(
  a: HeaderHoverTarget,
  b: HeaderHoverTarget
): boolean {
  if (a.type !== b.type) return false;
  if (a.type === "general" && b.type === "general") return a.field === b.field;
  if (a.type !== "general" && b.type !== "general") return a.key === b.key;
  return false;
}

export function HeaderHoverProvider({ children }: { children: ReactNode }) {
  const [hovered, setHovered] = useState<HeaderHoverTarget | null>(null);

  const isActive = (target: HeaderHoverTarget) =>
    hovered !== null && targetsMatch(hovered, target);

  return (
    <HeaderHoverContext.Provider value={{ hovered, setHovered, isActive }}>
      {children}
    </HeaderHoverContext.Provider>
  );
}

export function useHeaderHover() {
  const ctx = useContext(HeaderHoverContext);
  if (!ctx) {
    throw new Error("useHeaderHover must be used within HeaderHoverProvider");
  }
  return ctx;
}
