import { Files } from 'formidable';
import * as Application from 'express';
import * as Cookies from 'cookies';

import { IContext } from './IContext';
import { IResponse } from './IResponse';

export interface BaseRequest {

}

export interface IRequest extends Application.Request, BaseRequest {
    ctx: IContext,
    response: IResponse,
    cookies:Cookies
    body: any;
    files?: Files;
}
