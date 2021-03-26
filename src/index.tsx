import React from "react";
import heic2any from "heic2any";

const ReactImageBase64 = (props: { handleChange: (arg0: { result: boolean; errors?: string[]; fileName?: string; imageBase64?: string; }) => void; }) => {

  const handleFileChange = (e: { target: { files: any; }; }) => {
    const maxFileSize = 10485760 // アップロード可能な最大ファイルサイズ 10BM
    const thumbnail_width = 500 // 画像リサイズ後の横の長さの最大値
    const thumbnail_height = 500 // 画像リサイズ後の縦の長さの最大値

    // 入力チェック
    const validate = (blob: Blob) => {
      const errors: string[] = []
      // ファイルサイズチェック
      if (maxFileSize < blob.size) {
        errors.push('画像ファイルのファイルサイズが最大値(' + Math.floor(maxFileSize / 1000000) + 'MB)を超えています。')
      }
      return errors
    }

    const errorCallback = (values: string[]) => {
      props.handleChange({ result: false, errors: values })
    }

    const successCallback = (values: { fileName: string; fileData: string; }) => {
      props.handleChange({ result: true, 
        fileName: values.fileName,
        imageBase64: values.fileData,
      })
    }

    // 画像のリサイズ
    const resize = function(fileName:string, blob: Blob, callback: { (res: any): void; (res: any): void; (arg0: { fileName: any; ofileData: string | ArrayBuffer | null; fileData: string; ofileSize: any; fileSize: number; fileType: string; }): void; }, errorCallback: { (errors: any): void; (errors: any): void; (arg0: string[]): void; }) {
      const image = new Image()
      const fr = new FileReader()
      fr.onload = function(evt) {
        // リサイズする
        image.onload = function() {
          let width, height
          if (image.width > image.height) {
            // 横長の画像は横のサイズを指定値にあわせる
            const ratio = image.height / image.width
            width = thumbnail_width
            height = thumbnail_width * ratio
          } else {
            // 縦長の画像は縦のサイズを指定値にあわせる
            const ratio = image.width / image.height
            width = thumbnail_height * ratio
            height = thumbnail_height
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

        heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 1,
          })
          .then(function(rb) {
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
                successCallback(res)
              },
              function(errors: string[]) {
                errorCallback(errors)
                return
              },
            )
          })
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
            successCallback(res)
          },
          function(errors: string[]) {
            errorCallback(errors)
            return
          },
        )
      }
    }
  }

  return (
    <div>
      <input
        type="file"
        id="js-uploadImage"
        // multiple="multiple"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ReactImageBase64;
