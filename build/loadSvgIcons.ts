import path from "path";
import fs from 'fs';
import { optimize,loadConfig } from 'svgo';

// const svgIconDir = path.resolve(__dirname, "../src/icons/svg");

interface LoadSvgIconsOptions {
    iconDir: string;
}

export default (options: LoadSvgIconsOptions) => {

    const { iconDir } = options;

    const icons = fs.readdirSync(iconDir).map(filename => optimize(fs.readFileSync(path.join(iconDir, filename))))

    console.log(icons)

    return {
        name: "load-svg-icons",
        resolveId(id) {
            return null;
        },
        load(id) {
            return ``;
        }
    }
}

