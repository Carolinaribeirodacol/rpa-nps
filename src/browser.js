import puppeteer from "puppeteer";

/**
 * Manipula navegador de internet
 */
export class Browser {
    /**
     * @param {boolean} headless 
     * @param {number} defaultTimeout
     */
    constructor(headless, defaultTimeout) {
        this._headless = headless;
        this._defaultTimeout = defaultTimeout;
    }

    /**
     * @param {string} url 
     *
     * @returns {Promise<Page>}
     */
    async getPage() {
        const browser = await puppeteer.launch({
            headless: this._headless,
            ignoreHTTPSErrors: true,
            args: [
                "--no-sandbox",
                "--disable-gpu",
                "--disable-dev-shm-usage",
                "--disable-setuid-sandbox",
                "--ignore-certificate-errors",
                "--ignore-certificate-errors-spki-list",
                "--enable-features=NetworkService",
                "--single-process",
                "--no-zygote",
                "--aggressive-cache-discard",
                "--disable-cache",
                "--disable-application-cache",
                "--disable-offline-load-stale-cache",
                "--disable-gpu-shader-disk-cache",
                "--media-cache-size=0",
                "--disk-cache-size=0"
            ]
        });
        const ppage = await browser.newPage();
        await ppage.setViewport({ width: 1024, height: 768 });
        ppage.setDefaultTimeout(this._defaultTimeout);
        ppage.setDefaultNavigationTimeout(this._defaultTimeout);

        return new Page(ppage);
    }
}

/**
 * Manipula elementos da página
 */
export class Page {
    /**
     * @param {puppeteer.Page} puppeteerPage 
     */
    constructor(puppeteerPage) {
        this._page = puppeteerPage;
    }

    /**
     * Navega pela página indicada
     * @param {string} url 
     */
    async navigate(url) {
        await this._page.goto(url, { waitUntil: "load" });
    }

    /**
     * Retorna o HTML interno do element
     * @param {string} selector
     */
    async innerHtml(selector) {
        const s = await this._page.waitForSelector(selector);
        const content = await s.evaluate(e => e.innerHTML);

        return content;
    }

    /** 
     * Aguarda até o navegador acabar de carregar e liberar a rede
     */
    async waitForNetworkIdle() {
        await this._page.waitForNetworkIdle();
    }

    /**
     * Encerra a navegação e o browser
     */
    async close() {
        let browser = await this._page.browser();
        await this._page.close();
        await browser.close();
    }
}
