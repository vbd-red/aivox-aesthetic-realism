const RAW_TOKEN = "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"; 
const HF_TOKEN = RAW_TOKEN.replace(/[^\x20-\x7E]/g, "").trim();
const API_URL = "/api/hf/models/black-forest-labs/FLUX.1-schnell";

export async function generateImage(promptText: string): Promise<string> {
  try {
    const response = await fetch(API_URL, {
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`, 
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ inputs: promptText }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("HF Error details:", errorData);
      throw new Error(`Ошибка от сервера: ${response.status}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob); 

  } catch (error) {
    console.error("Generation error:", error);
    throw error;
  }
}
