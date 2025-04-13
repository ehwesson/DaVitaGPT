// this file manages our interactions with Confluence REST API
// fetches documents, urls, and other metadata

import fetch from 'node-fetch';
import { Buffer } from 'node:buffer';


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
 * @param {string[]} tags - List of label strings.
 * @returns {Promise<{ combinedContent: string, sources: { title: string, url: string }[] } | null>}
 */
export async function fetchConfluenceDocsWithMeta(tags) {
  console.log("fetchConfluenceDocsWithMeta triggered with tags:", tags);
  console.log("Auth Header:", authHeader);

  const authHeader = getAuthHeader();
  if (!authHeader){ return null; } 

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

      console.log(`📄 Document: "${title}" (${body.length} chars)`);

      if (body.length > 0) {
        docContents.push(`${title}:\n${stripHtml(body)}`);
        sources.push({ title, url: webUrl });
      }
    }

    if (docContents.length === 0) {
      console.log("All documents returned were empty.");
      return null;
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

/**
 * Removes HTML tags from Confluence body content.
 * @param {string} html
 * @returns {string}
 */
function stripHtml(html) {
  return html.replace(/<[^>]+>/g, '');
}
