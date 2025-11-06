import React, { useState } from 'react';
import { Service, ServiceVariant, Category } from '../../types';
import { useData } from '../../hooks/useData';

interface ServiceFormProps {
    service: Service | null;
    onSave: (service: Service) => void;
    onCancel: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ service, onSave, onCancel }) => {
    const { categories, employees, addCategory } = useData();
    const [formData, setFormData] = useState<Service>(
        service || {
            id: '',
            name: '',
            categoryId: categories[0]?.id || '',
            image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=200&q=80',
            isActive: true,
            order: 100,
            variants: [{ name: 'Standard', price: 10, duration: 30 }],
            assignedEmployees: []
        }
    );
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryDesc, setNewCategoryDesc] = useState('');


    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "Service name is required.";
        formData.variants.forEach((v, i) => {
            if (!v.name.trim()) newErrors[`variant_name_${i}`] = "Variant name is required.";
            if (v.price <= 0) newErrors[`variant_price_${i}`] = "Price must be positive.";
            if (v.duration <= 0) newErrors[`variant_duration_${i}`] = "Duration must be positive.";
        });
        if (formData.assignedEmployees.length === 0) newErrors.employees = "At least one employee must be assigned.";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    const handleVariantChange = (index: number, field: keyof ServiceVariant, value: string) => {
        const newVariants = [...formData.variants];
        const numValue = Number(value);
        (newVariants[index] as any)[field] = (field === 'price' || field === 'duration') && !isNaN(numValue) ? numValue : value;
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, { name: '', price: 10, duration: 30 }]
        }));
    };

    const removeVariant = (index: number) => {
        if (formData.variants.length > 1) {
            const newVariants = formData.variants.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, variants: newVariants }));
        }
    };

    const handleEmployeeChange = (employeeId: string) => {
        const newAssigned = formData.assignedEmployees.includes(employeeId)
            ? formData.assignedEmployees.filter(id => id !== employeeId)
            : [...formData.assignedEmployees, employeeId];
        setFormData(prev => ({ ...prev, assignedEmployees: newAssigned }));
    };

    const handleAddNewCategory = async () => {
        if (!newCategoryName.trim()) {
            alert("Category name cannot be empty.");
            return;
        }
        const newCategoryData: Omit<Category, 'id'> = {
            name: newCategoryName,
            description: newCategoryDesc,
            image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=200&q=80',
            order: (categories.length + 1) * 10,
            isActive: true,
        };
        const newCategory = await addCategory(newCategoryData);
        setFormData(prev => ({ ...prev, categoryId: newCategory.id }));
        setNewCategoryName('');
        setNewCategoryDesc('');
        setIsAddingCategory(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSave(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-brand-dark">{service ? 'Edit Service' : 'Add New Service'}</h2>
            
            <div>
                <label className="block text-sm font-medium text-gray-700">Service Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
                 <label className="block text-sm font-medium text-gray-700">Category</label>
                 <div className="flex items-center gap-2">
                     <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <button type="button" onClick={() => setIsAddingCategory(!isAddingCategory)} className="mt-1 px-3 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300">{isAddingCategory ? 'Cancel' : 'Add New'}</button>
                 </div>
            </div>

            {isAddingCategory && (
                <div className="p-4 border rounded-md bg-gray-50 space-y-3">
                    <h3 className="font-semibold text-gray-800">Add New Category</h3>
                    <input type="text" placeholder="New Category Name" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm" />
                    <input type="text" placeholder="Description" value={newCategoryDesc} onChange={e => setNewCategoryDesc(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm" />
                    <button type="button" onClick={handleAddNewCategory} className="px-3 py-1 bg-brand-primary text-white text-sm rounded-md hover:bg-brand-dark">Save Category</button>
                </div>
            )}
            
            <div>
                <label className="block text-sm font-medium text-gray-700">Service Image</label>
                <div className="mt-2 flex items-center gap-4">
                    <img src={formData.image} alt="Service" className="w-20 h-20 rounded-md object-cover bg-gray-100" />
                    <input type="file" accept="image/*" onChange={handleImageChange} className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-light file:text-brand-primary hover:file:bg-brand-secondary"/>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Variants</label>
                {formData.variants.map((variant, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 mt-2">
                        <div className="sm:col-span-2">
                            <input type="text" placeholder="Variant Name" value={variant.name} onChange={e => handleVariantChange(index, 'name', e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm" />
                            {errors[`variant_name_${index}`] && <p className="text-red-500 text-xs mt-1">{errors[`variant_name_${index}`]}</p>}
                        </div>
                        <div>
                             <input type="number" placeholder="Price" value={variant.price} onChange={e => handleVariantChange(index, 'price', e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm" />
                             {errors[`variant_price_${index}`] && <p className="text-red-500 text-xs mt-1">{errors[`variant_price_${index}`]}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                             <input type="number" placeholder="Duration" value={variant.duration} onChange={e => handleVariantChange(index, 'duration', e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm" />
                             {formData.variants.length > 1 && <button type="button" onClick={() => removeVariant(index)} className="text-red-500 text-sm">Remove</button>}
                             {errors[`variant_duration_${index}`] && <p className="text-red-500 text-xs mt-1">{errors[`variant_duration_${index}`]}</p>}
                        </div>
                    </div>
                ))}
                <button type="button" onClick={addVariant} className="mt-2 text-sm text-brand-primary font-medium hover:text-brand-dark">Add Variant</button>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Assigned Employees</label>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {employees.map(emp => (
                        <label key={emp.id} className="flex items-center space-x-2">
                            <input type="checkbox" checked={formData.assignedEmployees.includes(emp.id)} onChange={() => handleEmployeeChange(emp.id)} className="rounded text-brand-primary focus:ring-brand-primary" />
                            <span>{emp.name}</span>
                        </label>
                    ))}
                </div>
                 {errors.employees && <p className="text-red-500 text-xs mt-1">{errors.employees}</p>}
            </div>

             <div className="flex items-center">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4 rounded text-brand-primary focus:ring-brand-primary" />
                <label className="ml-2 block text-sm text-gray-900">Service is Active</label>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-brand-text px-4 py-2 rounded-md font-semibold hover:bg-gray-300">Cancel</button>
                <button type="submit" className="bg-brand-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-brand-dark">Save Service</button>
            </div>
        </form>
    );
};

export default ServiceForm;
