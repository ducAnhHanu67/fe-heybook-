import Header from '@/layout/Client/Header'
import { Route, Routes } from 'react-router-dom'
import ProductList from './ProductList/ProductList'
import ProductDetail from './ProductList/ProductDetail/ProductDetail'
import Profile from '../Profile/Profile'

function Client() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/profile/*" element={<Profile />} />
      </Routes>
    </>
  )
}

export default Client
