require('dotenv').config();
const mongoose = require('mongoose');
const Host = require('./models/Host');
const Incident = require('./models/Incident');

const hosts = [
  { ip: '192.168.1.14', risk: 94, factors: 'Repeated exploit signatures, rare destination ports', status: 'Investigate' },
  { ip: '10.0.0.52', risk: 81, factors: 'Traffic spike, high anomaly score', status: 'Investigate' },
  { ip: '172.16.4.9', risk: 67, factors: 'Policy violation alerts, new external peers', status: 'Review' },
  { ip: '192.168.1.77', risk: 48, factors: 'Moderate alert volume, known scanner pattern', status: 'Review' },
  { ip: '10.0.2.31', risk: 22, factors: 'Few low priority alerts', status: 'Monitor' },
];
const classes = [
  ['Generic Protocol Command Decode', 38], ['Potential Corporate Privacy Violation', 27],
  ['Attempted Information Leak', 16], ['Misc Activity', 11], ['Anomaly (no rule match)', 8],
];
const incidents = [];
classes.forEach(([attackClass, n]) => {
  for (let i = 0; i < n; i++) {
    const h = hosts[Math.floor(Math.random() * hosts.length)];
    incidents.push({
      src: h.ip, dst: `203.0.113.${1 + Math.floor(Math.random() * 250)}`,
      port: [22, 53, 80, 443, 445, 8080][Math.floor(Math.random() * 6)], attackClass,
      detectedBy: attackClass.startsWith('Anomaly') ? 'Anomaly model' : 'Classifier',
      open: Math.random() < 0.15,
      createdAt: new Date(Date.now() - Math.random() * 36e5 * 12),
    });
  }
});

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([Host.deleteMany({}), Incident.deleteMany({})]);
  await Host.insertMany(hosts);
  await Incident.insertMany(incidents);
  console.log('Seeded', hosts.length, 'hosts and', incidents.length, 'incidents');
  process.exit(0);
})();
