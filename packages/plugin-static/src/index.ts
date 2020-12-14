import * as Express from 'express';

export type staticOptions = {
    dotfiles: string,
    etag: boolean,
    extensions: Array<string>,
    index: boolean,
    maxAge: string,
    redirect: boolean,
    setHeaders: (res: Express.Response, path: string, stat: any) => any
  };

export default (uma: any, options: { root: string, opts?: staticOptions }): Express.Handler => {
    const { root = './static', opts } = options;

    return Express.static(root, opts);
};
