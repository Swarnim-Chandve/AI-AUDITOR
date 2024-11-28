import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || '');

export const analyzeContract = async (
  contract: string, 
  setResults: (results: any) => void, 
  setLoading: (loading: boolean) => void
) => {
  setLoading(true);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are an AI Smart Contract Auditor. Analyze this smart contract and provide a PRECISE JSON response. Remove any code blocks or extra formatting.

    Smart Contract: ${contract}
    
    Respond EXACTLY in this JSON format, with no additional text:
    [
      {
        "section": "Audit Report",
        "details": "Detailed audit report covering security, performance, and key aspects"
      },
      {
        "section": "Metric Scores",
        "details": [
          {"metric": "Security", "score": 7},
          {"metric": "Performance", "score": 6},
          {"metric": "Other Key Areas", "score": 5},
          {"metric": "Gas Efficiency", "score": 4},
          {"metric": "Code Quality", "score": 6},
          {"metric": "Documentation", "score": 3}
        ]
      },
      {
        "section": "Suggestions for Improvement",
        "details": "Key recommendations for enhancing the smart contract"
      }
    ]`;
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    const cleanedResponse = response
      .replace(/^```json\s*/, '')
      .replace(/```\s*$/, '')
      .trim();
    
    const auditResults = JSON.parse(cleanedResponse);
    
    setResults(auditResults);
    setLoading(false);
  } catch (error) {
    console.error('Contract analysis error:', error);
    setLoading(false);
  }
};

export const fixIssues = async (
  contract: string, 
  suggestions: string, 
  setContract: (contract: string) => void, 
  setLoading: (loading: boolean) => void
) => {
  setLoading(true);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Fix this smart contract addressing these specific issues: ${suggestions}

    Original Contract:
    ${contract}
    
    Provide ONLY the corrected smart contract code. No additional explanation.`;
    
    const result = await model.generateContent(prompt);
    const fixedContract = result.response.text()
      .replace(/^```[a-z]*\s*/, '')  
      .replace(/```\s*$/, '')         
      .trim();
    
    setContract(fixedContract);
    setLoading(false);
  } catch (error) {
    console.error('Contract fixing error:', error);
    setLoading(false);
  }
};