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