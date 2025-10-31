const OpenAI = require('openai');
const { ANALYSIS_PROMPTS } = require('../utils/constants.js');

class OpenAIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async analyzeResume(resumeData, analysisType = 'comprehensive') {
    const startTime = Date.now();
    
    try {
      const prompt = this.buildPrompt(resumeData, analysisType);
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert resume analyst and career coach. Provide detailed, actionable feedback in JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      const content = completion.choices[0].message.content;
      const analysisResult = JSON.parse(content);
      
      const processingTime = Date.now() - startTime;
      
      return {
        ...analysisResult,
        metadata: {
          processingTime,
          provider: 'openai',
          model: 'gpt-3.5-turbo'
        }
      };
      
    } catch (error) {
      console.error('OpenAI Analysis Error:', error);
      throw new Error(`OpenAI analysis failed: ${error.message}`);
    }
  }

  buildPrompt(resumeData, analysisType) {
    const promptTemplate = ANALYSIS_PROMPTS[analysisType] || ANALYSIS_PROMPTS.comprehensive;
    return promptTemplate.replace('{resumeData}', JSON.stringify(resumeData, null, 2));
  }
}

module.exports = OpenAIService;