const path = require("path");
const fs = require("fs/promises");
const { existsSync } = require("fs");
const _ = require("lodash");

function bootstrap(cb) {
  cb();
}

const langs = [
  "en",
  "cs",
  "de",
  "fr",
  "it",
  "nl",
  "pirate",
  "pl",
  "tr",
  "vi",
  "zh"
];

const convert = `
global.name	global.name
search.loading	player.menus.episodes.loadingTitle
search.loading	player.menus.episodes.loadingList
search.allResults	home.search.allResults
search.headingTitle	home.search.sectionTitle
search.noResults	home.search.noResults
search.allFailed	home.search.failed
search.bookmarks	home.bookmarks.sectionTitle
search.loading	home.search.loading
search.continueWatching	home.continueWatching.sectionTitle
search.placeholder	home.search.placeholder
media.movie	media.types.movie
media.series	media.types.show
seasons.seasonAndEpisode	media.episodeDisplay
media.errors.genericTitle	player.playbackError.title
notFound.genericTitle	player.metadata.notFound.badge
notFound.backArrow	player.metadata.notFound.homeButton
notFound.media.title	player.metadata.notFound.title
notFound.media.description	player.metadata.notFound.text
notFound.genericTitle	notFound.badge
notFound.backArrow	notFound.goHome
notFound.page.title	notFound.title
notFound.page.description	notFound.message
errors.offline	navigation.banner.offline
videoPlayer.popouts.uploadCustomCaption	player.menus.captions.customChoice
videoPlayer.popouts.captionPreferences.title	player.menus.captions.customizeLabel
videoPlayer.popouts.captions	player.menus.captions.title
videoPlayer.popouts.sources	player.menus.sources.title
videoPlayer.popouts.close	overlays.close
videoPlayer.buttons.episodes	player.menus.episodes.button
videoPlayer.backToHome	player.back.default
videoPlayer.backToHomeShort	player.back.short
searchBar.movie	media.types.movie
searchBar.series	media.types.show
`;

const translations = convert
  .trim()
  .split("\n")
  .map((row) => row.split("\t"));

console.log(translations);

const oldBasePath = path.join(__dirname, "./setup/locales/");
const newBasePath = path.join(__dirname, "./assets/locales/");

bootstrap(async () => {
  for (let lang of langs) {
    const oldFile = JSON.parse(
      await fs.readFile(oldBasePath + lang + "/translation.json")
    );

    let newFile = {};
    if (existsSync(newBasePath + lang + ".json")) {
      newFile = JSON.parse(await fs.readFile(newBasePath + lang + ".json"));
    }

    for (let mapping of translations) {
      const value = _.get(oldFile, mapping[0]);
      if (value) {
        _.set(newFile, mapping[1], value);
      }
    }

    await fs.mkdir(newBasePath, { recursive: true });
    await fs.writeFile(
      newBasePath + lang + ".json",
      JSON.stringify(newFile, null, 2)
    );
  }
});
