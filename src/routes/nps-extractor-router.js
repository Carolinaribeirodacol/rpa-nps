export class NpsExtractorRouter {
    /**
     * @param {import('../http').Http} http
     * @param {import('../cache').Cache} cache
     */
    constructor(http, cache) {
        this._http = http;
        this._cache = cache;
    }

    async boot() {
        const router = await this._http.createRouter("/");
        // const cache = this._cache;
        router.get("/nps-value", (rq, rs) => {
            // let nps_value = this._cache.getItem("nps-value");
            rs.json({ nps_value: this._cache.getItem("nps-value") });
        });
    }

    async terminate() {
        // nothing
    }
}
