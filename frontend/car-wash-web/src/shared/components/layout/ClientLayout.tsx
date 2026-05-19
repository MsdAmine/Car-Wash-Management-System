import { type ReactNode } from 'react';
import { ImagePlaceholder } from '@/shared/components/ui/ImagePlaceholder';

interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 h-14 px-6 flex items-center justify-between">
        <span className="text-lg font-semibold text-indigo-600">WashFlow</span>
        <ImagePlaceholder label="Avatar" className="w-8 h-8 rounded-full" />
      </nav>
      {children}
    </div>
  );
}
