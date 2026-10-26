import Link from 'next/link';
import Reveal from '@/components/Reveal';
import LiveFeed from '@/components/LiveFeed';

const features = [
  ['Centralize security events', 'Network connections, authentications, DNS queries and system logs in one place.'],
  ['Detect known attacks', 'XGBoost and LightGBM classify alerts that match labeled attack patterns.'],
  ['Catch unknown behavior', 'An autoencoder and Isolation Forest flag activity that matches no existing rule.'],
  ['Explain every score', 'See which factors made a host dangerous, so you can justify each decision.'],
];
const flow = ['Ingestion', 'Bronze', 'Silver', 'Gold', 'Feature engineering', 'Classification + anomaly detection', 'Host risk score', 'SOC dashboard'];
const headline = 'Thousands of alerts in. A short list of risky hosts out.'.split(' ');

export default function Home() {
  return (
    <>
      <div className="wrap hero">
        <div>
          <h1>{headline.map((w, i) => <span className="w" style={{ '--i': i }} key={i}>{w}&nbsp;</span>)}</h1>
          <p className="lead rise" style={{ '--d': '800ms' }}>A Mini-SOC platform that collects network security logs in a data lake, detects known attacks and unknown anomalies with AI, and gives every host a risk score you can explain.</p>
          <div className="row rise" style={{ '--d': '1000ms' }}>
            <Link className="btn" href="/signup">Create an account</Link>
            <Link className="btn alt" href="/login">Log in</Link>
          </div>
        </div>
        <div className="lake rise" style={{ '--d': '600ms' }}>
          <h3><span className="live">Live threat feed</span></h3>
          <LiveFeed />
          <div className="pipe"><span>Bronze</span><b /><span>Silver</span><b /><span>Gold</span></div>
        </div>
      </div>

      <section className="wrap band">
        <Reveal><h2>What the platform does</h2></Reveal>
        <div className="grid">
          {features.map(([t, d], i) => (
            <Reveal key={t} delay={i * 90} className="card"><h3>{t}</h3><p>{d}</p></Reveal>
          ))}
        </div>
      </section>

      <section className="wrap band">
        <Reveal>
          <h2>From data to incident</h2>
          <p className="lead">Built on the Suricata alert dataset: 199,361 records across 9 columns.</p>
        </Reveal>
        <div className="flow">{flow.map((f, i) => <Reveal as="span" key={f} delay={i * 80}>{f}</Reveal>)}</div>
        <Reveal><p className="lead" style={{ marginTop: 24 }}>Stack: Next.js, Express, MongoDB, Git and GitHub, DVC, MLflow, Docker.</p></Reveal>
      </section>
    </>
  );
}
