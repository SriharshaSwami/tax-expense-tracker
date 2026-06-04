import ai from '../config/gemini.js';

export const testApi = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API working',
  })
}

export const testAi = async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Reply with: Gemini connection successful',
    });
    
    res.status(200).json({
      success: true,
      data: response.text,
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to connect to Gemini API',
      error: error.message,
    });
  }
}
