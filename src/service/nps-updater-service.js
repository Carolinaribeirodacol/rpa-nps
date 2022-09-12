import { job } from "cron";

export class NpsUpdaterService {
    /**
     * @param {import('./nps-extractor-service').NpsExtractorService} extractor
     * @param {import('../cache').Cache} cache 
     */
    constructor(extractor, cache) {
        this._extractor = extractor;
        this._cache = cache;
    }

    async boot() {
        this.job = job(
            '0 6 * * *',
            async () => {
                await this.updateNpsValue();
            }
        );
        this.job.start();
    }

    async terminate() {
        this.job.stop();
    }

    async updateNpsValue() {
        this._cache.setItem("nps-value", await this._extractor.execute());
    }
}
