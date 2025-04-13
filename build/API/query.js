// api/query.mjs
import { runIntegrationTestForQuery } from './apiIntegration.mjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  try {
    const { question } = await req.json(); // For edge-compatible streaming
    if (!question) {
      return new Response(JSON.stringify({ error: "Missing 'question'" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await runIntegrationTestForQuery(question);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('API error:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
