import { useNavigation } from '../context/NavigationContext';
import { Materias } from './Materis';
import Calendario from './Calendario';

export function MainContent() {
  const { activeView } = useNavigation();

  return (
    <main className="main-content">
      {activeView === 'materias' && <Materias />}
      {activeView === 'calendario' && <Calendario />}
    </main>
  );
}
