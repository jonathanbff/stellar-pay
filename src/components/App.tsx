import { Navigate, Route, Routes, BrowserRouter } from 'react-router-dom';

import { routes } from '@/navigation/routes.tsx';

export function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <BrowserRouter>
        <Routes>
          {routes.map((route) => <Route key={route.path} {...route} />)}
          <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}