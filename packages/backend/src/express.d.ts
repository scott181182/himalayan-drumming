import type { AppAuth, BetterAuthUser } from "himalayan-drumming-research-auth";
import "express";

declare global {
    namespace Express {
        export interface Locals {
            auth: AppAuth
            user?: BetterAuthUser;
        }
    }
}
