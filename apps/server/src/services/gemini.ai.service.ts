import { AnalysisResult, GenerateContentRequest } from "../models/ai.models";

export async function analyzeDocuments(
  cvText: string,
  jobDescriptionText: string
): Promise<AnalysisResult> {
  const prompt = `
    You are an expert recruiter and hiring manager. Analyze the following CV against the job description and provide a detailed assessment.
    
    Job Description:
    ${jobDescriptionText}
    
    CV/Resume:
    ${cvText}
    
    Please provide a thorough analysis in the following JSON format:
    {
      "alignmentScore": <number between 0-100 representing percentage match>,
      "strengths": [<list of at least 3 specific candidate strengths relevant to the job>],
      "weaknesses": [<list of at least 2 areas where candidate may fall short>],
      "recommendations": [<list of at least 2 actionable suggestions for the candidate or hiring team>],
      "summary": "<a comprehensive 2-3 sentence overall assessment>"
    }
    
    Be specific and reference actual skills, experiences, and requirements from both documents.
  `;

  const request: GenerateContentRequest = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
        role: "user"
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  };

  try {
    const apiUrl = process.env.GEMINI_API_URL;
    const authToken = process.env.GEMINI_AUTH_TOKEN;

    if (!apiUrl || !authToken) {
      throw new Error('Missing API configuration. Please check your environment variables.');
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${authToken}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{
            text?: string;
          }>;
        };
      }>;
    };

    // Parse the response - adjust based on actual Gemini response format
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!textResponse) {
      throw new Error('No response from AI model');
    }

    // Extract JSON from response
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate the response structure
      if (
        typeof parsed.alignmentScore === 'number' &&
        Array.isArray(parsed.strengths) &&
        Array.isArray(parsed.weaknesses) &&
        Array.isArray(parsed.recommendations) &&
        typeof parsed.summary === 'string'
      ) {
        return parsed;
      }
    }

    // Fallback if parsing fails
    console.warn('Failed to parse structured response, using fallback');
    return {
      alignmentScore: 50,
      strengths: ['Unable to parse complete analysis', 'Please try again'],
      weaknesses: ['Analysis format error'],
      recommendations: ['Resubmit documents for analysis'],
      summary: 'The analysis was completed but could not be properly formatted. Raw response: ' + textResponse.substring(0, 200),
    };
  } catch (error) {
    console.error('AI analysis error:', error);
    throw error instanceof Error ? error : new Error('Failed to analyze documents with AI');
  }
}
