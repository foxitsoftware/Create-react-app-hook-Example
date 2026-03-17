const CopyWebpackPlugin = require("copy-webpack-plugin");
const {
    override,
    addWebpackPlugin,
    addWebpackExternals,
    overrideDevServer
} = require('customize-cra');
const path = require("path")

const libraryModulePath = path.resolve('node_modules/@foxitsoftware/foxit-pdf-sdk-for-web-library');
const libPath = path.resolve(libraryModulePath, 'lib');
const foxitModuleRegex = /[\\/]@foxitsoftware[\\/]foxit-pdf-sdk-for-web-library[\\/]/;

const devServerConfig = () => config => {
    config.headers = {
        ...config.headers,
        'Service-Worker-Allowed': '/'
    };
    return config;
}

const excludeFoxitFromBabel = () => config => {
    const oneOfContainer = config.module.rules.find(rule => Array.isArray(rule.oneOf));
    if (!oneOfContainer) {
        return config;
    }

    oneOfContainer.oneOf.forEach(rule => {
        if (!rule.loader || !rule.loader.includes('babel-loader')) {
            return;
        }

        if (!rule.exclude) {
            rule.exclude = foxitModuleRegex;
            return;
        }

        rule.exclude = Array.isArray(rule.exclude)
            ? [...rule.exclude, foxitModuleRegex]
            : [rule.exclude, foxitModuleRegex];
    });

    return config;
}

module.exports = {
    webpack: override(
        excludeFoxitFromBabel(),
        addWebpackPlugin(
            new CopyWebpackPlugin({
                patterns: [{
                    from: libPath,
                    to: 'foxit-lib',
                    force: true
                }]
            })
        ),
        addWebpackExternals(
            'UIExtension', 
            'PDFViewCtrl'
        ),
    ),
    devServer:overrideDevServer(devServerConfig())
}