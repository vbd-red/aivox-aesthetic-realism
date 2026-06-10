const API_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell";

export async function generateImage(promptText: string): Promise<string> {
  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_HF_TOKEN}`, 
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ inputs: promptText }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка от сервера: ${response.status}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob); 

  } catch (error) {
    console.error("Ошибка при генерации:", error);
    throw error;
  }
}
