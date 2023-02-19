import { Helmet } from "react-helmet";

export function Overlay(props: { children: React.ReactNode }) {
  return (
    <>
      <Helmet>
        <body data-no-scroll />
      </Helmet>
      <div className="fixed inset-0 z-[99999] flex h-full w-full items-center justify-center bg-[rgba(8,6,18,0.85)]">
        {props.children}
      </div>
    </>
  );
}
