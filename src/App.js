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
        function handleWindowResize() {
            pdfui.redraw();
        }
        window.addEventListener('resize', handleWindowResize);
        return () => {
            // Here, you can perform any destruction actions.
            window.removeEventListener('resize', handleWindowResize);
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