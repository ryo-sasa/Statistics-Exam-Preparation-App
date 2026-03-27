// Vercel Serverless Function: 管理者パスワード検証
// ADMIN_PASSWORD は Vercel 環境変数で設定（VITE_ 接頭辞なし = サーバー側のみ）

export default async function handler(req, res) {
  // CORS
  const allowedOrigins = [
    'https://statistics-exam-preparation-app.vercel.app',
    'http://localhost:5173',
    'http://localhost:4173',
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return res.status(503).json({ error: 'Admin mode not configured' });
  }

  const { password } = req.body || {};
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Password required' });
  }

  if (password === adminPassword) {
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ error: '管理者パスワードが正しくありません' });
}
