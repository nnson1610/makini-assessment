import * as express from 'express';
import * as path from 'path';
import { MainController } from './controller/main.controller';
import logger from "../src/common/logger";
import Container, { Service } from "typedi";

@Service()
export class App {
    private app: express.Application;

    constructor(private mainController: MainController) {
        this.app = express();
        this.config();
        this.routes();
    }

    private config(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        const viewsPath = path.join(__dirname, './', 'view');
        this.app.set('views', viewsPath);
        this.app.set("view engine", "ejs");
    }

    private routes(): void {
        this.app.use('/', this.mainController.getRouter())
    }

    public start(): void {
        const port = process.env.PORT || 3000;
        this.app.listen(port, () => {
            logger.info(`Server started on port ${port}`);
        });
    }
}

const app = Container.get(App);
app.start();


