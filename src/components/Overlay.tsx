import { Helmet } from "react-helmet";

import { Transition } from "@/components/Transition";

export function Overlay(props: { children: React.ReactNode }) {
  return (
    <>
      <Helmet>
        <body data-no-scroll />
      </Helmet>
      <div className="fixed inset-0 z-[99999]">
        <Transition
          animation="fade"
          className="absolute inset-0 bg-[rgba(8,6,18,0.85)]"
          isChild
        />
        {props.children}
      </div>
    </>
  );
}
