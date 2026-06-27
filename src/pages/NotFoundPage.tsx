import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-16">
      <EmptyState
        icon={Compass}
        title="Page not found"
        description="The page you’re looking for doesn’t exist or may have moved."
        actionLabel="Go home"
        onAction={() => navigate('/')}
      />
    </div>
  );
}
