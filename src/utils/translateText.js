export async function translateToEnglish(text) {
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
  
    const body = {
      q: text,
      target: 'en',
      format: 'text',
    };
  
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
  
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal
      });
  
      clearTimeout(timeout);
      const data = await res.json();
  
      return {
        translatedText: data.data.translations[0].translatedText,
        detectedLanguage: data.data.translations[0].detectedSourceLanguage,
      };
    } catch (err) {
      console.error("Translation failed:", err.message);
      return {
        translatedText: text,
        detectedLanguage: "und"
      };
    }
  }
  