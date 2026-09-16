import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Image as ImageIcon,
  UtensilsCrossed
} from 'lucide-react';
import { FoodItem, Category } from '../../../types/menu';
import { FoodItemFormModal } from './FoodItemFormModal';
import { DeleteFoodItemDialog } from './DeleteFoodItemDialog';

interface FoodItemManagementProps {
  foodItems: FoodItem[];
  categories: Category[];
  onCreateFoodItem: (data: Omit<FoodItem, 'id' | 'finalPrice'>) => Promise<void>;
  onUpdateFoodItem: (id: string, data: Partial<FoodItem>) => Promise<void>;
  onDeleteFoodItem: (id: string) => Promise<void>;
  initialCategoryFilter?: string;
  isAddModalOpen?: boolean;
  onCloseAddModal?: () => void;
}

const ITEMS_PER_PAGE = 8;

export function FoodItemManagement({
  foodItems,
  categories,
  onCreateFoodItem,
  onUpdateFoodItem,
  onDeleteFoodItem,
  initialCategoryFilter = 'all',
  isAddModalOpen = false,
  onCloseAddModal,
}: FoodItemManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(initialCategoryFilter);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(isAddModalOpen);
  const [formModalMode, setFormModalMode] = useState<'create' | 'edit'>('create');
  const [selectedItemForEdit, setSelectedItemForEdit] = useState<FoodItem | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItemForDelete, setSelectedItemForDelete] = useState<FoodItem | null>(null);

  // Sync external add modal trigger
  React.useEffect(() => {
    if (isAddModalOpen) {
      setFormModalMode('create');
      setSelectedItemForEdit(null);
      setIsFormModalOpen(true);
    }
  }, [isAddModalOpen]);

  // Sync category filter if passed
  React.useEffect(() => {
    if (initialCategoryFilter && initialCategoryFilter !== 'all') {
      setSelectedCategoryId(initialCategoryFilter);
    }
  }, [initialCategoryFilter]);

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedItemForEdit(null);
    if (onCloseAddModal) onCloseAddModal();
  };

  // Filter items
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const safeFoodItems = Array.isArray(foodItems) ? foodItems : [];

    return safeFoodItems.filter(item => {
      // Category filter
      if (selectedCategoryId !== 'all' && item.categoryId !== selectedCategoryId) {
        return false;
      }

      // Status filter
      if (selectedStatus === 'active' && !item.isAvailable) {
        return false;
      }
      if (selectedStatus === 'inactive' && item.isAvailable) {
        return false;
      }

      // Search query filter
      if (q) {
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesCategory = (item.categoryName || '').toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        if (!matchesName && !matchesCategory && !matchesDesc) {
          return false;
        }
      }

      return true;
    });
  }, [foodItems, searchQuery, selectedCategoryId, selectedStatus]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, filteredItems.length);

  const handleOpenCreate = () => {
    setFormModalMode('create');
    setSelectedItemForEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (item: FoodItem) => {
    setFormModalMode('edit');
    setSelectedItemForEdit(item);
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (item: FoodItem) => {
    setSelectedItemForDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data: Omit<FoodItem, 'id' | 'finalPrice'>) => {
    if (formModalMode === 'create') {
      await onCreateFoodItem(data);
    } else if (selectedItemForEdit) {
      await onUpdateFoodItem(selectedItemForEdit.id, data);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header Row (Matches Reference Screen 5) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Food Items
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage your menu items
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-56">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search food items..."
              className="w-full pl-9.5 pr-4 py-2 bg-white rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F5B800] focus:ring-2 focus:ring-[#F5B800]/20 shadow-2xs transition-all"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategoryId}
            onChange={(e) => {
              setSelectedCategoryId(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#F5B800] shadow-2xs cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value as 'all' | 'active' | 'inactive');
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#F5B800] shadow-2xs cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Yellow + Add Food Item Button */}
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5B800] hover:bg-[#E5A93C] text-black font-bold text-xs sm:text-sm shadow-md shadow-[#F5B800]/20 transition-all shrink-0 cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Add Food Item</span>
          </button>

        </div>
      </div>

      {/* Main Table Card (Matches Reference Screen 5) */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        
        {/* Desktop Data Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Image</th>
                <th className="py-3.5 px-4">Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Offer</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <UtensilsCrossed className="w-8 h-8 mx-auto mb-2 opacity-40 text-gray-400" />
                    <p className="font-semibold text-gray-700">No food items found</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Try adjusting your search query or filters
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => {
                  const hasDiscount = (item.discountPercentage || 0) > 0;
                  return (
                    <tr 
                      key={item.id} 
                      className="hover:bg-amber-50/30 transition-colors"
                    >
                      {/* Image Thumbnail */}
                      <td className="py-3 px-4 w-16">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </td>

                      {/* Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 leading-tight">
                            {item.name}
                          </span>
                          {item.dietary === 'veg' && (
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" title="Pure Veg" />
                          )}
                          {item.dietary === 'non-veg' && (
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" title="Non-Veg" />
                          )}
                        </div>
                        <span className="text-[11px] text-gray-400 line-clamp-1 max-w-xs mt-0.5">
                          {item.description}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-gray-600 font-medium">
                        {item.categoryName}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-bold text-gray-900">
                        ₹{item.finalPrice || item.price}
                      </td>

                      {/* Offer */}
                      <td className="py-3 px-4">
                        {hasDiscount ? (
                          <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                            {item.discountPercentage}% OFF
                          </span>
                        ) : (
                          <span className="text-gray-400 font-medium">-</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {item.isAvailable ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 flex items-center justify-center transition-colors border border-gray-200 cursor-pointer"
                            title="Edit Food Item"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(item)}
                            className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors border border-red-200 cursor-pointer"
                            title="Delete Food Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Responsive Dish Cards */}
        <div className="md:hidden divide-y divide-gray-100 p-3 space-y-3">
          {paginatedItems.length === 0 ? (
            <div className="py-8 text-center text-gray-400">
              <p className="font-semibold text-gray-700">No food items found</p>
            </div>
          ) : (
            paginatedItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-xl p-3 border border-gray-100 shadow-2xs space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-5 h-5 m-auto text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm leading-tight">{item.name}</h3>
                      <span className="text-[11px] text-gray-500 block mt-0.5">{item.categoryName}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-gray-900 text-sm">₹{item.finalPrice || item.price}</span>
                        {(item.discountPercentage || 0) > 0 && (
                          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.2 rounded border border-red-100">
                            {item.discountPercentage}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenDelete(item)}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-gray-500">Status:</span>
                  {item.isAvailable ? (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-600">
                      Inactive
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Pagination Bar (Matches Reference Screen 5) */}
        {filteredItems.length > 0 && (
          <div className="px-4 py-3.5 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
            <div>
              Showing <strong className="text-gray-900">{startIndex}-{endIndex}</strong> of <strong className="text-gray-900">{filteredItems.length}</strong> items
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                // Show condensed pagination if many pages
                if (totalPages > 6 && Math.abs(pageNum - currentPage) > 2 && pageNum !== 1 && pageNum !== totalPages) {
                  if (pageNum === 2 || pageNum === totalPages - 1) {
                    return <span key={pageNum} className="px-1 text-gray-400">...</span>;
                  }
                  return null;
                }

                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#F5B800] text-black shadow-xs'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Form Modal (Create or Edit) */}
      <FoodItemFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSubmit={handleFormSubmit}
        initialData={selectedItemForEdit}
        categories={categories}
        mode={formModalMode}
      />

      {/* Delete Food Item Confirmation Dialog */}
      <DeleteFoodItemDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedItemForDelete(null);
        }}
        foodItem={selectedItemForDelete}
        onConfirmDelete={onDeleteFoodItem}
      />

    </div>
  );
}
