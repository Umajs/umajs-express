import { Server, IncomingMessage, ServerResponse } from 'http';
import { Http2ServerRequest, Http2ServerResponse } from 'http2';
import * as Express from 'express';

import Uma from '../core/Uma';

import { TJsonpBody } from './TJsonpBody';

export type TUmaOption = {
    Router: () => Express.Handler,
    ROOT: string,
    env?: 'development' | 'production' | string,
    strictDir?: boolean,
    configPath?: string,
    proxy?: boolean,
    subdomainOffset?: number,
    jsonpBody?: TJsonpBody,
    bodyParser?: boolean,
    createServer?: (cb: (req: IncomingMessage | Http2ServerRequest, res: ServerResponse | Http2ServerResponse) => void) => Server,
    beforeLoad?: (uma: Uma) => void,
    afterLoaded?: (uma: Uma) => void,
}

export interface TUmaApp extends Express.Application{
    callback?:Function
}
