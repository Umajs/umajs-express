import * as express from 'express';
import Uma from '@umajs-express/core';
import { Router } from '@umajs-express/router';
import { TUmaOption } from '@umajs-express/core';

const options: TUmaOption = {
    Router,
    bodyParser: true,
    ROOT: __dirname,
    env: process.argv.indexOf('production') > -1 ? 'production' : 'development',
};

(async () => {
    if (process.argv.indexOf('--express') > -1) {
        const app = express();

        app.use(await Uma.middleware(options, app));

        app.listen(8058);
    } else {

        const uma = Uma.instance(options);

        uma.start(8058);
    }
})();
