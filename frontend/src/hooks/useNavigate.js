import { useNavigate as useRouterNavigate } from 'react-router-dom';
import { useTransition } from '../context/TransitionContext';

export const useNavigateWithTransition = () => {
  const routerNavigate = useRouterNavigate();
  const { triggerTransition } = useTransition();

  const navigate = (url, duration = 2500) => {
    triggerTransition(() => {
      // Navigate to URL
      if (url.startsWith('http') || url.startsWith('//')) {
        // External URL
        window.location.href = url;
      } else if (url.startsWith('#')) {
        // Hash/anchor link
        const element = document.querySelector(url);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else if (url.includes('?') || url.startsWith('/')) {
        // React Router navigation (routes with query params or absolute paths)
        routerNavigate(url);
      } else {
        // Fallback to window navigation
        window.location.href = url;
      }
    }, duration);
  };

  return navigate;
};
