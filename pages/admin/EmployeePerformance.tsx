import React, { useMemo } from 'react';
import { useData } from '../../hooks/useData';

const EmployeePerformance: React.FC = () => {
    const { employees, bookings } = useData();

    const performanceData = useMemo(() => {
        const stats = employees.map(employee => {
            const employeeBookings = bookings.filter(b => b.employeeId === employee.id);
            const totalRevenue = employeeBookings.reduce((sum, b) => sum + b.price, 0);
            return {
                ...employee,
                totalBookings: employeeBookings.length,
                totalRevenue,
            };
        });
        return stats.sort((a, b) => b.totalRevenue - a.totalRevenue);
    }, [employees, bookings]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-dark mb-6">Employee Performance</h1>
             <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Bookings</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {performanceData.map((employee, index) => (
                            <tr key={employee.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <img className="h-10 w-10 rounded-full object-cover" src={employee.profileImage} alt={employee.name} />
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.totalBookings}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${employee.totalRevenue.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeePerformance;
