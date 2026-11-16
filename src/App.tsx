import './App.css'
import { Routes, Route } from 'react-router-dom'
import TasksPage from './pages/TasksPage'
import TaskDetailPage from './pages/TaskDetailPage'
import CreateTaskPage from './pages/CreateTaskPage'
import EditTaskPage from './pages/EditTaskPage'
import AppLayout from './components/layout/AppLayout'
import DashboardPage from './pages/DashboardPage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'

function App() {

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path='/' element={<DashboardPage />}/>
        <Route path='/tasks'>
          <Route index element={<TasksPage />}/>
          <Route path=':id' element={<TaskDetailPage />}/>
          <Route path='new' element={<CreateTaskPage />}/>
          <Route path=':id/edit' element={<EditTaskPage />}/>
        </Route>
        <Route path="/projects">
          <Route index element={<ProjectsPage />} />
          <Route path=":id" element={<ProjectDetailPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
