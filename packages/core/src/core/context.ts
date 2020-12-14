import * as delegate from 'delegates';
import mixin from '../utils/mixin';
import Uma from '../core/Uma';
import { IContext } from '../types/IContext';
import { IRequest } from '../types/IRequest';
import { IResponse } from '../types/IResponse';

export function crateContext(req:IRequest, res:IResponse) {
    const request = req; // koa中request对req进行了封装
    const response = res;// koa中response对res进行了封装

    const ctx: IContext = mixin(false, Uma.context, { req,
        res,
        request: req,
        response: res });
    // const ctx:IContext = {
    //     req,
    //     res,
    //     request: req,
    //     response: res,
    //     ...Uma.context,
    // };

    // eslint-disable-next-line no-multi-assign
    ctx.app = request.app = response.app = Uma.app;
    // 实现IRequest IResponse
    request.ctx = ctx;
    response.ctx = ctx;
    request.response = response;
    response.request = request;
    delegate.bind({ request, response })(ctx, 'response')
        .method('attachment')
        .method('redirect')
        .method('remove')
        .method('vary')
        .method('has')
        .method('set')
        .method('append')
        .method('flushHeaders')
        // .access('status')
        .access('message')
        // .access('body')
        .access('length')
        .access('type')
        .access('lastModified')
        .access('etag')
        .getter('headerSent')
        .getter('writable');
    delegate.bind({ request, response })(ctx, 'request').method('acceptsLanguages')
        .method('acceptsEncodings')
        .method('acceptsCharsets')
        .method('accepts')
        .method('get')
        .method('is')
        .access('querystring')
        .access('idempotent')
        .access('socket')
        .access('search')
        .access('method')
        .access('query')
        .access('path')
        .access('url')
        .access('accept')
        .getter('origin')
        .getter('href')
        .getter('subdomains')
        .getter('protocol')
        .getter('host')
        .getter('hostname')
        .getter('URL')
        .getter('header')
        .getter('headers')
        .getter('secure')
        .getter('stale')
        .getter('fresh')
        .getter('ips')
        .getter('ip');

    return ctx;
}
