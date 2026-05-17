"use client";

import dynamic from "next/dynamic";

const TutorialDriver = dynamic(
  () => import("./TutorialDriverImpl"),
  { ssr: false, loading: () => null }
);

export default TutorialDriver;
