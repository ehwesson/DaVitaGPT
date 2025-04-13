// clients/frontendAPI.js
// Handles sending a request from frontend to the backend API route

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
      const errorMessage = await response.text();
      console.error('Backend returned an error:', errorMessage);
      return { answer: 'Error from server.' };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to reach backend:', error);
    return { answer: 'Failed to reach backend.' };
  }
}
