import { Icon, Icons } from "@/components/Icon";

interface StatusCircle {
  type: "loading" | "done" | "error" | "pending" | "noresult";
}

interface StatusCircleLoading extends StatusCircle {
  type: "loading";
  percentage: number;
}

function statusIsLoading(
  props: StatusCircle | StatusCircleLoading
): props is StatusCircleLoading {
  return props.type === "loading";
}

export function StatusCircle(props: StatusCircle | StatusCircleLoading) {
  let classes = "";
  if (props.type === "loading") classes = "text-video-scraping-loading";
  if (props.type === "noresult")
    classes = "text-video-scraping-noresult text-opacity-50";
  if (props.type === "error")
    classes = "text-video-scraping-error bg-video-scraping-error";

  return (
    <div
      className={[
        "p-0.5 border-current border-2 rounded-full h-6 w-6 relative",
        classes || "",
      ].join(" ")}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        className="rounded-full -rotate-90"
      >
        {statusIsLoading(props) ? (
          <circle
            strokeWidth="32"
            strokeDasharray={`${props.percentage} 100`}
            r="25%"
            cx="50%"
            cy="50%"
            fill="transparent"
            stroke="currentColor"
          />
        ) : null}
      </svg>
      {props.type === "error" ? (
        <Icon className="absolute inset-0 text-white" icon={Icons.X} />
      ) : null}
    </div>
  );
}
