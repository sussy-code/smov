import { initializeScraperStore } from "./helpers/register";

// TODO backend system:
//  - run providers/embedscrapers in webworkers for multithreading and isolation
//  - caption support
//  - hooks to run all providers one by one
//  - move over old providers to new system
//  - implement jons providers/embedscrapers

// providers
// -- nothing here yet
import "./providers/testProvider";

// embeds
// -- nothing here yet

initializeScraperStore();
