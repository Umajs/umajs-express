# `Umajs-express`
> A easy-to-use framework base on Typescript And to support the old express framework to upgrade umajs

## 简介

Umajs-express是针对历史项目为express框架升级Umajs而开发的一个基于Umajs的适配工程，开发者可以将Umajs集成到express项目中。逐步将新工程的路由切换为符合Umajs的开发规范的代码，通过Umajs-express编写的代码后期可以直接无缝将Umajs-express升级成Umajs.

## 使用方法

Umajs-express高度保持Umajs使用方法，使用文档请参考： [Umajs使用文档](https://umajs.github.io)

## 特性
- 支持umajs所有基础功能，所以使用时只需要把`@umajs/core`替换成 `@umajs-express/core`
- 支持`plugin-status`插件之外的所有Umajs已提供插件(中间件使用了async await语法，express错误中间件展示无法捕获到异步函数内的错误，express5.0+后支持)
- 支持自定义中间件从req或者res中获取ctx对象，ctx模拟封装了和koa一致的使用方法和属性。

## 和Umajs的区别
- 使用时npm模块命名空间不同，express版本为@umajs-express
- 自定义中间件形式不同，自定义中间件实现方式为express原始中间件模式，接受三个参数`(req,res,next)=>{}`,为了后期快速升级Umajs,建议开发者通过从req对象中获取ctx属性。

## Umajs-express版本包括以下模块（用法和Umajs保持一致）
- @umajs-express/core 【单测 100%】
- @umajs-express/router 【单测 100%】
- @umajs-express/path 【单测 100%】
- @umajs-express/arg-decorator 【单测 100%】

## 支持的插件（用法和Umajs保持一致）
- @umajs-express/plugin-i18n 【单测 100%】
- @umajs-express/plugin-session 【单测 100%】
- @umajs-express/plugin-static 【单测 100%】
- @umajs-express/plugin-views 【单测 100%】



## demo
```ts
import { BaseController, Path, Private, Param, Query, RequestMethod, Aspect, Service, Result } from '@umajs-express/core';
import { Get, Post } from '@umajs-express/path';

export default class Index extends BaseController {
    @Path('/home')
    home() {
        this.setHeader('clientType','PC');
        console.log(this.ctx.get('Cache-Control'));
        return Result.send('this is home router! '+this.getHeader('Cache-Control'));
    }
    @Get('/reg/:name*')
    @Aspect.around('mw')
    reg(@Param('name') name: string) {
        return Result.send(`this is reg router. ${name}`);
    }
}
```
