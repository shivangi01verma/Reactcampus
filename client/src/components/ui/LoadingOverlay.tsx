import { Spinner } from './Spinner';

export function LoadingOverlay() {
  return (
    <div className="flex items-center justify-center py-12">
      <Spinner size="lg" />
    </div>
  );
}
