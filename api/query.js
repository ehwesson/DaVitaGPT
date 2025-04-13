import { runIntegrationTestForQuery } from './apiIntegration.mjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Missing 'question'" });
    }

    const result = await runIntegrationTestForQuery(question);

    if (result.error) {
      return res.status(200).json({ answer: result.error });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error processing query:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

