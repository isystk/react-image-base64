import React, { FC, useState } from "react";

type Props = {
  id?: string,
  accept?: string,
  capture?: string,
  multiple?: boolean,
  handleChange: (arg0: Return) => void;
  maxFileSize: number;
  thumbnail_size: number;
  drop: boolean;
  dropText: string;
}

const initialize = {
  id: "js-image-base64",
  accept: "image/*",
  capture: undefined,
  multiple: false,
  handleChange: () => {},
  maxFileSize: 10485760, // アップロード可能な最大ファイルサイズ 10BM
  thumbnail_size: 500, // 画像リサイズ後の縦横の最大値
  drop: false,
  dropText: 'image drop here !!'
}

type Return = {
  result: boolean,
  messages: string[],
  fileName?: string,
  ofileData?: string,
  fileData?: string,
  ofileSize?: number,
  fileSize?: number,
  fileType?: string,
}

const ImageFile: FC<Props> = (props) => {

  // 初期値を設定
  props = {...initialize, ...props}

  // Drag&Drop操作の状態を管理
  const [isHover, setIsHover] = useState(false);

  // ファイル選択時のハンドラー
  const handleFileChange = (e: { target: { files: any; }; }) => {

    // 入力チェック
    const validate = (blob: Blob) => {
      const errors: string[] = []
      // ファイルサイズチェック
      if (props.maxFileSize < blob.size) {
        errors.push('画像ファイルのファイルサイズが最大値(' + Math.floor(props.maxFileSize / 1000000) + 'MB)を超えています。')
      }
      return errors
    }

    const errorCallback = (values: string[]) => {
      props.handleChange({ result: false, messages: values })
    }

    const successCallback = (values: Return) => {
      props.handleChange({
        ...values
      })
    }

    // 画像のリサイズ
    const resize = function(fileName:string, blob: Blob, callback: any, errorCallback: any) {
      const image = new Image()
      const fr = new FileReader()
      fr.onload = function(evt) {
        // リサイズする
        image.onload = function() {
          let width, height
          if (image.width > image.height) {
            // 横長の画像は横のサイズを指定値にあわせる
            const ratio = image.height / image.width
            width = props.thumbnail_size
            height = props.thumbnail_size * ratio
          } else {
            // 縦長の画像は縦のサイズを指定値にあわせる
            const ratio = image.width / image.height
            width = props.thumbnail_size * ratio
            height = props.thumbnail_size
          }
          // サムネ描画用canvasのサイズを上で算出した値に変更
          const canvas = document.createElement('canvas')
          canvas.id = 'canvas'
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          if (ctx) {
            // canvasに既に描画されている画像をクリア
            ctx.clearRect(0, 0, width, height)
            // canvasにサムネイルを描画
            ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height)
          }

          // canvasからbase64画像データを取得
          const base64 = canvas.toDataURL('image/jpeg')
          // base64からBlobデータを作成
          const bin = atob(base64.split('base64,')[1])
          const len = bin.length
          const barr = new Uint8Array(len)
          let i = 0
          while (i < len) {
            barr[i] = bin.charCodeAt(i)
            i++
          }
          const resizeBlob = new Blob([barr], { type: 'image/jpeg' })
          callback({
            fileName: fileName,
            ofileData: evt.target ? evt.target.result : null,
            fileData: base64,
            ofileSize: blob.size,
            fileSize: resizeBlob.size,
            fileType: resizeBlob.type,
          })
        }
        image.onerror = function() {
          errorCallback(['選択されたファイルをロードできません。'])
        }
        image.src = evt.target ? evt.target.result + '' : ''
      }
      fr.readAsDataURL(blob)
    }

    for (let file of e.target.files) {
      function getExt(filename: string) {
        const pos = filename.lastIndexOf('.')
        if (pos === -1) return ''
        return filename.slice(pos + 1)
      }
      const ext = getExt(file.name).toLowerCase()

      if (ext === 'heic') {
        // HEIC対応 iphone11 以降で撮影された画像にも対応する
        // console.log('HEIC形式の画像なのでJPEGに変換します。')
        const heic2any = require('heic2any')
        if (typeof window !== 'undefined') {
          fetch('https://alexcorvi.github.io/heic2any/demo/14.heic')
          .then((res) => res.blob())
          .then((blob) => heic2any({
            blob,
            toType: 'image/jpeg',
            quality: 1,
          })
          .then(function(rb: any) {
            const resultBlob = rb as Blob;
            const errors = validate(resultBlob)
            if (0 < errors.length) {
              errorCallback(errors)
              return
            }
            resize(
                file.name,
                resultBlob,
                function(res: { fileName: string; fileData: string; }) {
                  res.fileName = file.name
                  successCallback({
                    ...res,
                    result: true,
                    messages: ['正常終了'],
                  })
                },
                function(errors: string[]) {
                  errorCallback(errors)
                  return
                },
            )
          }))
        }

      } else {
        const errors = validate(file)
        if (0 < errors.length) {
          errorCallback(errors)
          return
        }
        resize(
            file.name,
            file,
            function(res: { fileName: string; fileData: string; }) {
              successCallback({
                ...res,
                result: true,
                messages: ['正常終了'],
              })
            },
            function(errors: string[]) {
              errorCallback(errors)
              return
            },
        )
      }
    }
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHover(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHover(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHover(false);
    var files = e.dataTransfer.files;
    if (files.length === 0) {
      return;
    }
    handleFileChange({target: {files}})
  };
  const DropZone: FC<{dropText: string}> = ({children, dropText}) => (
      <div id="drop-zone"
           className={isHover ? 'hover': ''}
           onDrop={e => handleDrop(e)}
           onDragOver={e => handleDragOver(e)}
           onDragEnter={e => handleDragEnter(e)}
           onDragLeave={e => handleDragLeave(e)}
      >
        <p>{dropText}</p>
        {children}
      </div>
  )

  return (
      (() => {
        return props.drop ?
            (
                <DropZone dropText={props.dropText}>
                  <input
                      type="file"
                      id={props.id}
                      accept={props.accept}
                      capture={props.capture}
                      multiple={props.multiple}
                      onChange={handleFileChange}
                  />
                </DropZone>
            )
            :
            (
                <input
                    type="file"
                    id={props.id}
                    accept={props.accept}
                    capture={props.capture}
                    multiple={props.multiple}
                    onChange={handleFileChange}
                />
            )
      })()
  )
};

export default ImageFile;
