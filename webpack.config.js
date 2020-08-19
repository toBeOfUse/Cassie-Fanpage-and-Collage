const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    "mode": "development",
    "entry": "./index.js",
    "output": {
        "filename": "bundle.js"
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
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