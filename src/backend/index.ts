import { initializeScraperStore } from "./helpers/register";

// TODO backend system:
//  - caption support
//  - hooks to run all providers one by one
//  - move over old providers to new system
//  - implement jons providers/embedscrapers

// providers
// -- nothing here yet
import "./providers/testProvider";
import "./providers/testProviderTwo";

// embeds
// -- nothing here yet
import "./embeds/testEmbedScraper";
import "./embeds/testEmbedScraperTwo";

initializeScraperStore();
