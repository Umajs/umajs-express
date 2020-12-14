import * as Application from 'express';
import * as Cookies from 'cookies';

import { IContext } from './IContext';
import { IRequest } from './IRequest';

export interface BaseResponse {}

export interface IResponse extends Application.Response, BaseResponse {
    _body?: any;
    ctx: IContext;
    cookies:Cookies
    request: IRequest;
}
