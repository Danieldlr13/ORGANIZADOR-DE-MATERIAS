import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export function Sidebar() {
  const { activeView, setActiveView, isOpen, setIsOpen } = useNavigation();
  const { user, signOut } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    if (confirm('¿Cerrar sesión?')) {
      try {
        await signOut();
      } catch (err) {
        console.error('Error al cerrar sesión:', err);
      }
    }
  };

  const handleNavigate = (view: 'materias' | 'calendario') => {
    setActiveView(view);
    setIsOpen(false); // Cerrar el sidebar después de seleccionar
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      {/* Botón hamburger para navegación */}
      <button 
        className="hamburger-btn" 
        onClick={() => {
          setIsOpen(!isOpen);
          setUserMenuOpen(false); // Cerrar el menú de usuario si está abierto
        }}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Menú de navegación */}
      {isOpen && (
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeView === 'materias' ? 'active' : ''}`}
            onClick={() => handleNavigate('materias')}
          >
            <span className="nav-icon">📚</span>
            <span className="nav-text">Materias</span>
          </button>
          <button
            className={`nav-item ${activeView === 'calendario' ? 'active' : ''}`}
            onClick={() => handleNavigate('calendario')}
          >
            <span className="nav-icon">📅</span>
            <span className="nav-text">Calendario</span>
          </button>
        </nav>
      )}

      {/* Botón de usuario - Solo móvil */}
      {user && (
        <>
          <button 
            className="user-menu-btn" 
            onClick={() => {
              setUserMenuOpen(!userMenuOpen);
              setIsOpen(false); // Cerrar el menú de navegación si está abierto
            }}
            aria-label="Toggle user menu"
          >
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName || 'Usuario'} 
                className="user-avatar-small"
              />
            ) : (
              <div className="user-avatar-placeholder-small">
                {(user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase()}
              </div>
            )}
          </button>

          {/* Menú desplegable de usuario (móvil) o Info de usuario (escritorio) */}
          <div className={`sidebar-user ${userMenuOpen ? 'show-mobile' : ''}`}>
            <div className="user-info">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'Usuario'} 
                  className="user-avatar"
                />
              ) : (
                <div className="user-avatar-placeholder">
                  {(user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                </div>
              )}
              <div className="user-details">
                <div className="user-name">{user.displayName || user.email?.split('@')[0] || 'Usuario'}</div>
                <div className="user-email">{user.email}</div>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout} title="Cerrar sesión">
              🚪 Salir
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
