// import { IContext } from './IContext';
import { IRequest } from './IRequest';
import { IResponse } from './IResponse';

import { RequestMethod } from './RequestMethod';

export type TPlugin = {
    use?: {
        handler: (req: IRequest, res: IResponse, next?: Function, options?: any) => any;
    }
    filter?: {
        regexp: RegExp;
        handler: (req: IRequest, res: IResponse, next?: Function, options?: any) => any;
    };
    ignore?: {
        regexp: RegExp;
        handler: (req: IRequest, res: IResponse, next?: Function, options?: any) => any;
    };
    method?: {
        type: RequestMethod | RequestMethod[];
        handler: (req: IRequest, res: IResponse, next?: Function, options?: any) => any;
    };
    results?: { [key: string]: any };
    context?: { [key: string]: any };
    request?: { [key: string]: any };
    response?: { [key: string]: any };
}
