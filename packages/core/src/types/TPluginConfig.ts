import { Request, Response } from 'express';

export type TPluginConfig = {
    enable?: boolean;
    name?: string;
    packageName?: string;
    path?: string;
    type?: 'middleware';
    handler?: (req:Request, res:Response, next: Function) => void;
    options?: {
        [key: string]: any,
    };
}
