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