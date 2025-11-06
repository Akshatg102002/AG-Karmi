import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { useAuth } from '../../hooks/useAuth';
import { User } from '../../types';
import UserForm from '../../components/admin/ClientForm';

const ManageUsers: React.FC = () => {
    const { user: currentUser } = useAuth();
    const { users, addUser, updateUser, deleteUserAndAuth } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const openModal = (user: User | null = null) => {
        setEditingUser(user);
        setIsModalOpen(true);
        setError('');
    };

    const closeModal = () => {
        setEditingUser(null);
        setIsModalOpen(false);
    };

    const handleSave = async (userData: User | Omit<User, 'id'>) => {
        setIsLoading(true);
        setError('');
        try {
            if ('id' in userData) {
                await updateUser(userData);
            } else {
                await addUser(userData);
            }
            closeModal();
        } catch (err: any) {
            console.error("Failed to save user:", err);
            setError(err.message || 'Failed to save user. The email might already be in use.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const toggleActive = (user: User) => {
        if (user.id === currentUser?.id) {
            alert("You cannot block your own account.");
            return;
        }
        updateUser({ ...user, isActive: !user.isActive });
    }
    
    const handleDelete = (userId: string) => {
        if (userId === currentUser?.id) {
            alert("You cannot delete your own account.");
            return;
        }
        if(window.confirm("Are you sure you want to permanently delete this user? This will delete their login credentials and cannot be undone.")) {
            deleteUserAndAuth(userId);
        }
    }

    return (
        <div>
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-brand-dark">Manage Users</h1>
                 <button onClick={() => openModal()} className="bg-brand-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-brand-dark">
                    Add New User
                </button>
            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div>{user.email}</div>
                                    <div>{user.phone}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {user.isActive ? 'Active' : 'Blocked'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                    <button onClick={() => openModal(user)} className="text-brand-primary hover:text-brand-dark">Edit</button>
                                    <button onClick={() => toggleActive(user)} disabled={user.id === currentUser?.id} className="text-yellow-600 hover:text-yellow-800 disabled:opacity-50 disabled:cursor-not-allowed">{user.isActive ? 'Block' : 'Unblock'}</button>
                                    <button onClick={() => handleDelete(user.id)} disabled={user.id === currentUser?.id} className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                        <UserForm 
                            user={editingUser} 
                            onSave={handleSave} 
                            onCancel={closeModal}
                            isLoading={isLoading}
                            error={error}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;