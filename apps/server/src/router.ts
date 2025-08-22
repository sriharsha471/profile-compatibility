import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { analyzeDocuments } from './services/ai.service';
import { extractTextFromPDF } from './services/pdf.service';
import { rateLimiter } from './utils/rateLimit';

const t = initTRPC.create();

export const appRouter = t.router({
  health: t.procedure.query(() => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })),

  analyzeCV: t.procedure
    .input(
      z.object({
        cvBase64: z.string().min(1, 'CV is required'),
        jobDescriptionBase64: z.string().min(1, 'Job description is required'),
      })
    )
    .mutation(async ({ input }) => {
      // Apply rate limiting
      const canProceed = await rateLimiter.check();
      if (!canProceed) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      try {
        // Extract text from PDFs
        const cvBuffer = Buffer.from(input.cvBase64, 'base64');
        const jdBuffer = Buffer.from(input.jobDescriptionBase64, 'base64');

        const [cvText, jobDescriptionText] = await Promise.all([
          extractTextFromPDF(cvBuffer),
          extractTextFromPDF(jdBuffer),
        ]);

        if (!cvText || cvText.trim().length === 0) {
          throw new Error('Could not extract text from CV PDF');
        }

        if (!jobDescriptionText || jobDescriptionText.trim().length === 0) {
          throw new Error('Could not extract text from job description PDF');
        }

        // Analyze with AI
        const analysis = await analyzeDocuments(cvText, jobDescriptionText);

        return {
          success: true,
          analysis,
        };
      } catch (error) {
        console.error('Analysis error:', error);
        throw error instanceof Error ? error : new Error('Failed to analyze documents');
      }
    }),
});

export type AppRouter = typeof appRouter;
