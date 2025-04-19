export async function translateToEnglish(text) {
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
  
    const body = {
      q: text,
      target: 'en',
      format: 'text',
    };
  
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  
    const data = await res.json();
    return {
      translatedText: data.data.translations[0].translatedText,
      detectedLanguage: data.data.translations[0].detectedSourceLanguage,
    };
  }
  