import { initAnalytics } from './initAnalytics';
import { initDatabase } from './initDatabase';
import { initPermissions } from './initPermissions';
import { initSecurity } from './initSecurity';
import { initSync } from './initSync';

export type BootstrapResult = {
  ok: boolean;
  errors: string[];
};

export const bootstrap = async (): Promise<BootstrapResult> => {
  const errors: string[] = [];

  const steps = [
    { name: 'Security', fn: initSecurity },
    { name: 'Database', fn: initDatabase },
    { name: 'Permissions', fn: initPermissions },
    { name: 'Sync', fn: initSync },
    { name: 'Analytics', fn: initAnalytics },
  ];

  for (const step of steps) {
    try {
      await step.fn();
    } catch (err) {
      errors.push(`${step.name}: ${(err as Error)?.message || String(err)}`);
    }
  }

  return {
    ok: errors.length === 0,
    errors,
  };
};
