// 龙门吊
export default (viewer: any, zccityTool: any) => {
    import("../meta/longmendiao.json").then(res => {
        const data = res.default;
        for (var i = 0; i < data.length; i++) {
            var LongMenDiao = data[i];
            zccityTool.addLongMenDiao(LongMenDiao)
        }
    })
}