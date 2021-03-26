# react-image-base64
 
画像ファイルをBase64に変換するReact用コンポーネントです
 
# DEMO
 
https://isystk.github.io/react-image-base64
 
# Features
 
- ファイルを選択するとBase64に変換されたデータをJSON形式で返却します。
- 画像のサイズを指定することでリサイズすることが可能です。
- HEIC形式の画像の場合はJPEGに変換します。
 
# Requirement
 
* heic2any 0.0.3
 
# Installation
 
```bash
yarn add -D react-image-base64
```
 
# Usage
 
```bash
git clone https://github.com/isystk/react-image-base64.git
cd react-image-base64
yarn run start
```
 
# Note

```
  const [images, setImages] = useState({data: []});
  const [errors, setErrors] = useState([]);

  return (
    <div>
      <ReactImageBase64
        maxFileSize={10485760}
        thumbnail_size={100}
        drop={true}
        dropText="ファイルをドラッグ＆ドロップもしくは"
        capture="environment"
        multiple={true}
        handleChange={data => {
          if (data.result) {
            let list =images.data
            list.push(data);
            setImages({data: list})
          } else {
            setErrors([...errors, data.messages]);
          }
        }}
      />
      { errors.map((error, index) => 
          <p className="error-message" key={index}>{error}</p>
        )
      }
    </div>
  )
```
 
# Author
 
[isystk](https://github.com/isystk)

# License
 
[MIT](https://en.wikipedia.org/wiki/MIT_License).
