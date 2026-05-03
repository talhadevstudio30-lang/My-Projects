// Serverless proxy for fetching Vercel projects with deployments.
// Deploy this file to Vercel (place at /api/projects). Set the VERCEL_TOKEN
// in your Vercel project settings (Environment Variables) as a secret.

export default async function handler(req, res) {
  const token = process.env.VERCEL_TOKEN;

  if (!token) {
    return res.status(500).json({ error: 'Server misconfigured: missing VERCEL_TOKEN' });
  }

  try {
    const apiRes = await fetch('https://api.vercel.com/v9/projects?withDeployments=true', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!apiRes.ok) {
      const text = await apiRes.text();
      return res.status(apiRes.status).send(text);
    }

    const data = await apiRes.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching Vercel API:', err);
    return res.status(502).json({ error: 'Failed to fetch Vercel API' });
  }
}
