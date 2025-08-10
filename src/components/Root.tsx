import { App } from '@/components/App.tsx';
import { ErrorBoundary } from '@/components/ErrorBoundary.tsx';

function ErrorBoundaryError({ error }: { error: unknown }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Erro na Aplicação</h1>
        <p className="text-gray-700 mb-4">Ocorreu um erro inesperado:</p>
        <blockquote className="bg-gray-100 p-4 rounded border-l-4 border-red-500">
          <code className="text-sm">
            {error instanceof Error
              ? error.message
              : typeof error === 'string'
              ? error
              : JSON.stringify(error)}
          </code>
        </blockquote>
      </div>
    </div>
  );
}

export function Root() {
  return (
    <ErrorBoundary fallback={ErrorBoundaryError}>
      <App/>
    </ErrorBoundary>
  );
}