import { useSearchParams } from 'react-router-dom';

export function useDemoMode() {
  const [params] = useSearchParams();
  return params.get('demo') === 'true';
}
