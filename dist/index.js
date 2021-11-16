"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const initialize = {
    id: "js-image-base64",
    accept: "image/*",
    capture: undefined,
    multiple: false,
    handleChange: () => { },
    maxFileSize: 10485760,
    thumbnail_size: 500,
    drop: false,
    dropText: 'image drop here !!'
};
const ImageFile = (props) => {
    // 初期値を設定
    props = Object.assign(Object.assign({}, initialize), props);
    // Drag&Drop操作の状態を管理
    const [isHover, setIsHover] = react_1.useState(false);
    // ファイル選択時のハンドラー
    const handleFileChange = (e) => {
        // 入力チェック
        const validate = (blob) => {
            const errors = [];
            // ファイルサイズチェック
            if (props.maxFileSize < blob.size) {
                errors.push('画像ファイルのファイルサイズが最大値(' + Math.floor(props.maxFileSize / 1000000) + 'MB)を超えています。');
            }
            return errors;
        };
        const errorCallback = (values) => {
            props.handleChange({ result: false, messages: values });
        };
        const successCallback = (values) => {
            props.handleChange(Object.assign({}, values));
        };
        // 画像のリサイズ
        const resize = function (fileName, blob, callback, errorCallback) {
            const image = new Image();
            const fr = new FileReader();
            fr.onload = function (evt) {
                // リサイズする
                image.onload = function () {
                    let width, height;
                    if (image.width > image.height) {
                        // 横長の画像は横のサイズを指定値にあわせる
                        const ratio = image.height / image.width;
                        width = props.thumbnail_size;
                        height = props.thumbnail_size * ratio;
                    }
                    else {
                        // 縦長の画像は縦のサイズを指定値にあわせる
                        const ratio = image.width / image.height;
                        width = props.thumbnail_size * ratio;
                        height = props.thumbnail_size;
                    }
                    // サムネ描画用canvasのサイズを上で算出した値に変更
                    const canvas = document.createElement('canvas');
                    canvas.id = 'canvas';
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        // canvasに既に描画されている画像をクリア
                        ctx.clearRect(0, 0, width, height);
                        // canvasにサムネイルを描画
                        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);
                    }
                    // canvasからbase64画像データを取得
                    const base64 = canvas.toDataURL('image/jpeg');
                    // base64からBlobデータを作成
                    const bin = atob(base64.split('base64,')[1]);
                    const len = bin.length;
                    const barr = new Uint8Array(len);
                    let i = 0;
                    while (i < len) {
                        barr[i] = bin.charCodeAt(i);
                        i++;
                    }
                    const resizeBlob = new Blob([barr], { type: 'image/jpeg' });
                    callback({
                        fileName: fileName,
                        ofileData: evt.target ? evt.target.result : null,
                        fileData: base64,
                        ofileSize: blob.size,
                        fileSize: resizeBlob.size,
                        fileType: resizeBlob.type,
                    });
                };
                image.onerror = function () {
                    errorCallback(['選択されたファイルをロードできません。']);
                };
                image.src = evt.target ? evt.target.result + '' : '';
            };
            fr.readAsDataURL(blob);
        };
        for (let file of e.target.files) {
            function getExt(filename) {
                const pos = filename.lastIndexOf('.');
                if (pos === -1)
                    return '';
                return filename.slice(pos + 1);
            }
            const ext = getExt(file.name).toLowerCase();
            if (ext === 'heic') {
                // HEIC対応 iphone11 以降で撮影された画像にも対応する
                // console.log('HEIC形式の画像なのでJPEGに変換します。')
                const heic2any = require('heic2any');
                if (typeof window !== 'undefined') {
                    fetch('https://alexcorvi.github.io/heic2any/demo/14.heic')
                        .then((res) => res.blob())
                        .then((blob) => heic2any({
                        blob,
                        toType: 'image/jpeg',
                        quality: 1,
                    })
                        .then(function (rb) {
                        const resultBlob = rb;
                        const errors = validate(resultBlob);
                        if (0 < errors.length) {
                            errorCallback(errors);
                            return;
                        }
                        resize(file.name, resultBlob, function (res) {
                            res.fileName = file.name;
                            successCallback(Object.assign(Object.assign({}, res), { result: true, messages: ['正常終了'] }));
                        }, function (errors) {
                            errorCallback(errors);
                            return;
                        });
                    }));
                }
            }
            else {
                const errors = validate(file);
                if (0 < errors.length) {
                    errorCallback(errors);
                    return;
                }
                resize(file.name, file, function (res) {
                    successCallback(Object.assign(Object.assign({}, res), { result: true, messages: ['正常終了'] }));
                }, function (errors) {
                    errorCallback(errors);
                    return;
                });
            }
        }
    };
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsHover(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsHover(false);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsHover(false);
        var files = e.dataTransfer.files;
        if (files.length === 0) {
            return;
        }
        handleFileChange({ target: { files } });
    };
    const DropZone = ({ children, dropText }) => (react_1.default.createElement("div", { id: "drop-zone", className: isHover ? 'hover' : '', onDrop: e => handleDrop(e), onDragOver: e => handleDragOver(e), onDragEnter: e => handleDragEnter(e), onDragLeave: e => handleDragLeave(e) },
        react_1.default.createElement("p", null, dropText),
        children));
    return ((() => {
        return props.drop ?
            (react_1.default.createElement(DropZone, { dropText: props.dropText },
                react_1.default.createElement("input", { type: "file", id: props.id, accept: props.accept, capture: props.capture, multiple: props.multiple, onChange: handleFileChange })))
            :
                (react_1.default.createElement("input", { type: "file", id: props.id, accept: props.accept, capture: props.capture, multiple: props.multiple, onChange: handleFileChange }));
    })());
};
exports.default = ImageFile;
