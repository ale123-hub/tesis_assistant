// huggingFaceAPI.js

// Función para interactuar con la API de Hugging Face (Non-streaming)
export const generateTextFromHuggingFace = async (inputText, apiKey) => {
  const model = 'mistralai/Mistral-7B-Instruct-v0.2'; // Cambiar el modelo si es necesario
  try {
    const response = await fetch('https://api-inference.huggingface.co/models/' + model, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: inputText }],
        max_tokens: 500,
        temperature: 0.1,
        seed: 0,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices ? data.choices[0].message.content : 'No se generó texto.';
  } catch (error) {
    console.error('Error al obtener la respuesta:', error);
    return 'Hubo un error al generar el texto.';
  }
};

// Función para interactuar con la API de Hugging Face (Streaming)
export const generateTextFromHuggingFaceStream = async (inputText, apiKey) => {
  const model = 'mistralai/Mistral-7B-Instruct-v0.2'; // Cambiar el modelo si es necesario
  try {
    const response = await fetch('https://api-inference.huggingface.co/models/' + model, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: inputText }],
        max_tokens: 500,
        temperature: 0.1,
        seed: 0,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    let out = '';
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const stream = new ReadableStream({
      start(controller) {
        const processStream = async () => {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            return;
          }
          out += decoder.decode(value, { stream: true });
          controller.enqueue(value);
        };
        processStream();
      },
    });

    const streamReader = stream.getReader();
    return out; // Devuelve el resultado completo
  } catch (error) {
    console.error('Error en el streaming:', error);
    return 'Hubo un error al generar el texto.';
  }
};
