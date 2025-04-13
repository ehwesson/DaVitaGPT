import { runIntegrationTestForQuery } from '../lib/apiIntegration.mjs';

console.log("ENV check:", {
  OPENAI: process.env.OPENAI_API_KEY ? "✅" : "❌",
  CONF_EMAIL: process.env.CONFLUENCE_EMAIL ? "✅" : "❌",
  CONF_TOKEN: process.env.CONFLUENCE_API_TOKEN ? "✅" : "❌",
});

export default async function handler(req, res) {
  try {
    console.log('[API] /api/query hit');
    console.log(`[API] Method: ${req.method}`);

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Only POST requests allowed' });
    }

    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Missing 'question'" });
    }

    const result = await runIntegrationTestForQuery(question);
    console.log('[API] Result:', result);

    if (result.error) {
      return res.status(200).json({ answer: result.error });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('[API] Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


