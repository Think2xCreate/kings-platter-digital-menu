import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  GripVertical,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { Category, FoodItem } from '../../../types/menu';
import { CategoryFormModal } from './CategoryFormModal';
import { DeleteCategoryDialog } from './DeleteCategoryDialog';

interface CategoryManagementProps {
  categories: Category[];
  foodItems: FoodItem[];
  onCreateCategory: (data: Omit<Category, 'id' | 'itemCount'>) => Promise<void>;
  onUpdateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  onNavigateToFoodItemsWithCategory: (categoryId: string) => void;
  isAddModalOpen?: boolean;
  onCloseAddModal?: () => void;
}

export function CategoryManagement({
  categories,
  foodItems,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  onNavigateToFoodItemsWithCategory,
  isAddModalOpen = false,
  onCloseAddModal,
}: CategoryManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [formModalMode, setFormModalMode] = useState<'create' | 'edit'>('create');
  const [isFormModalOpen, setIsFormModalOpen] = useState(isAddModalOpen);
  const [selectedCategoryForEdit, setSelectedCategoryForEdit] = useState<Category | null>(null);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategoryForDelete, setSelectedCategoryForDelete] = useState<Category | null>(null);

  // Sync external open state if provided
  React.useEffect(() => {
    if (isAddModalOpen) {
      setFormModalMode('create');
      setSelectedCategoryForEdit(null);
      setIsFormModalOpen(true);
    }
  }, [isAddModalOpen]);

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedCategoryForEdit(null);
    if (onCloseAddModal) onCloseAddModal();
  };

  // Filter categories by search
  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(c => 
      c.name.toLowerCase().includes(q) || 
      (c.description && c.description.toLowerCase().includes(q))
    );
  }, [categories, searchQuery]);

  const handleOpenCreate = () => {
    setFormModalMode('create');
    setSelectedCategoryForEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setFormModalMode('edit');
    setSelectedCategoryForEdit(category);
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (category: Category) => {
    setSelectedCategoryForDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data: Omit<Category, 'id' | 'itemCount'>) => {
    if (formModalMode === 'create') {
      await onCreateCategory(data);
    } else if (selectedCategoryForEdit) {
      await onUpdateCategory(selectedCategoryForEdit.id, data);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header Row (Matches Reference Screen 4) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Menu Categories
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage your menu categories
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories..."
              className="w-full pl-9.5 pr-4 py-2 bg-white rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F5B800] focus:ring-2 focus:ring-[#F5B800]/20 shadow-2xs transition-all"
            />
          </div>

          {/* Yellow + Add Category button */}
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5B800] hover:bg-[#E5A93C] text-black font-bold text-xs sm:text-sm shadow-md shadow-[#F5B800]/20 transition-all shrink-0 cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Main Table Card (Matches Reference Screen 4) */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        
        {/* Desktop Data Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">Category Name</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Display Order</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <Layers className="w-8 h-8 mx-auto mb-2 opacity-40 text-gray-400" />
                    <p className="font-semibold text-gray-700">No categories found</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {searchQuery ? 'Try adjusting your search' : 'Create your first category above'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => {
                  return (
                    <tr 
                      key={category.id} 
                      className="hover:bg-amber-50/30 transition-colors group"
                    >
                      {/* Drag Grip / # */}
                      <td className="py-3 px-4 text-center text-gray-400">
                        <GripVertical className="w-4 h-4 mx-auto text-gray-300 group-hover:text-gray-500 cursor-grab" />
                      </td>

                      {/* Image Thumbnail & Category Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                            {category.imageUrl ? (
                              <img
                                src={category.imageUrl}
                                alt={category.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block leading-tight">
                              {category.name}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              {category.itemCount ?? 0} dishes
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="py-3 px-4 text-gray-500 max-w-xs truncate">
                        {category.description || '—'}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {category.isActive !== false ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                            Hidden
                          </span>
                        )}
                      </td>

                      {/* Display Order */}
                      <td className="py-3 px-4 text-center font-semibold text-gray-700">
                        {category.displayOrder}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(category)}
                            className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 flex items-center justify-center transition-colors border border-gray-200 cursor-pointer"
                            title="Edit Category"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(category)}
                            className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors border border-red-200 cursor-pointer"
                            title="Delete Category"
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

        {/* Mobile View: Responsive Category Cards */}
        <div className="md:hidden divide-y divide-gray-100 p-3 space-y-3">
          {filteredCategories.length === 0 ? (
            <div className="py-8 text-center text-gray-400">
              <p className="font-semibold text-gray-700">No categories found</p>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <div 
                key={category.id} 
                className="bg-white rounded-xl p-3 border border-gray-100 shadow-2xs space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                      {category.imageUrl ? (
                        <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-5 h-5 m-auto text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{category.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-gray-500">Order: #{category.displayOrder}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-[11px] text-gray-500">{category.itemCount ?? 0} items</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(category)}
                      className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenDelete(category)}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {category.description && (
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {category.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-gray-500">Status:</span>
                  {category.isActive !== false ? (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-600">
                      Hidden
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Form Modal (Create or Edit) */}
      <CategoryFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSubmit={handleFormSubmit}
        initialData={selectedCategoryForEdit}
        mode={formModalMode}
      />

      {/* Delete Category Safe Dialog */}
      <DeleteCategoryDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedCategoryForDelete(null);
        }}
        category={selectedCategoryForDelete}
        foodItems={foodItems}
        onConfirmDelete={onDeleteCategory}
        onNavigateToFoodItemsWithCategory={onNavigateToFoodItemsWithCategory}
      />

    </div>
  );
}
