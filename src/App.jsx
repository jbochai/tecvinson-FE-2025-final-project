import { Routes, Route } from 'react-router-dom'
import Layout       from './components/Layout'
import HomePage     from './pages/HomePage'
import ShopPage     from './pages/ShopPage'
import ProductPage  from './pages/ProductPage'
import CartPage     from './pages/CartPage'
import BlogPage     from './pages/BlogPage'
import PostPage     from './pages/PostPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      {/* All pages share the same Layout (Navbar + Footer) */}
      <Route path="/" element={<Layout />}>
        <Route index                  element={<HomePage />} />
        <Route path="shop"            element={<ShopPage />} />
        <Route path="shop/:id"        element={<ProductPage />} />
        <Route path="cart"            element={<CartPage />} />
        <Route path="blog"            element={<BlogPage />} />
        <Route path="blog/:id"        element={<PostPage />} />
        {/* 404 catch-all — must be last */}
        <Route path="*"               element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
