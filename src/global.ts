const DATE_VALUE_FORMAT = "yyyy-MM-ddTHH:mm:ss";

declare interface Date {
    format: (fmt: string) => string;
    stringify: () => string;
    addDays: (num: number) => Date;
}

const weekMap: any = {
    0: "周日",
    1: "周一",
    2: "周二",
    3: "周三",
    4: "周四",
    5: "周五",
    6: "周六",
}

/**
 * 日期格式化
 * @param {string} fmt 格式化字符串
 */
Date.prototype.format = function (fmt: string = 'yyyy-MM-dd HH:mm') {
    // 无效日期
    if (this as any == 'Invalid Date') return "-";

    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "H+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds(), //毫秒
        "w": weekMap[this.getDay()]
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/**
 * 将日期序列化为后端识别格式
 * @returns {string}
 */
Date.prototype.stringify = function () {
    return this.format(DATE_VALUE_FORMAT);
}

/**
 * 增加天数
 * @param {number} num 增加的天数
 * @returns {Date} 新的时间对象 
 */
Date.prototype.addDays = function (num: number) {
    return new Date(this.getTime() + 3600 * 1000 * 24 * num);
}