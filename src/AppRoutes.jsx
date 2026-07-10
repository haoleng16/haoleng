import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import App from './App.jsx'

const Home = lazy(() => import('./pages/Home.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const Blog = lazy(() => import('./pages/Blog.jsx'))
const Bookshelf = lazy(() => import('./pages/Bookshelf.jsx'))
const Admin = lazy(() => import('./pages/Admin.jsx'))
const Agent = lazy(() => import('./pages/Agent.jsx'))

export default function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="blog" element={<Blog />} />
          <Route path="bookshelf" element={<Bookshelf />} />
          <Route path="admin" element={<Admin />} />
          <Route path="agent" element={<Agent />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
