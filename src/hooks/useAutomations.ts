import { useState, useEffect } from 'react';
import { type AutomationAction } from '@/types';
import { fetchAutomations } from '@/api';

export const useAutomations = () => {
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadAutomations = async () => {
      try {
        setLoading(true);
        const data = await fetchAutomations();
        if (isMounted) {
          setAutomations(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch automations');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadAutomations();

    return () => {
      isMounted = false;
    };
  }, []);

  return { automations, loading, error };
};
