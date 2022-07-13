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

export const copy = (str) => {
    try {
        navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
            if (["granted", "prompt"].includes(result.state)) {
                navigator.clipboard.writeText(str).then(() => {
                    alert('复制成功')
                }).catch((e) => {
                    alert(`错误：${JSON.stringify(e)}\n请自行手动复制`)
                })
            }
        })
    } catch (_) {
        const ele = document.createElement("textarea");
        ele.style.position = "absolute";
        ele.style.border = "0";
        ele.style.padding = "0";
        ele.style.margin = "0";
        document.body.appendChild(ele);
        ele.value = str;
        ele.select();
        document.execCommand("copy");
        ele.remove();
    }
}