import * as express from 'express';
import { MainService } from '../service/main.service';
import { validateGetDrawing, validateGetHierarchy, validateGetServicePlanner } from '../validator/main.validator';
import { DEFAULT_QUERY_VALUE } from '../common/constant';
import logger from '../common/logger';
import * as NodeCache from 'node-cache';
import { Service } from "typedi";
import "reflect-metadata";

@Service()
export class MainController {
    private router: express.Router = express.Router();
    private cache;

    constructor(private mainService: MainService) {
        this.cache = new NodeCache({ stdTTL: 60 });
    }

    public getRouter(): express.Router {
        this.router.get("/hierarchies", validateGetHierarchy, async (req: express.Request, res: express.Response) => {
            try {
                const cachedData = this.cache.get('hierarchy');
                if (cachedData) {
                    logger.info('Retrieved data from cache');
                    res.render("hierarchy", { data: cachedData });
                    return;
                }

                logger.info('Retrieved data from DB');
                const data = await this.mainService.buildHierarchy({
                    size: Number(req.query.size) || DEFAULT_QUERY_VALUE.SIZE
                });
                this.cache.set('hierarchy', data);
                res.render("hierarchy", { data });
            } catch (err) {
                logger.error(err);
                res.status(500).json({ error: 'Something went wrong' });
            }
        });

        this.router.get("/drawings", validateGetDrawing, async (req: express.Request, res: express.Response) => {
            try {
                const data = await this.mainService.getDrawing({
                    size: Number(req.query.size) || DEFAULT_QUERY_VALUE.SIZE
                });
                res.render("drawing_list", { data });
            } catch (err) {
                logger.error(err);
                res.status(500).json({ error: 'Something went wrong' });
            }
        });

        this.router.get("/service-planners", validateGetServicePlanner, async (req: express.Request, res: express.Response) => {
            try {
                const data = await this.mainService.getServicePlanner({
                    size: Number(req.query.size) || DEFAULT_QUERY_VALUE.SIZE,
                    startDate: req.query.startDate as string
                });
                res.render("service_planner", { data });
            } catch (err) {
                logger.error(err);
                res.status(500).json({ error: 'Something went wrong' });
            }
        });
        return this.router;
    }
}