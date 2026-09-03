import { Routes, Route, NavLink } from 'react-router-dom';
import ToolPage from './pages/ToolPage';
import LesionTypesPage from './pages/LesionTypesPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <div className="shell">
      <nav className="nav">
        <NavLink to="/" className="wordmark">SkinScan</NavLink>
        <div className="nav-links">
          <NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>Verktyget</NavLink>
          <NavLink to="/hudforandringar" className={({isActive}) => isActive ? 'active' : ''}>Om hudförändringar</NavLink>
          <NavLink to="/om-verktyget" className={({isActive}) => isActive ? 'active' : ''}>Om verktyget</NavLink>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<ToolPage />} />
        <Route path="/hudforandringar" element={<LesionTypesPage />} />
        <Route path="/om-verktyget" element={<AboutPage />} />
      </Routes>
    </div>
  );
}

export default App;