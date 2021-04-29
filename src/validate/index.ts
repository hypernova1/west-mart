import { Request, Response, NextFunction } from 'express';
import { ValidationChain, validationResult } from 'express-validator';

export const validate = (validations: ValidationChain[]) => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> => {
        await Promise.all(validations.map((validation: ValidationChain) => validation.run(req)));
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            return next();
        }
        return res.status(422).json({ errors: errors.array() });
    };
};

export default validate;