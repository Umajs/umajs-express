import * as statuses from 'statuses';
import * as assert from 'assert';
import Uma from '../core/Uma';
import typeHelper from '../utils/typeHelper';
import { BaseContext, IContext } from '../types/IContext';

export const Context: BaseContext = {
    send(val: string | Buffer, status?: number) {
        if (status) this.status = status;
        this.body = val;
    },

    json(data: Object) {
        this.type = 'application/json';
        this.body = data;
    },

    jsonp(data: Object, callbackField: string = 'callback') {
        const ctx: IContext = this;
        const { res } = ctx;

        Uma.app.set('jsonp callback name', callbackField);
        res.jsonp(data);
    },

    view(viewPath: string, locals: any = {}) {
        locals.ctx = this;

        return this.res.render(viewPath, locals);
    },

    get userAgent() {
        return this.header['user-agent'];
    },

    get status() {
        return this.res.statusCode;
    },

    /**
       * Set response status code. like koa ctx.status.
       * ctx.body = '313123123'
       * ctx.status = 404  return null
       * @param {Number} code
       * @api public
    */
    set status(code) {
        if (this.headerSent) return;

        assert(Number.isInteger(code), 'status code must be a number');
        assert(code >= 100 && code <= 999, `invalid status code: ${code}`);
        // eslint-disable-next-line no-underscore-dangle
        this._explicitStatus = true;
        this.res.statusCode = code;
        if (this.req.httpVersionMajor < 2) this.res.statusMessage = statuses[code];
        if (this.body && statuses.empty[code]) this.body = null;
    },

    get body() {
        const ctx: IContext = this;

        // eslint-disable-next-line no-underscore-dangle
        return ctx.res._body;
    },
    set body(val) {
        const ctx: IContext = this;

        // eslint-disable-next-line no-underscore-dangle
        ctx.res._body = val;
        // eslint-disable-next-line no-underscore-dangle
        ctx.res.send(ctx.res._body);
    },
    param: {},

    setHeader(name: string | { [key: string]: string }, value?: string | string[]): void {
        const ctx: IContext = this;

        if (ctx.res.headersSent) {
            console.error(new Error(`Cannot set headers after they are sent to the client, url: ${ctx.url}`));

            return;
        }

        if (typeHelper.isString(name) && value !== undefined) {
            ctx.set(name, value);
        }

        if (typeHelper.isObject(name)) {
            ctx.set(name);
        }
    },

    getHeader(name: string | any): any {
        return this.header[name.toLowerCase()];
    },
    get cookies() {
        const ctx: IContext = this;

        return ctx.res.cookies;
    },
};
