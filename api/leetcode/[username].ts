import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { username } = req.query;
  const user = Array.isArray(username) ? username[0] : username;

  if (!user) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const leetcodeRes = await fetch(`https://leetcode-stats-api.herokuapp.com/${user}`);
    if (leetcodeRes.ok) {
      const data = await leetcodeRes.json();
      if (data.status === 'success' || data.totalSolved !== undefined) {
        return res.status(200).json({
          totalSolved: data.totalSolved || 0,
          easySolved: data.easySolved || 0,
          mediumSolved: data.mediumSolved || 0,
          hardSolved: data.hardSolved || 0,
          ranking: data.ranking || 0,
          acceptanceRate: data.acceptanceRate || 0,
          submissionCalendar: data.submissionCalendar || {},
          isLive: true,
        });
      }
    }
  } catch (err) {
    console.warn('LeetCode stats API query failed:', err);
  }

  // Graceful fallback profile data
  return res.status(200).json({
    totalSolved: 142,
    easySolved: 58,
    mediumSolved: 68,
    hardSolved: 16,
    ranking: 185420,
    acceptanceRate: 64.2,
    submissionCalendar: {},
    isLive: false,
  });
}
