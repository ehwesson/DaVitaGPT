// responsible for sending a request from frontend to backend point

export async function runQuery(question) {
  const response = await fetch('/api/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question }),
  });

  return await response.json();
}



