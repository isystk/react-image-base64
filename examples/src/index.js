import React, { useState } from 'react';
import { render } from 'react-dom';
import * as _ from 'lodash';
import ReactImageBase64 from '../../dist';

import './style.css';

const App = () => {
  const [images, setImages] = useState({data: []});
  const [errors, setErrors] = useState([]);

  return (
    
    <div className="wrap">
      <header>
        <div className="header-image">
          <div className="logo">REACT IMAGE BASE64</div>
        </div>
      </header>
      <div className="content">
        <main>
          <article className="detail">
            <div className="entry-header">
              <h1 className="entry-title">
                <a href="#">画像ファイルをBase64に変換するReact用コンポーネントです</a>
              </h1>
            </div>
            <div className="entry-content">
              <h2>デモ</h2>
              <ReactImageBase64
                maxFileSize={10485760}
                thumbnail_size={100}
                drop={true}
                dropText="ファイルをドラッグ＆ドロップもしくは"
                highlight={true}
                highlight_color="#6666ff"
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
              <div>
                <table id="select-image">
                  <thead>
                    <tr>
                      <th>ファイル名</th>
                      <th>元の画像</th>
                      <th>リサイズ後画像</th>
                      <th>元のサイズ</th>
                      <th>リサイズ後サイズ</th>
                      <th>タイプ</th>
                    </tr>
                  </thead>
                  <tbody>
                  { images.data.map((image, index) => (
                    <tr key={index}>
                      <td>{image.fileName}</td>
                      <td><img src={image.ofileData} /></td>
                      <td><img src={image.fileData} /></td>
                      <td>{image.ofileSize}</td>
                      <td>{image.fileSize}</td>
                      <td>{image.fileType}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
          </article>
        </main>
      </div>
    </div>
  )
}

render(<App />, document.getElementById('root'));