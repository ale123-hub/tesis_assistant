import React, { useState, useRef } from 'react';
import { generateTextFromHuggingFace, generateTextFromHuggingFaceStream } from './huggingFaceAPI';

import './App.css';

function App() {
  const name = <h1>Tesis Assistant</h1>;
  return (
    <div className="App">
      {name}
      <UploadGuide />
    </div>
  );
}

function UploadGuide() {
  const [file, setFile] = useState(null);
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [isStreaming, setIsStreaming] = useState(false); // Determina si usamos streaming o no
  const fileInputRef = useRef(null);
  const API_KEY = process.env.REACT_APP_HUGGINGFACE_API_KEY; // Usa la variable de entorno

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  // Llamada a la API de Hugging Face para generar texto (con opción de streaming)
  const handleGenerateText = async () => {
    const promptText = "Genera un párrafo introductorio sobre la inteligencia artificial.";
    setIsLoading(true);  // Iniciar carga
    setGeneratedText(''); // Limpiar texto anterior

    try {
      let result;
      if (isStreaming) {
        result = await generateTextFromHuggingFaceStream(promptText, API_KEY); // Llamada a la versión streaming
      } else {
        result = await generateTextFromHuggingFace(promptText, API_KEY); // Llamada a la versión no-streaming
      }
      setGeneratedText(result);
    } catch (error) {
      console.error('Error al generar el texto:', error);
      setGeneratedText('Hubo un error al generar el texto.');
    } finally {
      setIsLoading(false);  // Finalizar carga
    }
  };

  return (
    <div className="UploadGuide">
      <h2>Subir Guía de Formato</h2>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button onClick={handleFileUpload}>Seleccionar Archivo</button>
      {file && <p>Archivo seleccionado: {file.name}</p>}

      <div>
        <h3>Generación de Texto:</h3>
        <button onClick={handleGenerateText}>
          {isStreaming ? 'Generar Texto (Streaming)' : 'Generar Texto'}
        </button>
        <button onClick={() => setIsStreaming(!isStreaming)}>
          {isStreaming ? 'Modo No Streaming' : 'Modo Streaming'}
        </button>

        {isLoading ? <p>Cargando...</p> : <p>{generatedText}</p>}
      </div>
    </div>
  );
}

export default App;
export { UploadGuide };