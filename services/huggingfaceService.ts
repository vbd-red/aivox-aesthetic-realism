// Замени hf_ВАШ_ТОКЕН на твой реальный токен (оставь кавычки!)
const HF_TOKEN = "hf_ВАШ_ТОКЕН"; 
const API_URL = "/api/hf/models/black-forest-labs/FLUX.1-schnell";

export async function generateImage(promptText: string): Promise<string> {
  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`, 
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ inputs: promptText }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Детали ошибки от HF:", errorData);
      throw new Error(`Ошибка от сервера: ${response.status}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob); 

  } catch (error) {
    console.error("Ошибка при генерации:", error);
    throw error;
  }
}
