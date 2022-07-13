/**
 * 阻塞当前异步函数
 * @param {number} time 毫秒
 * @returns 
 */
export const sleep = (time = 1000) => new Promise((resolve) => {
    setTimeout(() => {
        resolve()
    }, time);
})