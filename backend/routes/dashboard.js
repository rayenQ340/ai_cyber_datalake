const router = require('express').Router();
const requireAuth = require('../middleware/auth');
const Host = require('../models/Host');
const Incident = require('../models/Incident');

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const [hosts, incidents, openIncidents, anomalies, dist] = await Promise.all([
      Host.find().sort({ risk: -1 }).limit(10),
      Incident.find().sort({ createdAt: -1 }).limit(8),
      Incident.countDocuments({ open: true }),
      Incident.countDocuments({ detectedBy: 'Anomaly model' }),
      Incident.aggregate([{ $group: { _id: '$attackClass', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    ]);
    const total = dist.reduce((s, d) => s + d.count, 0) || 1;
    res.json({
      kpis: {
        alertsAnalyzed: 199361, // size of the Suricata dataset; replace with a real count from your Gold tier
        openIncidents,
        highRiskHosts: hosts.filter((h) => h.risk >= 80).length,
        anomalies,
      },
      hosts,
      distribution: dist.map((d) => ({ label: d._id, percent: Math.round((d.count / total) * 100) })),
      incidents,
    });
  } catch (e) { next(e); }
});

module.exports = router;
