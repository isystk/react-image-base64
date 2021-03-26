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
yarn add -D heic2any
```
 
# Usage
 
```bash
git clone https://github.com/isystk/react-image-base64.git
cd react-image-base64
yarn run start
```
 
# Note

利用例
```
  const [imageBase64, setImageBase64] = useState(undefined);

  return (
    <div>
      <ReactImageBase64
        handleChange={data => {
          console.log(data)
          setImageBase64(data.imageBase64);
        }}
      />
      <div id="result">
        {imageBase64 &&
          (() => {
            return <img src={imageBase64} width="200px" />
          })()}
      </div>
    </div>
  )
```
 
# Author
 
[isystk](https://github.com/isystk)

# License
 
[MIT](https://en.wikipedia.org/wiki/MIT_License).
