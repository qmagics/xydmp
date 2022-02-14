import colors from "./colors";

interface Options {
    start: number;
    end: number;
}

const DEFAULT_OPTIONS: Options = {
    start: 0.2,
    end: 1
}

function getLinearColorByRgbColor(color: string, options?: Options): any {
    let result = color.match(/\((.+?)\)/);
    let str = result && result[1];

    options = Object.assign({}, DEFAULT_OPTIONS, options);

    if (!str) {
        return null;
    }
    return {
        type: "linear",
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
            {
                offset: 0,
                color: `rgba(${str},${options.start})`,
            },
            {
                offset: 1,
                color: `rgba(${str},${options.end})`,
            },
        ],
        global: false,
    }
}

export default colors.map(c => getLinearColorByRgbColor(c));

export const linearColorReverse = colors.map(c => getLinearColorByRgbColor(c, { start: 1, end: 0.2 }));