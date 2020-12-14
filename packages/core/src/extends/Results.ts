import { CALLBACK_FIELD, VIEW_PATH, DOWNLOAD_PATH } from '../info/UniqueKey';
import { IContext } from '../types/IContext';
import { IResults, TResultStreamData, TResultRedirectData, TResultDownData, TResultViewData, TResultJsonData, TResultJsonpData } from '../types/IResult';
// import LazyModules from '../loader/LazyModules';

export const Results: IResults = {
    done(ctx: IContext) {
        return ctx.res.end();
    },
    send(ctx: IContext, data: any) {
        return ctx.send(data);
    },
    json(ctx: IContext, data: TResultJsonData) {
        return ctx.json(data);
    },
    jsonp(ctx: IContext, data: TResultJsonpData) {
        const { [CALLBACK_FIELD]: callbackField, ...jsonpData } = data;

        return ctx.jsonp(jsonpData, callbackField);
    },
    view(ctx: IContext, data: TResultViewData) {
        const { [VIEW_PATH]: viewPath, ...viewData } = data;

        return ctx.view(viewPath, viewData);
    },
    stream(ctx: IContext, data: TResultStreamData) {
        const { data: streamData, fileName } = data;

        if (fileName) ctx.response.attachment(fileName);

        return ctx.res.send(streamData);
    },
    download(ctx: IContext, data: TResultDownData) {
        const { [DOWNLOAD_PATH]: downloadPath, ...downloadOpts } = data;

        if (!ctx.response.type && !ctx.response.get('Content-Disposition')) ctx.response.attachment(downloadPath);

        return ctx.res.sendFile(downloadPath, downloadOpts);
        // return LazyModules.send(ctx, downloadPath, downloadOpts);
    },
    redirect(ctx: IContext, data: TResultRedirectData) {
        const { url, status = 302 } = data;

        return ctx.res.redirect(status, url);
    },
};
