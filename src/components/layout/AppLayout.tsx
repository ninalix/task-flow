import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function AppLayout() {
  return (
    <div className="app-layout">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <aside className="app-sidebar">
        <Sidebar />
      </aside>
      <div className="app-content">
        {/* <Header /> */}
        <main className="app-main" id="main-content" tabIndex={-1}> 
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout