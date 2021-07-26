const CopyWebpackPlugin = require("copy-webpack-plugin");
const {
    override,
    addWebpackPlugin,
    addWebpackExternals
} = require('customize-cra');
const path = require("path")

const libraryModulePath = path.resolve('node_modules/@foxitsoftware/foxit-pdf-sdk-for-web-library');
const libPath = path.resolve(libraryModulePath, 'lib');

module.exports = override(
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
    )
)