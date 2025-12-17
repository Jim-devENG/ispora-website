import React from 'react';
import { JoinPage } from './JoinPage';

interface RegistrationPageProps {
  onPageChange: (page: string) => void;
}

export function RegistrationPage({ onPageChange }: RegistrationPageProps) {
  return <JoinPage onPageChange={onPageChange} />;
}
