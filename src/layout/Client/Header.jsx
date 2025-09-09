import { Search, Bell, User, ChevronDown, Menu, LogOut, Settings, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import CartIcon from '@/components/CartIcon'
import { getCategoriesForProductAPI, getBookGenresForProductAPI } from '@/apis'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUserAPI, selectCurrentUser } from '@/redux/userSlice'
import { setSearchQuery, selectSearchQuery } from '@/redux/searchSlice'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import logo from "../../assets/logo_logo techzhome.jpg";

export default function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const currentUser = useSelector(selectCurrentUser)
  const searchQuery = useSelector(selectSearchQuery) || ''
  const [inputValue, setInputValue] = useState('')
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  // const [selectedMainCategory, setSelectedMainCategory] = useState("Sách");
  const categoryMenuRef = useRef(null);
  const [categories, setCategories] = useState([])
  const [bookGenres, setBookGenres] = useState([])

  // const categoryData = useMemo(() => ({
  //   "Sách": bookGenres.map(genre => genre.name),
  //   "Văn phòng phẩm": categories.map(cat => cat.name)

  // }), [categories, bookGenres])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, bookGenresData] = await Promise.all([
          getCategoriesForProductAPI(),
          getBookGenresForProductAPI()
        ])
        setCategories(categoriesData)
        setBookGenres(bookGenresData)

      } catch {
        // Handle error silently for now
        setCategories([])
        setBookGenres([])
      }
    }
    fetchData()
  }, [])
  useEffect(() => {
    const searchFromUrl = searchParams.get('search') || ''

    if (searchFromUrl !== searchQuery) {
      dispatch(setSearchQuery(searchFromUrl))
    }

    setInputValue(searchFromUrl || searchQuery)
  }, [searchParams, dispatch, searchQuery])

  useEffect(() => {
    const handleClickOutside = (event) => {

      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target)) {
        setShowCategoryMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleSearch = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      const searchTerm = inputValue.trim()
      dispatch(setSearchQuery(searchTerm))
      navigate(`/product-list?search=${encodeURIComponent(searchTerm)}`)
    }
  }
  const handleSearchInputChange = (e) => {
    const value = e.target.value
    setInputValue(value)
  }

  const handleLogout = async () => {
    try {
      await dispatch(logoutUserAPI()).unwrap()
      navigate('/login')
    } catch {
      // Error handling
    }
  }

  const handleAdminAccess = () => {
    navigate('/dashboard')
  }

  const handleProfile = () => {
    navigate('/profile')
  }

  const handleLogin = () => {
    navigate('/login')
  }

  const handleRegister = () => {
    navigate('/register')
  }
  const handleCategoryClick = (mainCategory, subCategory) => {
    const type = mainCategory === 'Sách' ? 'BOOK' : 'STATIONERY'

    // setSearchQuery nếu bạn vẫn muốn lưu từ khóa tìm kiếm vào Redux
    dispatch(setSearchQuery(subCategory))

    navigate(
      `/product-list?type=${type}&bookGenreId=${encodeURIComponent(subCategory)}&page=1&itemsPerPage=12`
    )
  }


  return (
    <header className="border-b border-gray-200 bg-black shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between  gap-5 px-3 ">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2">
                <img
                  src={logo}
                  alt="TechZHome Logo"
                  className="h-14 w-auto object-contain"
                />
              </Link>
            </Link>
          </div>
          <div className="mx-4 max-w-2xl w-[580px] ">
            <form onSubmit={handleSearch} className="relative flex">
              <Input
                type="text"
                placeholder="Tìm kiếm sách, văn phòng phẩm..."
                value={inputValue}
                onChange={handleSearchInputChange}
                className="flex-1 border border-gray-300 bg-white text-black pr-12 focus:border-yellow-400 focus:ring-yellow-400"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute top-0 right-0 h-full rounded-l-none bg-[#ffc82c] px-4 text-black hover:bg-yellow-400"
              >
                <Search className="h-4 w-4 text-black" />
              </Button>
            </form>
          </div>
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="h-6 w-6 text-[#ffc82c]"
            >
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.72 11.72 0 003.68.59 1 1 0 011 1v3.61a1 1 0 01-1 1A17 17 0 013 5a1 1 0 011-1h3.61a1 1 0 011 1c0 1.25.2 2.47.59 3.68a1 1 0 01-.24 1.01l-2.34 2.1z" />
            </svg>
            <div className="flex flex-col leading-tight">
              <span className="text-sm text-white">Hotline tư vấn:</span>
              <span className="text-lg font-bold text-[#ffc82c]">0936020386</span>
            </div>
          </div>
          <div className="flex items-center">
            <Link
              to="/cart"
              className="flex items-center border border-yellow-400 px-3 py-1 rounded-md space-x-2"
            >
              <ShoppingCart className="h-5 w-5 text-[#ffc82c]" />
              <span className="text-white text-sm font-medium">giỏ hàng</span>
              <span className="bg-[#ffc82c] text-black text-sm font-bold px-2 py-0.5 rounded">
                0
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}