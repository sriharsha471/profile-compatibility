import { AnalysisResult } from "../models/ai.models";
import { AiModel } from "../models/enum/models.enum";
import {analyzeDocuments} from "../services/gemini.ai.service";

export async function detetmineAiModel  ( cvText: string,
  jobDescriptionText: string, model: AiModel) : Promise<AnalysisResult>  {

    if(model === AiModel.GEMINI) {
        return analyzeDocuments(cvText, jobDescriptionText);
    }
    throw new Error(`Unsupported AI model: ${model}`);

}