// apiIntegration.mjs - handles the integration logic between confluence and openai
// processes user queries
import { fetchConfluenceDocsWithMeta } from '../clients/confluenceclient.mjs';
import { determineRelevantTags, fetchOpenAIResponse } from '../clients/openaiclient.mjs';

export async function runIntegrationTestForQuery(question) {
  console.log('[Integration] Starting integration test for:', question);

  try {
    const tags = await determineRelevantTags(question);
    console.log('[Integration] Tags returned by OpenAI:', tags);

    const docData = await fetchConfluenceDocsWithMeta(tags);
    console.log('[Integration] Fetched Confluence docs:', docData);

    const answer = await fetchOpenAIResponse(question, docData?.combinedContent);
    console.log('[Integration] Answer from OpenAI:', answer);

    return {
      answer,
      sources: docData?.sources || [],
    };
  } catch (err) {
    console.error('[Integration] Error in integration test:', err);
    return { error: 'Integration failed' };
  }
}
