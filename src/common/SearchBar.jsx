import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { CoursesApi } from '../api/CoursesApi';
import defaultImage from '../assets/default.jpg';


// Custom hook để xử lý debounce
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Áp dụng debounce với delay 500ms
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Xử lý click outside để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Effect để gọi API khi debouncedSearchTerm thay đổi
  useEffect(() => {
    const searchData = async () => {
      if (!debouncedSearchTerm.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const data = { name: debouncedSearchTerm }; // Send search term to API
        const response = await CoursesApi.getCourse(data);
        if (response && response.data) {
          setResults(response.data);
        } else {
          setResults([]);
        }
        setIsOpen(true);
      } catch (error) {
        console.error('Error searching:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    searchData();
  }, [debouncedSearchTerm]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (!value.trim()) {
      setResults([]);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="Nhập từ khóa tìm kiếm..."
          className="w-full py-2 pl-10 pr-4 border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (searchTerm || loading) && (
        <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-50">
          <div className="max-h-[300px] overflow-y-auto">
            {results.length > 0 ? (
              <div>
                {results.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                    onClick={() => {
                      // Xử lý khi click vào kết quả
                      setIsOpen(false);
                    }}
                  >
                    <a className="_searchItem_15ttk_106" href={`/courses/${item.id}`}>
                      <div className="flex items-center" style={{ '--font-size': '3.6px' }}>
                        <img 
                          src={item.image_url || defaultImage} 
                          alt={item.course_name} 
                          style={{ 
                            'border-radius': "100%",
                            "width": "40px", 
                            "height": "40px", 
                          }} 
                        />
                        <span className='ml-5 font-bold'>{item.course_name}</span>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                {loading ? 'Đang tìm kiếm...' : 'Không tìm thấy kết quả'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
