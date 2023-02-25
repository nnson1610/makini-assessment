import { Request, Response, NextFunction } from 'express';
import { query, validationResult } from 'express-validator';

export const validateGetHierarchy = [
    query('size').optional().isInt({ min: 1, max: 100 }),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
        return;
    },
];

export const validateGetDrawing = [
    query('size').optional().isInt({ min: 1, max: 100 }),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
        return;
    },
];

export const validateGetServicePlanner = [
    query('size').optional().isInt({ min: 1, max: 100 }),
    query('startDate').optional().isISO8601(),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
        return;
    },
];
