// Serverless proxy for Vercel Projects
// This function calls the Vercel API using a server-side env var (VERCEL_TOKEN)
// and returns the response to the client. Set VERCEL_TOKEN in your Vercel
// project settings (Environment Variables) — do NOT prefix it with VITE_.

module.exports = async (req, res) => {
  const token = process.env.VERCEL_TOKEN;

  if (!token) {
    res.status(400).json({ error: 'Server: VERCEL_TOKEN is not configured' });
    return;
  }

  try {
    const apiRes = await fetch('https://api.vercel.com/v9/projects?withDeployments=true', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const text = await apiRes.text();

    // Forward status and body from Vercel API
    res.status(apiRes.status).setHeader('Content-Type', 'application/json').send(text);
  } catch (err) {
    console.error('Error proxying to Vercel API:', err);
    res.status(500).json({ error: 'Server error contacting Vercel API', details: err.message });
  }
};
