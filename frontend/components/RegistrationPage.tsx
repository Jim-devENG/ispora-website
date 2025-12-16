import React from 'react';
import { UnifiedRegistrationForm } from './UnifiedRegistrationForm';

interface RegistrationPageProps {
  onPageChange: (page: string) => void;
}

export function RegistrationPage({ onPageChange }: RegistrationPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <UnifiedRegistrationForm showHeader={true} />
      </main>
    </div>
  );
}
