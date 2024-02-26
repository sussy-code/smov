import {
  ProgressEpisodeItem,
  ProgressItem,
  ProgressMediaItem,
  ProgressSeasonItem,
} from "@/stores/progress";

export interface ShowProgressResult {
  episode?: ProgressEpisodeItem;
  season?: ProgressSeasonItem;
  progress: ProgressItem;
  show: boolean;
}

const defaultProgress = {
  duration: 0,
  watched: 0,
};

function progressIsCompleted(duration: number, watched: number): boolean {
  const timeFromEnd = duration - watched;

  // too close to the end, is completed
  if (timeFromEnd < 60 * 2) return true;

  // satisfies all constraints, not completed
  return false;
}

function progressIsNotStarted(duration: number, watched: number): boolean {
  // too short watch time
  if (watched < 20) return true;

  // satisfies all constraints, not completed
  return false;
}

function progressIsAcceptableRange(duration: number, watched: number): boolean {
  // not started enough yet, not acceptable
  if (progressIsNotStarted(duration, watched)) return false;

  // is already at the end, not acceptable
  if (progressIsCompleted(duration, watched)) return false;

  // satisfied all constraints
  return true;
}

export function shouldShowProgress(
  item: ProgressMediaItem,
): ShowProgressResult {
  // non shows just hide or show depending on acceptable ranges
  if (item.type !== "show") {
    return {
      show: progressIsAcceptableRange(
        item.progress?.duration ?? 0,
        item.progress?.watched ?? 0,
      ),
      progress: item.progress ?? defaultProgress,
    };
  }

  // shows only hide an item if its too early in episode, it still shows if its near the end.
  // Otherwise you would lose episode progress
  const ep = Object.values(item.episodes)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .filter(
      (epi) =>
        !progressIsNotStarted(epi.progress.duration, epi.progress.watched),
    )[0];
  const season = item.seasons[ep?.seasonId];
  if (!ep || !season)
    return {
      show: false,
      progress: defaultProgress,
    };
  return {
    season,
    episode: ep,
    show: true,
    progress: ep.progress,
  };
}
