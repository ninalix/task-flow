import './App.css'
import { Routes, Route } from 'react-router-dom'
import TasksPage from './pages/TasksPage'
import TaskDetailPage from './pages/TaskDetailPage'
import CreateTaskPage from './pages/CreateTaskPage'
import EditTaskPage from './pages/EditTaskPage'

function App() {

  return (
    <>
      <Routes>
        <Route path='/tasks'>
          <Route index element={<TasksPage />}/>
          <Route path=':id' element={<TaskDetailPage />}/>
        </Route>

        <Route path='/tasks/new' element={<CreateTaskPage />}/>
        <Route path='/task/:id/edit' element={<EditTaskPage />}/>
      </Routes>
    </>
  )
}

export default App
