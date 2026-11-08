import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

function AppLayout() {
  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <Sidebar />
      </aside>
      <div className="app-content">
        <Header />
        <main className="app-main"> 
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout