import React, { createRef, forwardRef, useImperativeHandle, useRef } from 'react';
import * as UIExtension from '@foxitsoftware/foxit-pdf-sdk-for-web-library/lib/UIExtension.full.js';
import "@foxitsoftware/foxit-pdf-sdk-for-web-library/lib/UIExtension.css";
import * as Addons from '@foxitsoftware/foxit-pdf-sdk-for-web-library/lib/uix-addons/allInOne.js';
import * as mobileAddons from '@foxitsoftware/foxit-pdf-sdk-for-web-library/lib/uix-addons/allInOne.mobile.js';


function PDFViewer(props, ref) {
    const viewerContainerRef = useRef(null);

    const pdfuiInstanceRef = createRef();

    useImperativeHandle(ref,() => {
        if(window.pdfui){
            pdfuiInstanceRef.current = window.pdfui
            return pdfuiInstanceRef.current
        }
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
            addons: UIExtension.PDFViewCtrl.DeviceInfo.isMobile? mobileAddons:Addons
        });
        window.pdfui = pdfuiInstanceRef.current = pdfui;
        return pdfui;
    });
    
    return <div className = "foxit-PDF" ref = { viewerContainerRef } />;
}
export default forwardRef(PDFViewer);