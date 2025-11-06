import React, { useState, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import { Employee, TimeOff } from '../../types';

const LeaveManagement: React.FC = () => {
    const { user } = useAuth();
    const { employees, updateEmployee } = useData();

    const currentEmployee = useMemo(() => employees.find(e => e.userId === user?.id), [employees, user]);
    
    const [leaveDate, setLeaveDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [leaveType, setLeaveType] = useState<'full-day' | 'partial'>('full-day');
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('13:00');
    const [reason, setReason] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentEmployee || !reason.trim()) {
            alert("Please provide a reason for your leave.");
            return;
        }

        const newTimeOff: TimeOff = {
            date: leaveDate,
            type: leaveType,
            startTime: leaveType === 'partial' ? startTime : undefined,
            endTime: leaveType === 'partial' ? endTime : undefined,
            reason: reason,
        };

        const updatedTimeOff = [...(currentEmployee.timeOff || []), newTimeOff]
            .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        try {
            await updateEmployee({ ...currentEmployee, timeOff: updatedTimeOff });
            // Reset form
            setReason('');
        } catch (error) {
            console.error("Failed to update time off:", error);
            alert("Could not save leave request. Please try again.");
        }
    };
    
    const handleDeleteLeave = async (leaveToDelete: TimeOff) => {
        if (!currentEmployee) return;

        const updatedTimeOff = currentEmployee.timeOff?.filter(to => 
            !(to.date === leaveToDelete.date && to.type === leaveToDelete.type && to.startTime === leaveToDelete.startTime)
        );
        
        try {
            await updateEmployee({ ...currentEmployee, timeOff: updatedTimeOff });
        } catch (error) {
            console.error("Failed to delete time off:", error);
            alert("Could not delete leave request. Please try again.");
        }
    }

    if (!currentEmployee) {
        return <div>Loading employee data...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-dark mb-6">Manage Leave</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Leave Request Form */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-brand-dark mb-4">Request Time Off</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="leaveDate" className="block text-sm font-medium text-gray-700">Date</label>
                            <input type="date" id="leaveDate" value={leaveDate} onChange={e => setLeaveDate(e.target.value)} required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Leave Type</label>
                            <select value={leaveType} onChange={e => setLeaveType(e.target.value as 'full-day' | 'partial')}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm">
                                <option value="full-day">Full Day</option>
                                <option value="partial">Partial Day</option>
                            </select>
                        </div>
                        {leaveType === 'partial' && (
                            <div className="flex gap-4">
                                <div>
                                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                                    <input type="time" id="startTime" value={startTime} onChange={e => setStartTime(e.target.value)} required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                                    <input type="time" id="endTime" value={endTime} onChange={e => setEndTime(e.target.value)} required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
                                </div>
                            </div>
                        )}
                        <div>
                            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason</label>
                            <input type="text" id="reason" value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g., Doctor's Appointment" required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
                        </div>
                        <button type="submit" className="w-full bg-brand-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-brand-dark transition-colors">
                            Submit Request
                        </button>
                    </form>
                </div>

                {/* Scheduled Leave List */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-brand-dark mb-4">Your Scheduled Leave</h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {currentEmployee.timeOff && currentEmployee.timeOff.length > 0 ? (
                            currentEmployee.timeOff.map((leave, index) => (
                                <div key={index} className="bg-gray-50 p-3 rounded-md flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{new Date(leave.date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', timeZone: 'UTC' })}</p>
                                        <p className="text-sm text-gray-600">{leave.type === 'full-day' ? 'Full Day' : `${leave.startTime} - ${leave.endTime}`}</p>
                                        <p className="text-xs text-gray-500 italic">{leave.reason}</p>
                                    </div>
                                    <button onClick={() => handleDeleteLeave(leave)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">You have no scheduled leave.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaveManagement;
