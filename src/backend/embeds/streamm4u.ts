import { MWEmbedType } from "@/backend/helpers/embed";
import { MWMediaType } from "../metadata/types";
import { registerEmbedScraper } from "@/backend/helpers/register";
import { MWStreamQuality, MWStreamType, MWStream } from "@/backend/helpers/streams";
import { proxiedFetch } from "@/backend/helpers/fetch";

const HOST = 'streamm4u.club';
const URL_BASE = `https://${HOST}`;
const URL_API = `${URL_BASE}/api`;
const URL_API_SOURCE = `${URL_API}/source`;

// TODO check out 403 / 404 on successfully returned video stream URLs
registerEmbedScraper({
	id: "streamm4u",
	displayName: "streamm4u",
	for: MWEmbedType.STREAMM4U,
	rank: 100,
	async getStream({ progress, url }) {

		const scrapingThreads = [];
		let streams = [];

		const sources = (await scrape(url)).sort((a, b) => Number(b.quality.replace("p", "")) - Number(a.quality.replace("p", "")));
		let preferredSourceIndex = 0;
		let preferredSource = sources[0];

		if (!preferredSource) throw new Error("No source found")

		progress(100)

		return preferredSource
	},
})

async function scrape(embed: string) {
	const sources: MWStream[] = [];

	const embedID = embed.split('/').pop();

	console.log(`${URL_API_SOURCE}/${embedID}`)
	const json = await proxiedFetch<any>(`${URL_API_SOURCE}/${embedID}`, {
		method: 'POST',
		body: `r=&d=${HOST}`
	});

	if (json.success) {
		const streams = json.data;

		for (const stream of streams) {
			sources.push({
				streamUrl: stream.file as string,
				quality: stream.label as MWStreamQuality,
				type: stream.type as MWStreamType,
				captions: []
			});
		}
	}

	return sources;
}