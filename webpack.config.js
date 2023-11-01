const path = require('path');
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
    // エントリポイントのファイル
    entry: [
        '@babel/polyfill',
        './src/main.js'
    ],
    output: {
        // 出力先のディレクトリ
        path: path.resolve(__dirname, './dest'),
        // 出力ファイル名
        filename: 'bundle.js'
    },
    devServer: {
        // webpackの扱わないファイル(HTMLや画像など)が入っているディレクトリ
        contentBase: path.resolve(__dirname, 'public')
    },
    module: {
        rules: [
            {
                test: /\.vue$/, // ファイルが.vueで終われば...
                loader: 'vue-loader' // vue-loaderを使う
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader'] // css-loader -> vue-style-loaderの順で通していく
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?\S*)?$/,
                loader: 'file-loader?name=assets/[name].[hash].[ext]'
            },
        ]
    },
    resolve: {
        // import './foo.vue' の代わりに import './foo' と書けるようになる(拡張子省略)
        extensions: ['.js', '.vue'],
        alias: {
            // vue-template-compilerに読ませてコンパイルするために必要
            vue$: 'vue/dist/vue.esm.js',
            '@': path.resolve(__dirname, 'src')
        },
    },
    plugins: [
        new VueLoaderPlugin()
    ],
};

