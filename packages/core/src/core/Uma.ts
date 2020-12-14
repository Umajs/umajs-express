import * as Express from 'express';
import * as path from 'path';
import * as http from 'http';
import * as https from 'https';
import * as bodyParser from 'body-parser';
import * as Cookies from 'cookies';

import AspectLoader from '../loader/AspectLoader';
import ControllerLoader from '../loader/ControllerLoader';
import ServiceLoader from '../loader/ServiceLoader';
import ResourceLoader from '../loader/ResourceLoader';
import ConfigLoader from '../loader/ConfigLoader';
import PluginLoader from '../loader/PluginLoader';
import controllerInfo from '../info/controllerInfo';
import { packageInfo } from '../info/packageInfo';
import { Context } from '../extends/Context';
import { crateContext } from '../core/context';

import typeHelper from '../utils/typeHelper';
import mixin from '../utils/mixin';
import { TUmaOption, TUmaApp } from '../types/TUmaOption';
import { IContext } from '../types/IContext';

import { TConfig } from '../types/TConfig';
import { TControllerInfo } from '../types/TControllerInfo';
import { TPluginConfig } from '../types/TPluginConfig';
import { IRequest } from '../types/IRequest';
import { IResponse } from '../types/IResponse';

let instance: Uma = null;

export default class Uma {
    private constructor(readonly options: TUmaOption, app?:Express.Application) {
        console.assert(options && options.ROOT, `Uma options.ROOT must set value. e.g { ROOT: './src' }, now ${JSON.stringify(options)}`);

        this.options = mixin(true, {
            jsonpBody: {},
            configPath: path.resolve(options.ROOT, 'config'),
            env: process.env.NODE_ENV,
            strictDir: false,
        }, options);

        const { env } = this.options;

        process.env.NODE_ENV = env;

        this.env = env;
        this.app = app || Express();
    }

    env: string;

    app: TUmaApp = null;

    server: http.Server | https.Server;

    callback: Function;

    port: number;

    routers: string[] = [];

    config: TConfig;

    private async load() {
        this.loadConfig();

        this.loadAspect();

        this.loadResource();

        if (!this.options.strictDir) {
            this.loadService();

            this.loadController();
        }

        await this.loadPlugin();
    }

    loadConfig() {
        ConfigLoader.loadConfigDir(this.options.configPath);
        Object.freeze(ConfigLoader.config);
        this.config = ConfigLoader.config;
    }

    loadAspect() {
        AspectLoader.loadAspectDir(path.resolve(this.options.ROOT, 'aspect'));
    }

    loadResource() {
        // ['aspect', 'plugins'] reserved dir
        const reservedDir = ['aspect', 'plugins'];

        if (!this.options.strictDir) {
            reservedDir.push('controller', 'service');
        }

        ResourceLoader.loadResourceDir(this.options.ROOT, reservedDir);
    }

    loadService() {
        ServiceLoader.loadServiceDir(path.resolve(this.options.ROOT, 'service'));
    }

    loadController() {
        ControllerLoader.loadControllerDir(path.resolve(this.options.ROOT, 'controller'));
    }

    async loadPlugin() {
        if (this.options.bodyParser) {
            this.app.use(bodyParser.urlencoded({ extended: false }));
            // parse application/json
            this.app.use(bodyParser.json(this.options.jsonpBody));
        }

        await PluginLoader.loadDir(this.options.ROOT);
    }

    use(mw: Express.Handler) {
        this.app.use(mw);
    }

    get context(): IContext {
        return Context;
    }

    async start(port: number = 8058, callback?: Function) {
        if (!this.port) this.port = port;
        if (callback) this.callback = callback;

        const { app, options: { createServer, Router, beforeLoad, afterLoaded } } = this;

        if (typeHelper.isFunction(beforeLoad)) await Promise.resolve(Reflect.apply(beforeLoad, this, [this]));

        await this.load();
        this.use(Cookies.express(['keyboard umajs']));
        this.use(Router());

        if (typeHelper.isFunction(afterLoaded)) await Promise.resolve(Reflect.apply(afterLoaded, this, [this]));

        if (createServer) {
            console.assert(typeHelper.isFunction(createServer), 'config.createServer must be a function');
        }

        app.callback = () => {
            const umaApp = app;

            return (req:IRequest, res:IResponse) => {
                crateContext(req, res); // create ctx in req,res
                umaApp(req, res);
            };
        }; // fix _tests_  use app.callback in umajs

        this.server = createServer ? createServer(app) : http.createServer(app.callback());
        this.app.use((req:IRequest) => {
            const { ctx } = req;

            ctx.status = 404;
            ctx.body = 'Not Found';
        });// 404 保持和umajs一致 兼容单元测试
        this.server.listen(this.port, async () => {
            console.log(`Uma server running at port: ${this.port} `);
            console.log(`Uma version: ${packageInfo.version}`);

            if (typeof this.callback === 'function') {
                await Promise.resolve(Reflect.apply(this.callback, this, []));
            }
        });
    }

    // static property start
    static version:string = packageInfo.version;

    static use(mw: Express.Handler) {
        Uma.instance().use(mw);
    }

    static get env() {
        return Uma.instance().env;
    }

    static get app() {
        return Uma.instance().app;
    }

    static get server() {
        return Uma.instance().server;
    }

    static get options() {
        return Uma.instance().options;
    }

    static get config() {
        return ConfigLoader.config;
    }

    static get pluginConfig(): boolean | TPluginConfig {
        return ConfigLoader.config.plugin;
    }

    static get pluginKeys(): string[] {
        const pluginKeys = [];

        for (const [name, config] of Object.entries(Uma.config.plugin)) {
            if (config === true) {
                pluginKeys.push(name);
            } else if (config === false) {
                continue;
            } else if (config.enable === true) {
                pluginKeys.push(name);
            }
        }

        return pluginKeys;
    }

    static pluginOptions(pluginName: string) {
        const pluginCfg = Uma.config.plugin[pluginName];

        return typeHelper.isBoolean(pluginCfg) ? {} : pluginCfg.options;
    }

    static get context(): IContext {
        return Uma.instance().context;
    }

    /**
     * getControllerInfo()
     */
    static get controllersInfo(): IterableIterator<TControllerInfo> {
        return controllerInfo.getControllersInfo();
    }

    /**
     * Uma instance     eg. Uma.instance({...})
     * Uma getInstance  eg. Uma.instance()
     * @param options Uma options
     */
    static instance(options?: TUmaOption): Uma {
        if (instance) return instance;

        instance = new Uma(options);

        return instance;
    }

    /**
     * (async () => {
     *     const app = Express();
     *     app.use(await Uma.middleware({...}, app));
     * })();
     * @param options Uma options
     * @param app Express instance
     */
    static async middleware(options: TUmaOption, app: Express.Application): Promise<Express.Handler> {
        if (instance) throw new Error('Uma can only be instantiated once, app.use(Uma.middleware({...}))');
        app.use(Cookies.express(['keyboard umajs']));
        app.use((req:IRequest, res:IResponse, next:Function) => {
            crateContext(req, res); // create ctx in req,res
            next();
        });

        instance = new Uma(options, app);

        await instance.load();

        return this.options.Router();
    }
}
