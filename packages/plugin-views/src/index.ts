import Uma, { TPlugin } from '@umajs-express/core';
import * as cons from 'consolidate';

type TExpressViewsOptions = {
    /*
    * default extension for your views
    */
    extension?: string,
    /*
    * these options will get passed to the view engine
    */
    options?: any,
    /*
    * map a file extension to an engine
    */
    map?: any,
    /*
    * replace consolidate as default engine source
    */
    engineSource?: string,
}

export type viewsOptions = {
    root?: string,
    opts?: TExpressViewsOptions,
}

export default (uma: Uma, options: viewsOptions = {}): TPlugin => {
    const { root = './views', opts = {
        extension: 'html',
        engineSource: 'pug',
    } } = options;
    const { app } = uma;

    // assign the swig engine to .html files
    opts.extension && app.engine(opts.extension, cons[opts.engineSource]);

    // set .html as the default extension
    opts.extension && app.set('view engine', opts.extension);
    // eslint-disable-next-line prefer-destructuring
    // eslint-disable-next-line no-mixed-operators
    let render = opts.extension && cons[opts.engineSource].render || null;

    // set other engin to other files
    for (const key of Object.keys(opts.map)) {
        const extension = key;
        const engin = opts.map[key];

        app.engine(extension, cons[engin]);
        render = cons[engin].render;
    }

    app.set('views', root);

    return {
        context: {
            render,
        },
    };
};
