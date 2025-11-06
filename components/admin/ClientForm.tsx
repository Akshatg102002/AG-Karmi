import React, { useState } from 'react';
import { User } from '../../types';

interface UserFormProps {
    user: User | null; // Null for adding a new user
    onSave: (user: User | Omit<User, 'id'>) => void;
    onCancel: () => void;
    isLoading: boolean;
    error: string;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSave, onCancel, isLoading, error }) => {
    const isEditing = !!user;
    const [formData, setFormData] = useState<User | Omit<User, 'id'>>(
        user || {
            name: '',
            email: '',
            phone: '',
            role: 'customer',
            password: '',
            isActive: true,
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-brand-dark">{isEditing ? 'Edit User' : 'Add New User'}</h2>
            
            {error && <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}

            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
            </div>
             <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
            </div>
             <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            
            {!isEditing && (
                 <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Initial Password</label>
                    <input type="password" name="password" id="password" value={formData.password || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required={!isEditing} />
                    <p className="text-xs text-gray-500 mt-1">User will be prompted to change this on first login.</p>
                </div>
            )}

            <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <select name="role" id="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                    <option value="customer">Customer</option>
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-brand-text px-4 py-2 rounded-md font-semibold hover:bg-gray-300">Cancel</button>
                <button type="submit" disabled={isLoading} className="bg-brand-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-brand-dark disabled:bg-gray-400">
                    {isLoading ? 'Saving...' : 'Save User'}
                </button>
            </div>
        </form>
    );
};

export default UserForm;