const path = require("path");
const rimraf = require("rimraf");
const cordovaConfig = require("cordova-config");
const VueAutomaticImportPlugin = require("vue-automatic-import-loader/lib/plugin");
const { devServerConfig, pageConfig } = require("./src/config/index");
const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV === "development";
const host = getLocalIP(); //获取本机IP
const port = devServerConfig.port || 8000;
const indexPath = isProduction ? "index.html" : `http://${host}:${port}`;
//dev时删除dist目录防止dev模式wifi同步不必要的文件
isDevelopment &&
  rimraf(path.resolve(__dirname, "./dist"), (err) => {
    if (err) throw err;
  });

module.exports = {
  publicPath: isProduction ? "./" : "./",
  filenameHashing: isProduction /** 开发环境关闭文件哈希值 */,
  devServer: {
    // 环境配置
    host,
    port,
    hot: true, //false防止开发模式白屏(使用路由缓存时)
    open: false, //编译完成后打开浏览器
    proxy: {
      /** 解决本地测试跨域问题 */
      [`/${devServerConfig.apiRoot}`]: {
        target: devServerConfig.proxyUrl,
        pathRewrite: {
          [`^/${devServerConfig.apiRoot}`]: "",
        },
      },
    },
    writeToDisk: (file) => {
      return /config.xml$/.test(file);
      // return /index.html$/.test(file) || /config.xml$/.test(file);
    },
  },
  pages: {
    index: {
      // page 的入口
      entry: "src/main.js",
      // 模板来源
      template: "public/index.html",
      // 在 dist/index.html 的输出
      filename: "index.html",
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: pageConfig.title,
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ["chunk-vendors", "chunk-common", "index"],
    },
  },

  transpileDependencies: [
    // "vuetify",
    // "lottie-player-vue",
    // "vue-awesome-swiper",
    // "vue-tippy",
    "axios-apicloud-adapter",
    "vue-screen",
  ], //指定需要编译的依赖

  // chainWebpack: config => {},

  configureWebpack: {
    plugins: [
      //组件自动按需导入
      new VueAutomaticImportPlugin({
        match(originalTag, { kebabTag, camelTag, path, component }) {
          if (kebabTag.startsWith("via-")) {
            return [
              camelTag,
              `import ${camelTag} from '@/components/${camelTag}/index.vue';`,
            ];
          }

          if (kebabTag.startsWith("van-")) {
            const componentName = kebabTag.slice(4);
            return [
              camelTag,
              `
                import ${camelTag} from 'vant/lib/${componentName}';
                import 'vant/lib/${componentName}/style';
              `,
            ];
          }
          /**
           * originalTag - the tag as it was originally used in the template
           * kebabTag    - the tag normalised to kebab-case
           * camelTag    - the tag normalised to PascalCase
           * path        - a relative path to the current .vue file
           * component   - a parsed representation of the current component
           */
          // console.log('originalTag:', originalTag);
          // console.log('kebabTag:', kebabTag);
          // console.log('camelTag:', camelTag);
          // console.log('path:', path);
          // console.log('component:', component);
        },
      }),
      {
        apply: (compiler) => {
          compiler.hooks.done.tap("done", (compilation) => {
            // 编译完成后做点什么
            const configXml = new cordovaConfig("./dist/config.xml"); //根据环境改变config.xml
            configXml.setElement("content", "", {
              src: indexPath,
            });
            configXml.setPreference("debug", isDevelopment);
            configXml.writeSync();
            // console.log('build done');
          });
        },
      },
    ],
  },
  // css: {
  //   loaderOptions: {
  //     sass: {
  //       prependData: `@import "~@/assets/css/vuetify-custom.scss"`,
  //     },
  //     scss: {
  //       prependData: `@import "~@/assets/css/vuetify-custom.scss";`,
  //     },
  //   },
  // },
};

function getLocalIP() {
  const interfaces = require("os").networkInterfaces();
  for (let devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (
        alias.family === "IPv4" &&
        alias.address !== "127.0.0.1" &&
        !alias.internal
      ) {
        return alias.address;
      }
    }
  }
}
