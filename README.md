DaVitaGPT is a hosted proof-of-concept AI assistant that integrates Confluence and OpenAI to help DaVita team members find relevant documentation with ease. It scans tagged Confluence pages, extracts content, and uses OpenAI to answer user questions based on that content—all within a familiar, conversational interface.

This version is now deployed on Vercel: https://da-vita-gpt.vercel.app

The following secrets are required and should be added to your Vercel project settings:
OPENAI_API_KEY=your-openai-api-key
CONFLUENCE_EMAIL=your-email@example.com
CONFLUENCE_API_TOKEN=your-confluence-api-token

Do not include .env in your repository. It is expected to be defined as environment variables in the hosting platform (e.g., Vercel).

Development Notes: 
Update availableTags in clients/openaiclient.mjs to reflect your Confluence labels.
Ensure your Confluence pages are tagged with labels that the system expects.
Make sure your Confluence credentials have full access to the workspace documents.

known issues:
Hosted backend may return 500 errors if required environment variables are missing or misconfigured.
Tags not matching Confluence labels will yield no context for OpenAI.
Long documents may impact performance or response clarity.