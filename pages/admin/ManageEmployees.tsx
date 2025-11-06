import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { Employee } from '../../types';
import EmployeeForm, { EmployeeFormState } from '../../components/admin/EmployeeForm';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';

const CredentialsModal: React.FC<{
    creds: { email: string; password; };
    onClose: () => void;
    onCopy: () => void;
}> = ({ creds, onClose, onCopy }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
                <h2 className="text-xl font-bold text-brand-dark mb-2">Employee Created!</h2>
                <p className="text-sm text-gray-500 mb-4">Please copy the initial password and share it securely with the new employee.</p>
                <div className="bg-gray-100 p-4 rounded-md text-left space-y-2">
                    <div>
                        <label className="text-xs font-semibold text-gray-600">EMAIL</label>
                        <p className="font-mono text-sm">{creds.email}</p>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-600">PASSWORD</label>
                        <p className="font-mono text-sm">{creds.password}</p>
                    </div>
                </div>
                <div className="mt-6 flex gap-4">
                    <button onClick={onClose} className="w-full bg-gray-200 text-brand-text px-4 py-2 rounded-md font-semibold hover:bg-gray-300">Close</button>
                    <button onClick={onCopy} className="w-full bg-brand-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-brand-dark">Copy Password</button>
                </div>
            </div>
        </div>
    );
};


const ManageEmployees: React.FC = () => {
    const { employees, addEmployeeAndUser, updateEmployee, deleteEmployeeAndUser } = useData();
    const { user: currentUser } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [credsToShow, setCredsToShow] = useState<{email: string, password: string} | null>(null);
    const toast = useToast();

    const openModal = (employee: Employee | null = null) => {
        setEditingEmployee(employee);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingEmployee(null);
        setIsModalOpen(false);
        setIsLoading(false);
    };
    
    const handleCopyPassword = () => {
        if (credsToShow?.password) {
            navigator.clipboard.writeText(credsToShow.password);
            toast.success("Password copied to clipboard!");
        }
    };

    const handleDelete = (employee: Employee) => {
        if (employee.userId === currentUser?.id) {
            toast.error("You cannot delete your own employee profile.");
            return;
        }
        if (window.confirm(`Are you sure you want to permanently delete ${employee.name}? This will delete their login credentials and cannot be undone.`)) {
            deleteEmployeeAndUser(employee.id, employee.userId);
        }
    };

    const handleSave = async (formState: EmployeeFormState) => {
        setIsLoading(true);
        const { authData, ...employeeData } = formState;

        try {
            if (editingEmployee) {
                await updateEmployee(employeeData as Employee);
                closeModal();
            } else {
                if (!authData || !authData.email || !authData.password) {
                    throw new Error("Email and password are required for new employees.");
                }
                await addEmployeeAndUser(employeeData, authData);
                closeModal(); 
                setCredsToShow(authData); 
            }
        } catch(err: any) {
            console.error("Failed to save employee:", err);
            let errorMessage = "Could not save employee. Please try again.";
             if (err.code === 'auth/email-already-in-use') {
                errorMessage = 'An account with this email already exists.';
            } else if (err.code === 'auth/weak-password') {
                errorMessage = 'Password must be at least 6 characters long.';
            }
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-brand-dark">Manage Employees</h1>
                <button onClick={() => openModal()} className="bg-brand-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-brand-dark">
                    Add New Employee
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {employees.map(employee => (
                            <tr key={employee.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full object-cover" src={employee.profileImage} alt={employee.name} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.rating} ({employee.reviewCount} reviews)</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${employee.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {employee.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                    <button onClick={() => openModal(employee)} className="text-brand-primary hover:text-brand-dark">Edit</button>
                                    <button onClick={() => handleDelete(employee)} className="text-red-600 hover:text-red-800">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <EmployeeForm employee={editingEmployee} onSave={handleSave} onCancel={closeModal} isLoading={isLoading} />
                    </div>
                </div>
            )}
            
            {credsToShow && (
                <CredentialsModal
                    creds={credsToShow}
                    onClose={() => setCredsToShow(null)}
                    onCopy={handleCopyPassword}
                />
            )}
        </div>
    );
};

export default ManageEmployees;