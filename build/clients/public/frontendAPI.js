// responsible for sending a request from frontend to backend point
// clients/frontendAPI.js

export async function runQuery(question) {
  try {
    const response = await fetch('/api/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Server returned error:", error);
      return { answer: error.error || 'Unknown error' };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch failed:', error);
    return { answer: 'Failed to reach backend.' };
  }
}

