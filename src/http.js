import express from "express";

export class Http {
    constructor() {
        this._booted = false;
        this._app = express();
        this._app.use(express.json());
    }

    async boot() {
        if (this._booted) {
            return;
        }
        const port = process.env.HTTP_SERVER_PORT ?? '80';
        this._app.listen(port);
        this._booted = true;
    }

    async terminate() {
        this._app = null;
    }

    async createRouter(baseUrl) {
        const router = express.Router();
        this._app.use(baseUrl, router);

        return new Router(router);
    }
}

export class Router {
    /**
     * @param {express.Router} router 
     */
    constructor(router) {
        this._router = router;
    }

    /**
     * @param {string} route 
     * @param {function} callback 
     */
    get(route, callback) {
        this._router.get(route, callback);
    }
}
