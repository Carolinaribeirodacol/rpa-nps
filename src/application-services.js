import { Logger } from "simplified-logger";
import { Browser } from "./browser.js";
import { CacheWarmer } from "./cache-warmer.js";
import { Http } from "./http.js";
import { NpsExtractorRouter } from "./routes/nps-extractor-router.js";
import { NpsExtractorService } from "./service/nps-extractor-service.js";
import { NpsUpdaterService } from "./service/nps-updater-service.js";

export default {
    "app.config.env": () => {
        let appEnv = "dev";
        if ("prod" == process.env.APP_ENV) {
            appEnv = "prod";
        }

        return appEnv;
    },
    "app.service.nps-extractor": async c => {
        const browser = await c.get("app.browser");

        return new NpsExtractorService(browser);
    },
    "app.service.nps-updater": async c => {
        const extractor = await c.get("app.service.nps-extractor");
        const cache = await c.get("app.cache");

        return new NpsUpdaterService(extractor, cache);
    },
    "app.service.nps-router": async c => {
        const http = await c.get("app.http");
        const cache = await c.get("app.cache");

        return new NpsExtractorRouter(http, cache);
    },
    "app.cache": async c => {
        const extractor = await c.get("app.service.nps-extractor");

        return await CacheWarmer.execute(extractor);
    },
    "app.browser": async c => {
        const headless = "true" == process.env.BROWSER_HEADLES;
        const defaultTimeout = process.env.BROWSER_DEFAULT_TIMEOUT;

        return new Browser(headless, defaultTimeout);
    },
    "app.http": async c => {
        return new Http();
    },
    "app.logger": async c => {
        const appEnv = await c.get("app.config.env");
        let loggerLevel = levels.DEBUG;
        if ("prod" == appEnv) {
            loggerLevel = levels.INFO;
        }

        return new Logger("rpa_nps", loggerLevel);
    }
};
