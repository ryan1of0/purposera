import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mission map",
  description:
    "The capabilities your mission needs, who could help carry them, and where to start.",
};

export default function MissionLayout({ children }: LayoutProps<"/mission">) {
  return children;
}
