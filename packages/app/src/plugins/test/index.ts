import { IContext, IRequest, IResponse, TPlugin, RequestMethod, Result as R } from "@umajs-express/core";

export class Result extends R {
    static redirect2(url: string, status: number) {
        return new Result({
            type: 'redirect',
            data: {
                url,
                status,
            },
        });
    }
}

export default (): TPlugin => {
    return {
        context: {
            test: 123,
        },
        results: {
            redirect(ctx: IContext, data: any) {
                const { url, status } = data;

                ctx.res.status(status);

                return ctx.res.redirect(url);
            },
        },
        use: {
            async handler(req:IRequest, res:IResponse,next: Function) {
                console.log('use before');
                await next();
                console.log('use after');
            }
        },
        method: {
            type: RequestMethod.GET,
            async handler(req:IRequest, res:IResponse,next: Function) {
                console.log('method get before');
                await next();
                console.log('method get after');
            }
        }
    };
};
