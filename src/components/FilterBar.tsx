import React, { useState } from 'react';
import { Search, Filter, CheckSquare, X } from 'lucide-react';
import { CertificateCategory, CertificateFilter } from '../types';

interface FilterBarProps {
  onFilterChange: (filter: CertificateFilter) => void;
  showCategoryFilter?: boolean;
  showVerifiedFilter?: boolean;
  showDateFilter?: boolean;
  initialFilter?: CertificateFilter;
}

const FilterBar: React.FC<FilterBarProps> = ({
  onFilterChange,
  showCategoryFilter = true,
  showVerifiedFilter = false,
  showDateFilter = false,
  initialFilter = {},
}) => {
  const [filter, setFilter] = useState<CertificateFilter>(initialFilter);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categories: (CertificateCategory | 'All')[] = [
    'All',
    'Academic',
    'Co-curricular',
    'Cultural',
    'Social',
    'Sports',
    'Workshop',
    'Internship',
    'Other',
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilter = { ...filter, searchTerm: e.target.value };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleCategoryChange = (category: CertificateCategory | 'All') => {
    const newFilter = { ...filter, category: category === 'All' ? undefined : category };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleVerifiedChange = (verified: boolean | undefined) => {
    const newFilter = { ...filter, verified };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const newFilter = { ...filter, [field]: value };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const clearFilters = () => {
    const newFilter: CertificateFilter = { searchTerm: filter.searchTerm };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const hasActiveFilters = 
    filter.category !== undefined || 
    filter.verified !== undefined || 
    filter.startDate !== undefined || 
    filter.endDate !== undefined;

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4">
        {/* Search bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search certificates..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={filter.searchTerm || ''}
            onChange={handleSearchChange}
          />
        </div>

        {/* Filter toggle */}
        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <Filter size={16} className="mr-1" />
            {filtersOpen ? 'Hide Filters' : 'Show Filters'}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center text-sm text-red-500 hover:text-red-700"
            >
              <X size={16} className="mr-1" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Filters */}
        {filtersOpen && (
          <div className="mt-4 space-y-4">
            {/* Category filter */}
            {showCategoryFilter && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Category</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`px-3 py-1 text-sm rounded-full ${
                        (category === 'All' && filter.category === undefined) || 
                        filter.category === category
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Verification status filter */}
            {showVerifiedFilter && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVerifiedChange(undefined)}
                    className={`px-3 py-1 text-sm rounded-full ${
                      filter.verified === undefined
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => handleVerifiedChange(true)}
                    className={`px-3 py-1 text-sm rounded-full ${
                      filter.verified === true
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <CheckSquare size={14} className="inline mr-1" />
                    Verified
                  </button>
                  <button
                    onClick={() => handleVerifiedChange(false)}
                    className={`px-3 py-1 text-sm rounded-full ${
                      filter.verified === false
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Pending
                  </button>
                </div>
              </div>
            )}

            {/* Date filter */}
            {showDateFilter && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Issue Date</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">From</label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm"
                      value={filter.startDate || ''}
                      onChange={(e) => handleDateChange('startDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">To</label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm"
                      value={filter.endDate || ''}
                      onChange={(e) => handleDateChange('endDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;