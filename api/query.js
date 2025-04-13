// api/query.js
import { runIntegrationTestForQuery } from './apiIntegration.mjs';

export default async function handler(req, res) {
  console.log('[API] /api/query endpoint hit');
  console.log(`[API] Method: ${req.method}`);

  if (req.method !== 'POST') {
    console.warn('[API] Invalid request method');
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  try {
    const { question } = req.body;
    console.log(`[API] Received question: ${question}`);

    if (!question) {
      console.warn('[API] No question provided in request body');
      return res.status(400).json({ error: "Missing 'question'" });
    }

    const result = await runIntegrationTestForQuery(question);

    if (result.error) {
      console.warn('[API] Integration test returned error:', result.error);
      return res.status(200).json({ answer: result.error });
    }

    console.log('[API] Returning successful result');
    res.status(200).json(result);

  } catch (error) {
    console.error('[API] Error processing query:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

