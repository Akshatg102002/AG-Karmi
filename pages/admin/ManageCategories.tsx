
import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { Category } from '../../types';
import CategoryForm from '../../components/admin/CategoryForm';

const ManageCategories: React.FC = () => {
    const { categories, addCategory, updateCategory, deleteCategory } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const openModal = (category: Category | null = null) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingCategory(null);
        setIsModalOpen(false);
    };

    const handleSave = (categoryData: Omit<Category, 'id'> | Category) => {
        if (editingCategory) {
            updateCategory(categoryData as Category);
        } else {
            addCategory(categoryData as Omit<Category, 'id'>);
        }
        closeModal();
    };

    const handleDelete = (category: Category) => {
        if (window.confirm(`Are you sure you want to delete the category "${category.name}"? This action cannot be undone.`)) {
            deleteCategory(category.id);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-brand-dark">Manage Categories</h1>
                <button onClick={() => openModal()} className="bg-brand-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-brand-dark">
                    Add New Category
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categories.map(category => (
                            <tr key={category.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {category.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                    <button onClick={() => openModal(category)} className="text-brand-primary hover:text-brand-dark">Edit</button>
                                    <button onClick={() => handleDelete(category)} className="text-red-600 hover:text-red-800">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                        <CategoryForm 
                            category={editingCategory} 
                            onSave={handleSave} 
                            onCancel={closeModal} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCategories;
