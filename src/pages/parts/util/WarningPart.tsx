import { Icon, Icons } from "@/components/Icon";
import { BlurEllipsis } from "@/pages/layouts/SubPageLayout";

export function WarningPart(props: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-center items-center h-screen text-center font-medium">
      <BlurEllipsis />
      <Icon className="text-type-danger text-2xl" icon={Icons.WARNING} />
      <div className="max-w-[19rem] mt-3 mb-12 text-type-secondary">
        {props.children}
      </div>
    </div>
  );
}
