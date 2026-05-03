// Serverless proxy for fetching Vercel projects with deployments.
// Deploy this file to Vercel (place at /api/projects). Set the VERCEL_TOKEN
// in your Vercel project settings (Environment Variables) as a secret.

export default async function handler(req, res) {
  const token = process.env.VERCEL_TOKEN;

  if (!token) {
    console.error('Missing VERCEL_TOKEN in environment');
    return res.status(500).json({ error: 'Server misconfigured: missing VERCEL_TOKEN. Add VERCEL_TOKEN in Vercel Project Settings → Environment Variables.' });
  }

  try {
    const apiRes = await fetch('https://api.vercel.com/v9/projects?withDeployments=true', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const bodyText = await apiRes.text();

    if (!apiRes.ok) {
      // Try to parse JSON error, otherwise include raw text
      let parsed;
      try {
        parsed = JSON.parse(bodyText);
      } catch (e) {
        parsed = { message: bodyText };
      }
      console.error('Upstream Vercel API error', apiRes.status, parsed);
      return res.status(apiRes.status).json({ error: 'Vercel API error', status: apiRes.status, details: parsed });
    }

    // Successful response
    try {
      const data = JSON.parse(bodyText);
      return res.status(200).json(data);
    } catch (e) {
      // Shouldn't happen, but return raw text if JSON parse fails
      return res.status(200).send(bodyText);
    }
  } catch (err) {
    console.error('Error fetching Vercel API:', err);
    return res.status(502).json({ error: 'Failed to fetch Vercel API', message: err.message });
  }
}
