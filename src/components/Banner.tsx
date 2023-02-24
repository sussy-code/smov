import { Icon, Icons } from "@/components/Icon";
import { useBanner } from "@/hooks/useBanner";

export function Banner(props: { children: React.ReactNode; type: "error" }) {
  const [ref] = useBanner<HTMLDivElement>("internet");
  const styles = {
    error: "bg-[#C93957] text-white",
  };
  const icons = {
    error: Icons.CIRCLE_EXCLAMATION,
  };

  return (
    <div ref={ref}>
      <div
        className={[
          styles[props.type],
          "flex items-center justify-center p-1",
        ].join(" ")}
      >
        <div className="flex items-center space-x-3">
          <Icon icon={icons[props.type]} />
          <div>{props.children}</div>
        </div>
      </div>
    </div>
  );
}
