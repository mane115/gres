/**
 * @todo koa用于统一处理返回格式的中间件、记录访问api
 * @desc 中间件请求回溯流程
     request  -> handleResponse(logger)  ->   api router -|
     response <- handleResponse(arrange res) <------------|
 * @author gh
 */
const ENV = process.env.NODE_ENV || process.env.APP_ENV || 'dev';
module.exports = async function(ctx, next) {
    try {
        if (ENV === 'dev') {
            console.log(`# log ${ctx.ip} ${ctx.method} ${ctx.url} `);
        }
        ctx._body = ctx.request && ctx.request.body || {};
        await next();
        if (ctx.body) {
            return;
        }
        let response = {
            error: 0,
            message: 'operation success'
        };
        if (ctx.result && ctx.result.result) {
            response.result = ctx.result.result;
        } else if (ctx.result) {
            response.result = ctx.result;
        }
        ctx.body = response;
    } catch (err) {
        if (ENV === 'dev' && err.stack) {
            console.log(err);
            return ctx.body = err.stack;
        }
        ctx.body = err;
    }
};
