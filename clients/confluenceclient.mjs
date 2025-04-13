// this file manages our interactions with Confluence REST API
// fetches documents, urls, and other metadata

import fetch from 'node-fetch';

const CONFLUENCE_BASE_URL = 'https://miscapstones25.atlassian.net/wiki/rest/api';

function getAuthHeader() {
  const email = process.env.CONFLUENCE_EMAIL;
  const token = process.env.CONFLUENCE_API_TOKEN;

  if (!email || !token) {
    console.error("Missing CONFLUENCE_EMAIL or CONFLUENCE_API_TOKEN");
    return null;
  }

  return `Basic ${Buffer.from(`${email}:${token}`).toString('base64')}`;
}

/**
 * Fetches Confluence documents that match labels.
 */
export async function fetchConfluenceDocsWithMeta(tags) {
  const authHeader = getAuthHeader();
  if (!authHeader) {
    console.error("Authorization header is missing.");
    return null;
  }

  const cqlQuery = tags.map(tag => `label = "${tag}"`).join(' OR ');
  const encodedCql = encodeURIComponent(`(${cqlQuery}) ORDER BY lastModified DESC`);
  const url = `${CONFLUENCE_BASE_URL}/content/search?limit=5&cql=${encodedCql}&expand=space,body.view`;

  console.log("📡 Fetching Confluence docs from:", url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': authHeader
      }
    });

    console.log("Confluence response:", response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`Confluence fetch error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      console.log("No documents found for these tags.");
      return null;
    }

    const sources = [];
    const docContents = [];

    for (const doc of data.results) {
      const title = doc.title || 'Untitled';
      const body = doc.body?.view?.value || '';
      const webUrl = `https://miscapstones25.atlassian.net/wiki${doc._links.webui}`;

      if (body.length > 0) {
        docContents.push(`${title}:\n${stripHtml(body)}`);
        sources.push({ title, url: webUrl });
      }
    }

    return {
      combinedContent: docContents.join('\n\n---\n\n'),
      sources
    };

  } catch (error) {
    console.error("Error during Confluence fetch:", error);
    return null;
  }
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, '');
}
