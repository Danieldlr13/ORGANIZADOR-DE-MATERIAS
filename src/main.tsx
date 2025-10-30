import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Header } from './components/Header.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { MainContent } from './components/MainContent.tsx';
import { Login } from './components/Login.tsx';
import { NavigationProvider } from './context/NavigationContext.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';

// Componente para el sidebar que usa auth
function SidebarContent() {
  const { user, loading } = useAuth();
  
  if (loading || !user) {
    return null; // No mostrar sidebar si está cargando o no hay usuario
  }
  
  return <Sidebar />;
}

// Componente para el contenido principal que usa auth
function MainAppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <>
      <Header />
      <MainContent />
    </>
  );
}

// Renderizar el sidebar en su contenedor
const sidebarRoot = createRoot(document.getElementById('sidebar')!);
sidebarRoot.render(
  <StrictMode>
    <AuthProvider>
      <NavigationProvider>
        <SidebarContent />
      </NavigationProvider>
    </AuthProvider>
  </StrictMode>
);

// Renderizar el contenido principal en root
const mainRoot = createRoot(document.getElementById('root')!);
mainRoot.render(
  <StrictMode>
    <AuthProvider>
      <NavigationProvider>
        <MainAppContent />
      </NavigationProvider>
    </AuthProvider>
  </StrictMode>
);

