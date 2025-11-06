import { Employee, Booking, ServiceVariant, Settings, DayOfWeek, TimeOff } from '../types';

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const getAvailableTimeSlots = (
  date: Date,
  employee: Employee,
  serviceVariant: ServiceVariant,
  allBookings: Booking[],
  settings: Settings
): string[] => {
  const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' }).toLowerCase() as DayOfWeek;
  const workingHours = employee.workingHours[dayOfWeek];

  if (!workingHours || workingHours.closed || !workingHours.start || !workingHours.end) {
    return [];
  }
  
  const dateString = date.toISOString().split('T')[0];
  const employeeTimeOff = employee.timeOff?.filter(to => to.date === dateString);

  if (employeeTimeOff?.some(to => to.type === 'full-day')) {
      return []; // No slots on a full day off
  }

  const startTime = timeToMinutes(workingHours.start);
  const endTime = timeToMinutes(workingHours.end);
  const serviceDuration = serviceVariant.duration;
  const buffer = settings.bookingBuffer;
  const slotInterval = 15;
  const availableSlots: string[] = [];

  const employeeBookings = allBookings.filter(b => b.employeeId === employee.id && b.appointmentDate === dateString);
  
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

  for (let slotStart = startTime; slotStart <= endTime - serviceDuration; slotStart += slotInterval) {
    if (isToday && slotStart < currentTimeInMinutes) {
        continue; // Skip past time slots
    }
      
    const slotEnd = slotStart + serviceDuration;
    let isAvailable = true;

    // Check if slot is within a break
    if (workingHours.breaks) {
      for (const breakTime of workingHours.breaks) {
        const breakStart = timeToMinutes(breakTime.start);
        const breakEnd = timeToMinutes(breakTime.end);
        if (slotStart < breakEnd && slotEnd > breakStart) {
          isAvailable = false;
          break;
        }
      }
    }
    if (!isAvailable) continue;

    // Check for conflicts with time off
    if (employeeTimeOff) {
      for (const timeOff of employeeTimeOff) {
        if (timeOff.type === 'partial' && timeOff.startTime && timeOff.endTime) {
          const timeOffStart = timeToMinutes(timeOff.startTime);
          const timeOffEnd = timeToMinutes(timeOff.endTime);
          if (slotStart < timeOffEnd && slotEnd > timeOffStart) {
            isAvailable = false;
            break;
          }
        }
      }
    }
    if (!isAvailable) continue;

    // Check for conflicts with existing bookings
    for (const booking of employeeBookings) {
      const bookingStart = timeToMinutes(booking.appointmentTime);
      const bookingEnd = bookingStart + booking.duration; // Buffer should apply to next booking, not block current one
      if (slotStart < (bookingEnd + buffer) && (slotEnd + buffer) > bookingStart) {
        isAvailable = false;
        break;
      }
    }

    if (isAvailable) {
      const hours = Math.floor(slotStart / 60).toString().padStart(2, '0');
      const minutes = (slotStart % 60).toString().padStart(2, '0');
      availableSlots.push(`${hours}:${minutes}`);
    }
  }

  return availableSlots;
};
