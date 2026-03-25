import React from 'react';
import { ElderlyHome } from './ElderlyHome';
import { CaregiverHome } from './CaregiverHome';
import { ProfessionalHome } from './ProfessionalHome';
import { Admin } from './Admin';

export function Home({ user }: { user: any }) {
  const role = user?.role;

  switch (role) {
    case 'admin':
      return <Admin user={user} />;
    case 'caregiver':
      return <CaregiverHome user={user} />;
    case 'professional':
      return <ProfessionalHome user={user} />;
    case 'elderly':
    default:
      return <ElderlyHome user={user} />;
  }
}
