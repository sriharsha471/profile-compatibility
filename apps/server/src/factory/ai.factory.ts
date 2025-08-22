import { AnalysisResult } from "../models/ai.models";
import { AiModel } from "../models/enum/models.enum";

export async function detetmineAiModel  ( cvText: string,
  jobDescriptionText: string, model: AiModel) : Promise<AnalysisResult>  {

    if(model === AiModel.GEMINI) {
        const { analyzeDocuments } = await import('../services/gemini.ai.service');
        return analyzeDocuments(cvText, jobDescriptionText);
    }
    throw new Error(`Unsupported AI model: ${model}`);

}