const { GoogleGenerativeAI } = require('@google/generative-ai');
const { ANALYSIS_PROMPTS } = require('../utils/constants.js');

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured in environment variables');
    }
    
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = null;
    this.currentModelName = null;
    
    this.initializeModel();
  }

  initializeModel() {
    // Try the latest models first
    const availableModels = [
      'gemini-2.0-flash-exp', // Latest experimental version
      'gemini-2.5-flash',
      'gemini-1.5-pro',
      'gemini-1.0-pro'
    ];

    for (const modelName of availableModels) {
      try {
        console.log(`🔄 Trying to initialize model: ${modelName}`);
        this.model = this.genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 2048,
          }
        });
        this.currentModelName = modelName;
        console.log(`✅ Successfully initialized: ${modelName}`);
        break;
      } catch (error) {
        console.log(`❌ Model ${modelName} failed: ${error.message}`);
        continue;
      }
    }

    if (!this.model) {
      console.warn('⚠️ No Gemini model could be initialized. Using basic analysis only.');
    }
  }

  async analyzeResume(resumeData, analysisType = 'comprehensive') {
    if (!this.model) {
      throw new Error('Gemini model not available');
    }

    const startTime = Date.now();
    
    try {
      const prompt = this.buildPrompt(resumeData, analysisType);
      
      console.log(`🚀 Sending request to Gemini (${this.currentModelName})...`);
      
      // Log the prompt (first 500 chars) for debugging
      console.log(`📝 Prompt preview: ${prompt.substring(0, 500)}...`);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();
      
      // ✅ NOW SHOWING RAW RESPONSE
      console.log('📄 FULL RAW RESPONSE:');
      console.log('=' .repeat(50));
      console.log(content);
      console.log('=' .repeat(50));
      console.log(`📏 Response length: ${content.length} characters`);
      
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.log('❌ No JSON found in response. Using fallback analysis.');
        console.log('🔍 Response starts with:', content.substring(0, 200));
        return this.getFallbackAnalysis();
      }
      
      console.log('✅ JSON pattern found, attempting to parse...');
      
      try {
        const analysisResult = JSON.parse(jsonMatch[0]);
        const processingTime = Date.now() - startTime;
        
        console.log(`✅ Gemini analysis completed in ${processingTime}ms`);
        console.log(`📊 Analysis results - Overall Score: ${analysisResult.overallScore}`);
        
        return {
          ...analysisResult,
          metadata: {
            processingTime,
            provider: 'gemini',
            model: this.currentModelName,
            success: true,
            responseLength: content.length
          }
        };
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError.message);
        console.log('🔍 Problematic JSON:', jsonMatch[0].substring(0, 500));
        return this.getFallbackAnalysis();
      }
      
    } catch (error) {
      console.error('❌ Gemini Analysis Error:', error.message);
      throw new Error(`Gemini analysis failed: ${error.message}`);
    }
  }

  getFallbackAnalysis() {
    return {
      overallScore: 70,
      sectionScores: {
        personal: 80,
        education: 75,
        experience: 65,
        projects: 70,
        skills: 75
      },
      strengths: [
        "Resume has good structure and organization",
        "Includes relevant sections for professional presentation"
      ],
      improvements: [
        "Add more quantifiable achievements",
        "Include specific technologies and tools",
        "Expand on project descriptions and impact"
      ],
      atsScore: 65,
      aiSuggestions: {
        immediateImprovements: [
          "Use action verbs to start bullet points",
          "Add measurable results and metrics",
          "Include relevant keywords from job descriptions"
        ],
        longTermSuggestions: [
          "Build a portfolio of projects demonstrating skills",
          "Gain experience through internships or freelance work",
          "Network with professionals in your target industry"
        ]
      },
      metadata: {
        provider: 'gemini',
        model: this.currentModelName,
        fallback: true
      }
    };
  }

  buildPrompt(resumeData, analysisType) {
    const promptTemplate = ANALYSIS_PROMPTS[analysisType] || ANALYSIS_PROMPTS.comprehensive;
    
    // Ensure resumeData is properly stringified
    const resumeJson = typeof resumeData === 'string' ? resumeData : JSON.stringify(resumeData, null, 2);
    
    const fullPrompt = promptTemplate.replace('{resumeData}', resumeJson);
    
    // Enhanced JSON instruction
    return fullPrompt + "\n\nCRITICAL: You MUST respond with ONLY valid JSON. Do not include any other text, code fences, markdown, or explanations. Your entire response should be parseable by JSON.parse().";
  }

  // Test with simpler prompt
  async testWithSimplePrompt() {
    if (!this.model) {
      throw new Error('No model available');
    }

    try {
      const testPrompt = `Return ONLY this exact JSON without any other text: {"test": "success", "score": 85}`;
      console.log('🧪 Testing with simple prompt...');
      
      const result = await this.model.generateContent(testPrompt);
      const response = await result.response;
      const content = response.text();
      
      console.log('Simple test response:', content);
      
      // Try to parse
      try {
        const parsed = JSON.parse(content);
        console.log('✅ Simple test PASSED - JSON parsed successfully');
        return parsed;
      } catch (e) {
        console.log('❌ Simple test FAILED - Response is not valid JSON');
        return { error: 'Not valid JSON', response: content };
      }
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  }
}

module.exports = GeminiService;