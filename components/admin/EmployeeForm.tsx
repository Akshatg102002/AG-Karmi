import React, { useState } from 'react';
import { Employee, DayOfWeek } from '../../types';
import { useData } from '../../hooks/useData';

export interface EmployeeFormState extends Omit<Employee, 'id'> {
    id?: string;
    authData?: {
        email: string;
        password;
        phone: string;
    }
}
interface EmployeeFormProps {
    employee: Employee | null;
    onSave: (formState: EmployeeFormState) => void;
    onCancel: () => void;
    isLoading: boolean;
}

const defaultWorkingHours = {
    monday: { start: "09:00", end: "18:00", breaks: [{start: "13:00", end: "14:00"}] },
    tuesday: { start: "09:00", end: "18:00", breaks: [{start: "13:00", end: "14:00"}] },
    wednesday: { start: "09:00", end: "18:00", breaks: [{start: "13:00", end: "14:00"}] },
    thursday: { start: "10:00", end: "19:00", breaks: [{start: "14:00", end: "15:00"}] },
    friday: { start: "10:00", end: "19:00", breaks: [{start: "14:00", end: "15:00"}] },
    saturday: { start: "09:00", end: "16:00" },
    sunday: { closed: true }
};

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onSave, onCancel, isLoading }) => {
    const { services, users } = useData();
    const isEditing = !!employee;

    const getInitialState = (): EmployeeFormState => {
        if (employee) {
            const user = users.find(u => u.id === employee.userId);
            return {
                ...employee,
                authData: {
                    email: user?.email || '',
                    password: '',
                    phone: user?.phone || ''
                }
            }
        }
        return {
            name: '',
            profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
            bio: '',
            isActive: true,
            rating: 4.5,
            reviewCount: 0,
            assignedServices: [],
            specializations: [],
            workingHours: defaultWorkingHours,
            authData: { email: '', password: '', phone: '' }
        };
    };

    const [formData, setFormData] = useState<EmployeeFormState>(getInitialState());
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "Employee name is required.";
        if (!isEditing) {
            if (!formData.authData?.email) newErrors.email = "Email is required.";
            if (!formData.authData?.password) newErrors.password = "Password is required.";
        }
        if (!formData.bio.trim()) newErrors.bio = "Bio is required.";
        if (formData.assignedServices.length === 0) newErrors.services = "Assign at least one service.";
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
    
    const handleAuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            authData: { ...prev.authData!, [name]: value }
        }));
    };
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({...prev, profileImage: reader.result as string}));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleWorkingHoursChange = (day: DayOfWeek, field: string, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            workingHours: {
                ...prev.workingHours,
                [day]: {
                    ...prev.workingHours[day],
                    [field]: value,
                    ...(field === 'closed' && value ? { start: undefined, end: undefined } : {})
                }
            }
        }))
    }

    const handleServiceChange = (serviceId: string) => {
        const newAssigned = formData.assignedServices.includes(serviceId)
            ? formData.assignedServices.filter(id => id !== serviceId)
            : [...formData.assignedServices, serviceId];
        setFormData(prev => ({ ...prev, assignedServices: newAssigned }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSave(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-brand-dark">{employee ? 'Edit Employee' : 'Add New Employee'}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                    <div className="mt-2 flex items-center gap-4">
                        <img src={formData.profileImage} alt="Profile" className="w-16 h-16 rounded-full object-cover bg-gray-100" />
                        <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-light file:text-brand-primary hover:file:bg-brand-secondary"/>
                    </div>
                </div>
            </div>

            {!isEditing && (
                 <div className="p-4 border rounded-md bg-gray-50 space-y-3">
                    <h3 className="font-semibold text-gray-800">Login Credentials</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                             <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" name="email" value={formData.authData?.email} onChange={handleAuthChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                             {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input type="tel" name="phone" value={formData.authData?.phone} onChange={handleAuthChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        </div>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700">Initial Password</label>
                        <input type="password" name="password" value={formData.authData?.password} onChange={handleAuthChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                </div>
            )}
            
             <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
            </div>

            <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Working Hours</h3>
                <div className="space-y-2">
                {Object.keys(formData.workingHours).map(day => (
                    <div key={day} className="grid grid-cols-4 gap-2 items-center">
                        <label className="capitalize font-medium text-sm">{day}</label>
                        <input type="time" value={formData.workingHours[day as DayOfWeek].start || ''} onChange={e => handleWorkingHoursChange(day as DayOfWeek, 'start', e.target.value)} disabled={formData.workingHours[day as DayOfWeek].closed} className="rounded-md border-gray-300 shadow-sm text-sm disabled:bg-gray-100" />
                        <input type="time" value={formData.workingHours[day as DayOfWeek].end || ''} onChange={e => handleWorkingHoursChange(day as DayOfWeek, 'end', e.target.value)} disabled={formData.workingHours[day as DayOfWeek].closed} className="rounded-md border-gray-300 shadow-sm text-sm disabled:bg-gray-100" />
                        <label className="flex items-center text-sm">
                            <input type="checkbox" checked={formData.workingHours[day as DayOfWeek].closed || false} onChange={e => handleWorkingHoursChange(day as DayOfWeek, 'closed', e.target.checked)} className="rounded text-brand-primary focus:ring-brand-primary" />
                            <span className="ml-2">Closed</span>
                        </label>
                    </div>
                ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Assigned Services</label>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md">
                    {services.map(s => (
                        <label key={s.id} className="flex items-center space-x-2">
                            <input type="checkbox" checked={formData.assignedServices.includes(s.id)} onChange={() => handleServiceChange(s.id)} className="rounded text-brand-primary focus:ring-brand-primary" />
                            <span className="text-sm">{s.name}</span>
                        </label>
                    ))}
                </div>
                 {errors.services && <p className="text-red-500 text-xs mt-1">{errors.services}</p>}
            </div>

             <div className="flex items-center">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4 rounded text-brand-primary focus:ring-brand-primary" />
                <label className="ml-2 block text-sm text-gray-900">Employee is Active</label>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-brand-text px-4 py-2 rounded-md font-semibold hover:bg-gray-300">Cancel</button>
                <button type="submit" disabled={isLoading} className="bg-brand-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-brand-dark disabled:bg-gray-400">
                    {isLoading ? 'Saving...' : 'Save Employee'}
                </button>
            </div>
        </form>
    );
};

export default EmployeeForm;