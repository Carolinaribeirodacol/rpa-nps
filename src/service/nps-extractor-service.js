export class NpsExtractorService {
    /**
     * @param {import('../browser').Browser} browser 
     */
    constructor(browser) {
        this._browser = browser;
    }

    /**
     * @return {number}
     */
    async execute() {
        const page = await this._browser.getPage();
        await page.navigate(
            "https://app.powerbi.com/view?r=eyJrIjoiOTk0MmYwNmItYzk3YS00N2Q4LTk1NmItYWJmNGI1ZTY4MGU4IiwidCI6ImMyYzdkNjliLTI1ZTEtNGRkMy1iYjdjLWNlYzg1YTNlMTkxMyJ9"
        );
        await page.waitForNetworkIdle();
        const value = await page.innerHtml(
            "#pvExplorationHost > div > div > exploration > div > explore-canvas > div > div.canvasFlexBox > div > div.displayArea.disableAnimations.fitToPage > div.visualContainerHost.visualContainerOutOfFocus > visual-container-repeat > visual-container:nth-child(13) > transform > div > div.visualContent > div > visual-modern > div > svg > g:nth-child(1) > text > tspan"
        );
        await page.close();

        return parseFloat(value.replace(',', '.'));
    }
}
