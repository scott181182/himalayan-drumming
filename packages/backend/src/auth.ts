import { fromNodeHeaders } from "better-auth/node";
import type { Handler } from "express";



export const authGuardMiddleware: Handler = async (req, res, next) => {
    const session = await res.locals.auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });

    if (session?.user) {
        res.locals.user = session.user;

        next();
    } else {
        res.status(401).json({
            error: "You must be logged in to access this resource",
        });
    }
};