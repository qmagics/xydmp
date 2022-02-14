const prefix = `yw-icon-w-`;

const WeatherIconMap: Record<string, string> = {
    '晴': 'qin',
    '阴': 'yin',
    '多云': 'duoyun',
    "小雨": "xiaoyu",
    "中雨": "zhongyu",
    "大雨": "dayu",
    "暴雨": "baoyu",
    "雷阵雨": "leizhenyu",
    "冻雨": "dongyu",
    '雾': 'wu',
    '小雪': 'xiaoxue',
    '中雪': 'zhongxue',
    '大雪': 'daxue',
    '大风': 'dafeng',
    '龙卷风': 'longjuanfeng',
}

Object.keys(WeatherIconMap).forEach(key => {
    WeatherIconMap[key] = prefix + WeatherIconMap[key];
})

export {
    WeatherIconMap
}