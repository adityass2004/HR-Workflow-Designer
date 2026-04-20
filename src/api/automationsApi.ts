import { type AutomationAction } from '@/types';
import { MOCK_AUTOMATIONS } from './mockData';

export async function fetchAutomations(): Promise<AutomationAction[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_AUTOMATIONS);
    }, 400);
  });
}
