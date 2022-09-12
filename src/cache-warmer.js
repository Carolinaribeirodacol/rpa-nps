import { Cache } from "./cache.js";

export class CacheWarmer {
    /**
     * @param {import('./service/nps-extractor-service').NpsExtractorService} extractor
     * @returns {Cache}
     */
    static async execute(extractor) {
        const cache = new Cache();
        const value = await extractor.execute();
        cache.setItem("nps-value", value);

        return cache;
    }
}
