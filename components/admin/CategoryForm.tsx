
import React, { useState } from 'react';
import { Category } from '../../types';
import { useData } from '../../hooks/useData';

interface CategoryFormProps {
    category: Category | null;
    onSave: (categoryData: Omit<Category, 'id'> | Category) => void;
    onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSave, onCancel }) => {
    const { categories } = useData();
    const [formData, setFormData] = useState<Omit<Category, 'id'> | Category>(
        category || {
            name: '',
            description: '',
            image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=200&q=80',
            order: (categories.length + 1) * 10,
            isActive: true,
        }
    );
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "Category name is required.";
        if (!formData.description.trim()) newErrors.description = "Description is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({...prev, image: reader.result as string}));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSave(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-brand-dark">{category ? 'Edit Category' : 'Add New Category'}</h2>
            
            <div>
                <label className="block text-sm font-medium text-gray-700">Category Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Category Image</label>
                <div className="mt-2 flex items-center gap-4">
                    <img src={formData.image} alt="Category" className="w-20 h-20 rounded-md object-cover bg-gray-100" />
                    <input type="file" accept="image/*" onChange={handleImageChange} className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-light file:text-brand-primary hover:file:bg-brand-secondary"/>
                </div>
            </div>

             <div className="flex items-center">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4 rounded text-brand-primary focus:ring-brand-primary" />
                <label className="ml-2 block text-sm text-gray-900">Category is Active</label>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-brand-text px-4 py-2 rounded-md font-semibold hover:bg-gray-300">Cancel</button>
                <button type="submit" className="bg-brand-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-brand-dark">Save Category</button>
            </div>
        </form>
    );
};

export default CategoryForm;
