import React from 'react';
import { ElderlyHome } from './elderly/ElderlyPage';
import { CaregiverHome } from './caregiver/CaregiverPage';
import { ProfessionalHome } from './professional/ProfessionalPage';
import { Admin } from './admin/AdminPage';

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
