import { IAspect, middlewareToAround } from '@umajs-express/core';



export default class implements IAspect {
    // async around({ target, proceed, args }) {
    //     const result = await middlewareToAround(async (ctx, next) => {
    //         console.log("****** mw before ******");
    //         await next();
    //         console.log("****** mw after *******");
    //     })({ target, proceed, args })

    //     return result;
    // }

    around = middlewareToAround(async (ctx, next) => {
        console.log("****** mw before ******");
        await next();
        console.log("****** mw after *******");
    });
}