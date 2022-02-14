import { defineConfig, PluginOption } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
// import viteSvgIcons from 'vite-plugin-svg-icons'
import styleImport from 'vite-plugin-style-import';
import legacy from '@vitejs/plugin-legacy'
// import loadSvgIcons from './build/loadSvgIcons';
// import { VitePWA } from 'vite-plugin-pwa';


export const publicPath = "/big-screen/";
const outputPath = "../../Management/wwwroot";

export default defineConfig({
    define: {
        'process.env': {
            NODE_ENV: process.env.NODE_ENV
        }
    },
    plugins: [
        vue(),
        legacy({
            //   targets: ['defaults', 'not IE 11'],
            targets: ['defaults', 'ie 11'],
            additionalLegacyPolyfills: ['regenerator-runtime/runtime'], // 面向IE11时需要此插件
            polyfills: [

            ]
        }),
        // viteSvgIcons({
        //     // Specify the icon folder to be cached
        //     iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
        //     // Specify symbolId format
        //     symbolId: 'icon-[dir]-[name]'
        // }),
        styleImport({
            libs: [
                {
                    libraryName: 'vant',
                    esModule: true,
                    resolveStyle: name => path.resolve(__dirname, `./node_modules/vant/es/${name}/style`),
                    // resolveStyle: name => `/vant/es/${name}/style`,
                }
            ]
        }),
        // loadSvgIcons({
        //     iconDir: path.resolve(__dirname, "./src/icons/svg")
        // })
        // VitePWA()
    ],

    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "@/styles/variables.scss";@import "@/styles/mixins.scss";`
            }
        }
    },

    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        },
    },

    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:10707/',
                changeOrigin: true,
                secure: false,
            },
            // '/ZcCitySDK': {
            //     target: 'http://localhost:10707/3d/',
            //     changeOrigin: true,
            //     secure: false,
            // },
            '/3d': {
                target: 'http://localhost:10707/',
                changeOrigin: true,
                secure: false,
            }
        },
    },

    base: publicPath,

    build: {
        outDir: `${outputPath}${publicPath}`,
    }
})
