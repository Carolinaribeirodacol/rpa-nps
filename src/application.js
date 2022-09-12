export class Application {
    /**
     * @param {Container} serviceContainer 
     */
    constructor(serviceContainer) {
        this.container = serviceContainer;
        process.on("uncaughtException", error => this.terminate(error));
        process.on("unhandledRejection", (reason, _) => this.terminate(reason));
        process.on("SIGTERM", () => this.terminate("Processo encerrado pelo usuário"));
    }

    async boot() {
        /** @type {import('./service/nps-updater-service').NpsUpdaterService} */
        this.updater = await this.container.get("app.service.nps-updater");
        await this.updater.boot();

        /** @type {import('./routes/nps-extractor-router').NpsExtractorRouter} */
        this.npsRoute = await this.container.get("app.service.nps-router");
        await this.npsRoute.boot();

        /** @type {import('./http').Http} */
        this.http = await this.container.get("app.http");
        await this.http.boot();
    }

    async terminate() {
        await this.http.terminate();
        await this.npsRoute.terminate();
        await this.updater.terminate();
    }
}
