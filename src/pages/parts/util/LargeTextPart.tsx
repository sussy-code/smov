import { BrandPill } from "@/components/layout/BrandPill";
import { BlurEllipsis } from "@/pages/layouts/SubPageLayout";

export function LargeTextPart(props: {
  iconSlot?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-center items-center h-screen text-center font-medium">
      {/* Overlayed elements */}
      <BlurEllipsis />
      <div className="right-[calc(2rem+env(safe-area-inset-right))] top-6 absolute">
        <BrandPill />
      </div>

      {/* Content */}
      {props.iconSlot ? props.iconSlot : null}
      <div className="max-w-[19rem] mt-3 mb-12 text-type-secondary">
        {props.children}
      </div>
    </div>
  );
}
