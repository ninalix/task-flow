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
          <Route path='new' element={<CreateTaskPage />}/>
          <Route path=':id/edit' element={<EditTaskPage />}/>
        </Route>
      </Routes>
    </>
  )
}

export default App
