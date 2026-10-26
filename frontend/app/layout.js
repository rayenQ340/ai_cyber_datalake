import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import NetworkCanvas from '@/components/NetworkCanvas';

export const metadata = {
  title: 'AI Cybersecurity Data Lake',
  description: 'AI-assisted Mini-SOC platform: data lake, attack classification, anomaly detection and host risk scores.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NetworkCanvas />
        <div className="app">
          <AuthProvider>
            <Navbar />
            {children}
            <footer>AI Cybersecurity Data Lake · Big Data and Deep Learning project · TEK-UP University</footer>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
