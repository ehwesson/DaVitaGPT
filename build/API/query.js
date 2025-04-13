// api/query.js
import { runIntegrationTestForQuery } from '../../API/apiIntegration.mjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST supported' });
  }

  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: "Missing 'question'" });
  }

  const result = await runIntegrationTestForQuery(question);
  return res.status(200).json(result);
}
