import Navbar from '@/components/Navbar';
import { ScoreProvider } from './ScoreProvider';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ScoreProvider> {/* ✅ Wrap the entire app with ScoreProvider */}
      <div className="flex flex-col min-h-screen">
        <Navbar />
        {children}
      </div>
    </ScoreProvider>
  );
}
