# Foxit PDF SDK for Web Example - React.js created by "create-react-app" (React hook)

This guide shows two examples. One introduces how to quickly run the out-of-the-box sample for react.js created by "create-react-app" in Foxit PDF SDK for Web package, and the other presents a way to integrate Foxit PDF SDK for Web into React app created by "create-react-app".

## Quickly run the out-of-the-box sample for create-react-app-hook

_Note:The root folder of `Foxit PDF SDK for Web` is referred as `root` in the following._

Foxit PDF SDK for Web provides a boilerplate project for React app which was created by "create-react-app".

### Overview the project structure

```bash
├─public
│   └── index.html
├─src/
│  ├─components/
│  │  └─PDFViewer/
│  ├─App.css
│  ├─App.js
│  ├─index.css
│  ├─index.js
│  ├─license-key.js
│  └──preload.js
├─.eslintignore
├─config-overrides.js
├─package.json
```

#### Key directory and files descriptions

|        File/Folder        |                                        Description                                        |
| :----------------------- | :--------------------------------------------------------------------------------------- |
|           src/            |                        Contains all JS and CSS files for the app.                         |
| src/components/PDFViewer/ |                Contains the initilization plugins for FoxitPDFSDK for Web.                |
|      src/preload.js       |                     This entry point used to preload SDK core assets.                     |
|      src/license-key.js   |                     The license-key                    |
|        src/App.js         |                             The entry point for application.                              |
|       config-overrides.js        |                 Adjust the Webpack configuration                   |
|       package.json        |                  Lists dependencies, version build information and ect.                   |

### Prerequisites

- [Nodejs](https://nodejs.org/en/) and [yarn](https://yarnpkg.com/getting-started/install)
- [Foxit PDF SDK for Web](https://developers.foxitsoftware.com/pdf-sdk/Web)

### Getting started

- Copy `license-key.js` to the `src` folder.

- Navigate to `create-react-app-hook` folder, and execute:

```bash
    yarn 
    yarn start
```

Now everything is set up. Open your browser, navigate to <http://localhost:3000/> to launch this application.

## Integrate Web SDK to react app created by "create-react-app"

### Prerequisites

- [Nodejs](https://nodejs.org/en/) and [yarn](https://yarnpkg.com/getting-started/install)
- [Reac.js created by create-react-app](https://reactjs.org/docs/create-a-new-react-app.html)
- [Foxit PDF SDK for Web](https://developers.foxitsoftware.com/pdf-sdk/Web)

### Getting started

1. Create the React app with "create-react-app": 

   ```bash
   npx create-react-app app
   ```

2. In `app` folder, Update `package.json`:

    ```json
    "scripts": {
        "start": "react-app-rewired --max_old_space_size=8192 start",
        "build": "react-app-rewired --max_old_space_size=8192 build",
        "test": "react-app-rewired --max_old_space_size=8192 test --env=jsdom",
        "eject": "react-app-rewired --max_old_space_size=8192 eject"
    },
    ```

3. In `app` folder, add `config-overrides.js`:

   ```js
    const CopyWebpackPlugin = require("copy-webpack-plugin");
    const { override, addWebpackPlugin, addWebpackExternals} = require('customize-cra');
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
   ```

4. In `src` folder, add `license-key.js`, copy the content below to that file and fill in the License's KEY and SN fields.

    ```js
    export const licenseKey = '';
    export const licenseSN = '';
    ```

5. In `app` folder, add `.eslintignore`:

    ```text
    license-key.js
    ```  

6. In `src` folder, add `preload.js`:

   ```js
    import preloadJrWorker from '@foxitsoftware/foxit-pdf-sdk-for-web-library/lib/preload-jr-worker';
    import { licenseKey, licenseSN } from './license-key';
    
    const libPath = "/foxit-lib/"
    
    window.readyWorker = preloadJrWorker({
        workerPath: libPath,
        enginePath: libPath+'/jr-engine/gsdk',
        fontPath: 'http://webpdf.foxitsoftware.com/webfonts/',
        licenseSN,
        licenseKey,
    });
   ```

7. In `src/index.js` file, import `preload.js`:

    ```js
     import './preload.js'
    ```

8. In `src` folder, add `components/PDFViewer/index.js`:

   ```js
    import React, { createRef, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
    import * as UIExtension from '@foxitsoftware/foxit-pdf-sdk-for-web-library/lib/UIExtension.full.js';
    import "@foxitsoftware/foxit-pdf-sdk-for-web-library/lib/UIExtension.css";

    function PDFViewer(props, ref) {
        const viewerContainerRef = useRef(null);

        const pdfuiInstanceRef = createRef();
        useEffect(() => {
            const pdfui = pdfuiInstanceRef.current;
            return () => {
                pdfui.destroy();
            };
        }, [pdfuiInstanceRef]);

        useImperativeHandle(ref,() => {
            const renderTo = viewerContainerRef.current;
            const libPath = "/foxit-lib/";
            const pdfui = new UIExtension.PDFUI({
                viewerOptions: {
                    libPath,
                    jr: {
                        readyWorker: window.readyWorker
                    },
                    ...(props.viewerOptions || {})
                },
                renderTo: renderTo,
                appearance: UIExtension.appearances.adaptive,
                addons: UIExtension.PDFViewCtrl.DeviceInfo.isMobile ?
                    libPath + 'uix-addons/allInOne.mobile.js' : libPath + 'uix-addons/allInOne.js'
            });
            pdfuiInstanceRef.current = pdfui;
            return pdfui;
        });
        
        return <div className = "foxit-PDF" ref = { viewerContainerRef } />;
    }
    export default forwardRef(PDFViewer);
   ```

9.  Update `App.js`:

    ```js
    import { useEffect, useRef } from 'react';
    import './App.css';
    import PDFViewer from './components/PDFViewer';

    function App() {
        const pdfuiRef = useRef(null);
        useEffect(() => {
            const pdfui = pdfuiRef.current;
            if(!pdfui) {
                return;
            }
            // Here, you can do anything with the pdfui instance.
            return () => {
                // Here, you can perform any destruction actions.
            };
        }, [pdfuiRef]);
        const externalViewerOptions = {
            // more viewer options
        };
        return (
            <div className="App">
                <PDFViewer ref={pdfuiRef} viewerOptions={externalViewerOptions}></PDFViewer>
            </div>
        );
    }

    export default App;

    ```

10. Update App.css

    ```css
    #root,.App,.foxit-PDF{
        height: 100%;
    }
    ```

11. Install dependencies and run:

    ```bash
    cd app
    yarn add @foxitsoftware/foxit-pdf-sdk-for-web-library 
    yarn add copy-webpack-plugin@6.4.1 customize-cra@1.0.0 react-app-rewired@2.1.8 -D
    yarn start
    ```

12. Now everything is set up. Open your browser, navigate to <http://localhost:3000/> to launch your application.
