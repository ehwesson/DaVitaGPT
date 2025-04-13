// for handling OpenAI API Calls
// sends prompts and generates responses. 
//_______________________

import fetch from 'node-fetch';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
console.log("🔑 Using OpenAI key:", OPENAI_API_KEY ? "Loaded" : "Missing");

//  tags (could be moved to external storage later)
const availableTags = [
  "capstone", "code", "code-demonstration", "code-overview", "compliance", "confluencechatgpt", "data-cleansing",
  "general-medical", "hosting", "kidney-disease", "kidney-dialysis", "localhost", "manual", "medical", "meeting_minutes",
  "openai", "phi", "pii", "programming", "recommendations", "scheduling", "tagging", "test", "testing", "training", "vercel", "vector"
];


// Utility delay
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Identifies relevant Confluence tags for the question using OpenAI
 * @param {string} question
 * @returns {Promise<string[]>}
 */
export async function determineRelevantTags(question) {
  if (!OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is missing.");
    return [];
  }

  const payload = {
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'Given a user question, return the most relevant tags from the provided list. Respond with a comma-separated list of tag names only.'
      },
      {
        role: 'user',
        content: `User question: "${question}"\nAvailable tags: ${availableTags.join(", ")}\nWhich tags are relevant?`
      }
    ]
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error("Error calling OpenAI (tag detection):", response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    const extractedTags = data.choices[0]?.message?.content.split(",").map(tag => tag.trim()) || [];
    const validTags = extractedTags.filter(tag => availableTags.includes(tag));
    
    console.log("🏷️ Relevant tags identified:", validTags);
    return validTags;
  } catch (error) {
    console.error("🚨 Error in determineRelevantTags:", error);
    return [];
  }
}

/**
 * Sends question and documents to OpenAI for final answer
 * @param {string} question
 * @param {string} context
 * @returns {Promise<string>}
 */
export async function fetchOpenAIResponse(question, context) {
  if (!OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is missing.");
    return "Missing OpenAI credentials.";
  }

  if (!context) {
    console.log("No context provided. Skipping OpenAI response.");
    return "No relevant documents found.";
  }

  const prompt = `User question: ${question}\n\nRelevant documents:\n${context}\n\nProvide a short and concise answer based only on these documents. 1-4 sentences. Include the titles of all documents used to form this answer.`;

  const payload = {
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant providing clear answers based on provided documents only.'
      },
      {
        role: 'user',
        content: prompt
      }
    ]
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error("Error calling OpenAI (final response):", response.status, response.statusText);
      return "There was an issue generating a response.";
    }

    const data = await response.json();
    const answer = data.choices[0]?.message?.content || "I couldn't generate a response.";
    console.log("OpenAI answered:", answer);
    return answer;
  } catch (error) {
    console.error("Error in fetchOpenAIResponse:", error);
    return "There was an issue retrieving a response.";
  }
}

/**
 * !Optional! wrapper that adds delay before calling OpenAI
 * @param {string} question 
 * @param {string} context 
 * @returns {Promise<string>}
 */
export async function generateResponse(question, context) {
  console.log("Waiting 5 seconds before calling OpenAI...");
  await wait(5000);

  try {
    const answer = await fetchOpenAIResponse(question, context);
    return answer;
  } catch (error) {
    console.error("Error in generateResponse:", error);
    return "There was a problem generating the answer.";
  }
}
