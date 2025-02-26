import { NavLink } from 'react-router-dom';
import './Sidebar.scss';

const Sidebar = () => {
  const navigationItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/transactions', label: 'Transactions' },
    { path: '/budget', label: 'Budget' },
    { path: '/goals', label: 'Goals' }
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-content">
        <div className="logo">
          <span>Puffin</span>
        </div>
        
        <ul className="nav-links">
          {navigationItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;