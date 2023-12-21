import { Link, useLocation  } from "react-router-dom";

export const Sidebar = () => {
  const location = useLocation();
  return (
    <>
      <aside className="sidebar">
        <div className="sidebar_main">
          <ul>
            <li className="logo">
              <Link className="logo-text" to="/">
                Logo
              </Link>
            </li>
            <li className={location.pathname === '/home' ? 'selected' : ''}>
              <Link className="link" to="/home">
                Home
              </Link>
            </li>
            <li className={location.pathname === '/vista1' ? 'selected' : ''}>
              <Link className="link"to="/vista1">
                Vista 1
              </Link>
            </li>
            <li className={location.pathname === '/vista2' ? 'selected' : ''}>
              <Link className="link" to="/vista2">
                Vista 2
              </Link>
            </li>
          </ul>
        </div>
      </aside>
      
    </>
  );
};

export default Sidebar;
