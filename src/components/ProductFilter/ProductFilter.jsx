import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Filter, X, Book, Package, Tag, Globe, DollarSign } from 'lucide-react'
import { getCategoriesForProductAPI, getBookGenresForProductAPI } from '@/apis'

export default function ProductFilter({ filters, onFiltersChange, onClearFilters }) {
  const [categories, setCategories] = useState([])
  const [bookGenres, setBookGenres] = useState([])
  const [localFilters, setLocalFilters] = useState({
    type: 'all',
    categoryId: 'all',
    bookGenreId: 'all',
    language: '',
    minPrice: '',
    maxPrice: '',
    ...filters
  })

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
    setLocalFilters((prev) => ({ ...prev, ...filters }))

    // Check if current price range matches any predefined ranges
    const predefinedRanges = [
      { minPrice: '', maxPrice: '' },
      { minPrice: '', maxPrice: '100000' },
      { minPrice: '100000', maxPrice: '300000' },
      { minPrice: '300000', maxPrice: '500000' },
      { minPrice: '500000', maxPrice: '1000000' },
      { minPrice: '1000000', maxPrice: '' }
    ]

    const isCustomPrice = !predefinedRanges.some(
      (range) => range.minPrice === (filters.minPrice || '') && range.maxPrice === (filters.maxPrice || '')
    )

    setCustomPriceMode(isCustomPrice && (filters.minPrice || filters.maxPrice))
  }, [filters])

  const [customPriceMode, setCustomPriceMode] = useState(false)

  const handleInputChange = (key, value) => {
    const newFilters = {
      ...localFilters,
      [key]: value
    }
    setLocalFilters(newFilters)

    // Auto-apply filters immediately for radio buttons and selects
    if (['type', 'categoryId', 'bookGenreId', 'language'].includes(key)) {
      applyFilters(newFilters)
    }
  }

  const handleCustomPriceChange = (key, value) => {
    const newFilters = {
      ...localFilters,
      [key]: value
    }
    setLocalFilters(newFilters)

    // Debounce custom price changes - apply after user stops typing
    clearTimeout(window.customPriceTimeout)
    window.customPriceTimeout = setTimeout(() => {
      applyFilters(newFilters)
    }, 500)
  }

  const applyFilters = (filtersToApply) => {
    // Lọc bỏ các giá trị empty và thay "all" thành ""
    const cleanFilters = Object.entries(filtersToApply).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined && value !== 'all') {
        acc[key] = value
      }
      return acc
    }, {})

    onFiltersChange(cleanFilters)
  }

  const handleClearAll = () => {
    const emptyFilters = {
      type: 'all',
      categoryId: 'all',
      bookGenreId: 'all',
      language: '',
      minPrice: '',
      maxPrice: ''
    }
    setLocalFilters(emptyFilters)
    setCustomPriceMode(false)
    // Clear custom price timeout
    clearTimeout(window.customPriceTimeout)
    // Apply empty filters immediately
    onClearFilters()
  }

  const isBookType = localFilters.type === 'BOOK'
  const isStationeryType = localFilters.type === 'STATIONERY'

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Filter className="h-4 w-4" />
          Bộ lọc sản phẩm
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Filters - Single Column for Sidebar */}
        <div className="space-y-5">
          {/* Type Filter */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Package className="h-4 w-4" />
              Loại sản phẩm
            </Label>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'Tất cả' },
                { value: 'BOOK', label: 'Sách' },
                { value: 'STATIONERY', label: 'Văn phòng phẩm' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`type-${option.value}`}
                    name="type"
                    value={option.value}
                    checked={localFilters.type === option.value}
                    onChange={(e) => {
                      const value = e.target.value
                      let newFilters = {
                        ...localFilters,
                        type: value
                      }

                      // Reset specific filters when type changes
                      if (value !== 'BOOK') {
                        newFilters.bookGenreId = 'all'
                        newFilters.language = ''
                      }
                      if (value !== 'STATIONERY') {
                        newFilters.categoryId = 'all'
                      }

                      setLocalFilters(newFilters)
                      applyFilters(newFilters)
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor={`type-${option.value}`} className="cursor-pointer text-sm text-gray-700">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Category Filter - Only for STATIONERY */}
          {isStationeryType && (
            <>
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Tag className="h-4 w-4" />
                  Danh mục văn phòng phẩm
                </Label>
                <div className="max-h-48 space-y-2 overflow-y-auto">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="category-all"
                      name="category"
                      value="all"
                      checked={localFilters.categoryId === 'all'}
                      onChange={(e) => handleInputChange('categoryId', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="category-all" className="cursor-pointer text-sm text-gray-700">
                      Tất cả
                    </Label>
                  </div>
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`category-${category.id}`}
                        name="category"
                        value={category.id.toString()}
                        checked={localFilters.categoryId === category.id.toString()}
                        onChange={(e) => handleInputChange('categoryId', e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <Label
                        htmlFor={`category-${category.id}`}
                        className="cursor-pointer text-sm text-gray-700"
                      >
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Book Genre Filter - Only for BOOK */}
          {isBookType && (
            <>
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Book className="h-4 w-4" />
                  Thể loại sách
                </Label>
                <div className="max-h-48 space-y-2 overflow-y-auto">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="genre-all"
                      name="genre"
                      value="all"
                      checked={localFilters.bookGenreId === 'all'}
                      onChange={(e) => handleInputChange('bookGenreId', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="genre-all" className="cursor-pointer text-sm text-gray-700">
                      Tất cả
                    </Label>
                  </div>
                  {bookGenres.map((genre) => (
                    <div key={genre.id} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`genre-${genre.id}`}
                        name="genre"
                        value={genre.id.toString()}
                        checked={localFilters.bookGenreId === genre.id.toString()}
                        onChange={(e) => handleInputChange('bookGenreId', e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <Label htmlFor={`genre-${genre.id}`} className="cursor-pointer text-sm text-gray-700">
                        {genre.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Language Filter - Only for BOOK */}
          {isBookType && (
            <>
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Globe className="h-4 w-4" />
                  Ngôn ngữ
                </Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="language-all"
                      name="language"
                      value=""
                      checked={localFilters.language === ''}
                      onChange={(e) => handleInputChange('language', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="language-all" className="cursor-pointer text-sm text-gray-700">
                      Tất cả
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="language-vi"
                      name="language"
                      value="Tiếng Việt"
                      checked={localFilters.language === 'Tiếng Việt'}
                      onChange={(e) => handleInputChange('language', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="language-vi" className="cursor-pointer text-sm text-gray-700">
                      Tiếng Việt
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="language-en"
                      name="language"
                      value="Tiếng Anh"
                      checked={localFilters.language === 'Tiếng Anh'}
                      onChange={(e) => handleInputChange('language', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="language-en" className="cursor-pointer text-sm text-gray-700">
                      Tiếng Anh
                    </Label>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <DollarSign className="h-4 w-4" />
            Khoảng giá
          </Label>
          <div className="space-y-2">
            {[
              { label: 'Tất cả', minPrice: '', maxPrice: '' },
              { label: 'Dưới 100.000đ', minPrice: '', maxPrice: '100000' },
              { label: '100.000đ - 300.000đ', minPrice: '100000', maxPrice: '300000' },
              { label: '300.000đ - 500.000đ', minPrice: '300000', maxPrice: '500000' },
              { label: '500.000đ - 1.000.000đ', minPrice: '500000', maxPrice: '1000000' },
              { label: 'Trên 1.000.000đ', minPrice: '1000000', maxPrice: '' }
            ].map((range, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`price-${index}`}
                  name="priceRange"
                  checked={
                    !customPriceMode &&
                    localFilters.minPrice === range.minPrice &&
                    localFilters.maxPrice === range.maxPrice
                  }
                  onChange={() => {
                    setCustomPriceMode(false)
                    const newFilters = {
                      ...localFilters,
                      minPrice: range.minPrice,
                      maxPrice: range.maxPrice
                    }
                    setLocalFilters(newFilters)
                    applyFilters(newFilters)
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor={`price-${index}`} className="cursor-pointer text-sm text-gray-700">
                  {range.label}
                </Label>
              </div>
            ))}

            {/* Custom Price Option */}
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="price-custom"
                name="priceRange"
                checked={customPriceMode}
                onChange={() => {
                  setCustomPriceMode(true)
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="price-custom" className="cursor-pointer text-sm text-gray-700">
                Khoảng giá khác
              </Label>
            </div>

            {/* Custom Price Inputs */}
            {customPriceMode && (
              <div className="ml-6 space-y-3 border-l-2 border-gray-200 pl-4">
                <div className="space-y-2">
                  <Label htmlFor="customMinPrice" className="text-xs text-gray-600">
                    Giá từ (VND)
                  </Label>
                  <Input
                    id="customMinPrice"
                    type="number"
                    placeholder="0"
                    value={localFilters.minPrice}
                    onChange={(e) => handleCustomPriceChange('minPrice', e.target.value)}
                    min="0"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customMaxPrice" className="text-xs text-gray-600">
                    Giá đến (VND)
                  </Label>
                  <Input
                    id="customMaxPrice"
                    type="number"
                    placeholder="Không giới hạn"
                    value={localFilters.maxPrice}
                    onChange={(e) => handleCustomPriceChange('maxPrice', e.target.value)}
                    min="0"
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2">
          <Button variant="outline" onClick={handleClearAll} className="h-9 w-full" size="sm">
            <X className="mr-2 h-4 w-4" />
            Xóa tất cả bộ lọc
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
