import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { Service } from '../../types';
import ServiceForm from '../../components/admin/ServiceForm';
import { useToast } from '../../hooks/useToast';

const ManageServices: React.FC = () => {
    const { services, categories, addService, updateService, deleteService } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const toast = useToast();

    const getCategoryName = (categoryId: string) => {
        return categories.find(c => c.id === categoryId)?.name || 'N/A';
    }

    const openModal = (service: Service | null = null) => {
        setEditingService(service);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingService(null);
        setIsModalOpen(false);
    };

    const handleDelete = (service: Service) => {
        if (window.confirm(`Are you sure you want to delete the service "${service.name}"? This action cannot be undone.`)) {
            deleteService(service.id);
        }
    }

    const handleSave = (service: Service) => {
        if (editingService) {
            updateService(service);
        } else {
            // FIX: The `addService` function expects an object without an `id` property.
            // Destructuring to remove `id` before passing to `addService`. Firestore will generate the ID.
            const { id, ...serviceData } = service;
            addService(serviceData);
        }
        closeModal();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-brand-dark">Manage Services</h1>
                <button onClick={() => openModal()} className="bg-brand-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-brand-dark">
                    Add New Service
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variants</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {services.map(service => (
                            <tr key={service.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getCategoryName(service.categoryId)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.variants.length}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {service.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                    <button onClick={() => openModal(service)} className="text-brand-primary hover:text-brand-dark">Edit</button>
                                    <button onClick={() => handleDelete(service)} className="text-red-600 hover:text-red-800">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
                        <ServiceForm service={editingService} onSave={handleSave} onCancel={closeModal} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageServices;