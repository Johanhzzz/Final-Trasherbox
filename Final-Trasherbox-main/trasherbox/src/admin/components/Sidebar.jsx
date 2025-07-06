import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const { pathname } = useLocation();

  const navItem = (to, label) => (
    <li style={{ margin: '1rem 0' }}>
      <Link
        to={to}
        style={{
          color: pathname === to ? 'white' : '#ccc',
          textDecoration: 'none',
          fontWeight: pathname === to ? 'bold' : 'normal',
        }}
      >
        {label}
      </Link>
    </li>
  );

  return (
    <aside
      style={{
        width: '220px',
        background: '#1e1e2f',
        color: 'white',
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h2 style={{ fontSize: '1.2rem' }}>Admin</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {navItem('/admin', 'Dashboard')}
        {navItem('/admin/users', 'Usuarios')}
      </ul>
    </aside>
  );
};

export default Sidebar;
