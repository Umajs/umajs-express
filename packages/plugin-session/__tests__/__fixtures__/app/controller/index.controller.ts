import { BaseController, Result, Path } from '@umajs-express/core';

export default class Index extends BaseController {
    index() {
        this.ctx.cookies.set('c', 'cc');

        return Result.send('check cookie');
    }

    @Path('/ss')
    setsess() {
        this.ctx.session.set('s', 'ss');

        return Result.send('check-session');
    }
}
