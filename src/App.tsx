import './App.css'
import { Routes, Route } from 'react-router-dom'
import TasksPage from './pages/TasksPage'
import TaskDetailPage from './pages/TaskDetailPage'
import CreateTaskPage from './pages/CreateTaskPage'
import EditTaskPage from './pages/EditTaskPage'
import AppLayout from './components/layout/AppLayout'
import DashboardPage from './pages/DashboardPage'

function App() {

  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path='/' element={<DashboardPage />}/>
          <Route path='/tasks'>
            <Route index element={<TasksPage />}/>
            <Route path=':id' element={<TaskDetailPage />}/>
            <Route path='new' element={<CreateTaskPage />}/>
            <Route path=':id/edit' element={<EditTaskPage />}/>
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
