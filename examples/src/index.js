import React, { useState } from 'react';
import { render } from 'react-dom'
import ReactImageBase64 from '../../dist'

const App = () => {
  const [imageBase64, setImageBase64] = useState(undefined);
  const [fileName, setFileName] = useState('');

  return (
    <div>
      <ReactImageBase64
        handleChange={data => {
          console.log(data)
          setImageBase64(data.imageBase64);
          setFileName(data.fileName);
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
}

render(<App />, document.getElementById('root'));