import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';

const Profile: React.FC = () => {
    const { user } = useAuth();
    const { employees } = useData();

    if (!user) return <div>Loading...</div>;

    const employee = employees.find(e => e.userId === user.id);

    if (!employee) return <div>Employee data not found.</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-dark mb-6">My Profile</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center space-x-6">
                    <img className="h-24 w-24 rounded-full object-cover" src={employee.profileImage} alt={employee.name} />
                    <div>
                        <h2 className="text-2xl font-bold text-brand-dark">{employee.name}</h2>
                        <p className="text-gray-500">{user.email}</p>
                    </div>
                </div>
                <div className="mt-6 border-t pt-6">
                    <h3 className="text-lg font-semibold mb-2">Bio</h3>
                    <p className="text-gray-700">{employee.bio}</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
