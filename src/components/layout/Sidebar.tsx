import { NavLink } from "react-router-dom";
import logo from "../../assets/taskflow-logo.svg";

function Sidebar() {
  return (
    <>
      <div className="app-logo">
        <NavLink to="/" className="logo">
          <img src={logo} alt="" aria-hidden="true" />
          <span>TaskFlow</span>
        </NavLink>
      </div>
      <nav aria-label="Main navigation" className="sidebar-nav">
        <NavLink to="/" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
          Dashboard
        </NavLink>
        <NavLink to="/tasks" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
          Tasks
        </NavLink>
        <NavLink to="/projects" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
          Projects
        </NavLink>
      </nav>
    </>
    
  );
}

export default Sidebar