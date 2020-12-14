import { TPluginConfig } from '@umajs-express/core';

export default <{[key: string]: TPluginConfig}>{
    'session': true,
    'i18n': {
        enable: true,
        name: 'i18n',
        options: {
            defaultLocale: 'zh-cn',
        },
    },
    'static': {
        options: {
            root: './static',
            opts: {
            },
        },
    },
    'test': true,
    'views': {
        enable: true,
        name: 'views',
        options: {
            root: './views',
            opts: {
                map: { html: 'nunjucks' },
            },
        },
    },
};
