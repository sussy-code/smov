import { Icon, Icons } from "@/components/Icon";
import { ProgressRing } from "@/components/layout/ProgressRing";
import { ScrapeEventLog } from "@/hooks/useScrape";

interface MediaScrapeLogProps {
  events: ScrapeEventLog[];
}

interface MediaScrapePillProps {
  event: ScrapeEventLog;
}

function MediaScrapePillSkeleton() {
  return <div className="h-9 w-[220px] rounded-full bg-slate-800 opacity-50" />;
}

function MediaScrapePill({ event }: MediaScrapePillProps) {
  return (
    <div className="flex h-9 w-[220px] items-center rounded-full bg-slate-800 p-3 text-denim-700">
      <div className="mr-2 flex w-[18px] items-center justify-center">
        {!event.errored ? (
          <ProgressRing
            className="h-[18px] w-[18px] text-bink-700"
            percentage={event.percentage}
            radius={40}
          />
        ) : (
          <Icon icon={Icons.X} className="text-[0.85em] text-rose-400" />
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <p
          className={`overflow-hidden text-ellipsis whitespace-nowrap ${
            event.errored ? "text-rose-400" : ""
          }`}
        >
          {event.id}
        </p>
      </div>
    </div>
  );
}

export function MediaScrapeLog(props: MediaScrapeLogProps) {
  return (
    <div className="relative h-16 w-[400px] overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex h-full w-[220px] items-center">
          <div
            className="absolute inset-y-0 left-0 flex items-center gap-[16px] transition-transform duration-200"
            style={{
              transform: `translateX(${
                -1 * (220 + 16) * props.events.length
              }px)`,
            }}
          >
            <MediaScrapePillSkeleton />
            {props.events.map((v) => (
              <MediaScrapePill event={v} key={v.eventId} />
            ))}
            <MediaScrapePillSkeleton />
          </div>
        </div>
      </div>
      <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-denim-100 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-denim-100 to-transparent" />
    </div>
  );
}
