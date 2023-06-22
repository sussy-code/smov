import { mwFetch } from "@/backend/helpers/fetch";
import { registerProvider } from "@/backend/helpers/register";
import { MWStreamQuality, MWStreamType } from "@/backend/helpers/streams";
import { MWMediaType } from "@/backend/metadata/types/mw";

const remotestreamBase = `https://fsa.remotestre.am`;

registerProvider({
  id: "remotestream",
  displayName: "Remote Stream",
  disabled: false,
  rank: 55,
  type: [MWMediaType.MOVIE, MWMediaType.SERIES],

  async scrape({ media, episode, progress }) {
    if (!this.type.includes(media.meta.type)) {
      throw new Error("Unsupported type");
    }

    progress(30);
    const type = media.meta.type === MWMediaType.MOVIE ? "Movies" : "Shows";
    let playlistLink = `${remotestreamBase}/${type}/${media.tmdbId}`;

    if (media.meta.type === MWMediaType.SERIES) {
      const seasonNumber = media.meta.seasonData.number;
      const episodeNumber = media.meta.seasonData.episodes.find(
        (e) => e.id === episode
      )?.number;

      playlistLink += `/${seasonNumber}/${episodeNumber}/${episodeNumber}.m3u8`;
    } else {
      playlistLink += `/${media.tmdbId}.m3u8`;
    }

    const streamRes = await mwFetch<Blob>(playlistLink);
    if (streamRes.type !== "application/x-mpegurl")
      throw new Error("No watchable item found");
    progress(90);
    return {
      embeds: [],
      stream: {
        streamUrl: playlistLink,
        quality: MWStreamQuality.QUNKNOWN,
        type: MWStreamType.HLS,
        captions: [],
      },
    };
  },
});
