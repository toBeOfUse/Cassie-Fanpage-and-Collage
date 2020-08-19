const VueLoaderPlugin = require('vue-loader/lib/plugin')
const isDev = true;
module.exports = {
    "mode": isDev ? "development" : "production",
    "entry": "./index.js",
    "output": {
        "filename": "bundle.js"
    },
    devtool: "inline-source-map",
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ],
    resolve: {
        alias: {
            // use the full build with template compiler
            'vue$': 'vue/dist/vue.esm.js'
        }
    }
}