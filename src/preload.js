import preloadJrWorker from '@foxitsoftware/foxit-pdf-sdk-for-web-library/lib/preload-jr-worker';
import {
    licenseKey,
    licenseSN
} from './license-key';

const libPath = "/foxit-lib/"

window.readyWorker = preloadJrWorker({
    workerPath: libPath,
    enginePath: libPath + '/jr-engine/gsdk',
    fontPath: 'https://webpdf.foxitsoftware.com/webfonts/',//自定义字体'/external/brotli',
    licenseSN,
    licenseKey,
});