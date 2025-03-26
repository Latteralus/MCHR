import React, { useState, useEffect } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  getDay,
  isWeekend
} from 'date-fns';

const AttendanceCalendar = ({ attendanceRecords, employeeId, onDateClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  // Generate calendar days for the current month
  useEffect(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Calculate the first day of the month to determine blank days at start
    const startingDayOfWeek = getDay(monthStart);
    
    // Add blank days at the beginning (for proper alignment)
    const blankDaysAtStart = Array.from({ length: startingDayOfWeek }, (_, i) => ({
      date: null,
      isBlank: true,
      key: `blank-start-${i}`
    }));
    
    // Create calendar days with attendance info
    const daysWithInfo = days.map(date => {
      // Find attendance record for this day
      const recordForDay = attendanceRecords.find(record => 
        isSameDay(new Date(record.date), date)
      );
      
      return {
        date,
        isToday: isSameDay(date, new Date()),
        isCurrentMonth: isSameMonth(date, currentMonth),
        isWeekend: isWeekend(date),
        attendanceRecord: recordForDay || null,
        key: format(date, 'yyyy-MM-dd')
      };
    });
    
    // Combine blank days and actual days
    setCalendarDays([...blankDaysAtStart, ...daysWithInfo]);
  }, [currentMonth, attendanceRecords]);

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Handle date click
  const handleDateClick = (day) => {
    if (day.date) {
      setSelectedDate(day.date);
      if (onDateClick) {
        onDateClick(day.date, day.attendanceRecord);
      }
    }
  };

  // Get status color for a day based on attendance record
  const getStatusColor = (day) => {
    if (!day.attendanceRecord) return '';
    
    switch (day.attendanceRecord.status) {
      case 'present':
        return 'bg-green-100 border-green-400';
      case 'absent':
        return 'bg-red-100 border-red-400';
      case 'late':
        return 'bg-yellow-100 border-yellow-400';
      case 'half-day':
        return 'bg-blue-100 border-blue-400';
      case 'remote':
        return 'bg-purple-100 border-purple-400';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Attendance Calendar
        </h2>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={prevMonth}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            &lt;
          </button>
          
          <span className="text-lg font-medium">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          
          <button
            onClick={nextMonth}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            &gt;
          </button>
        </div>
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day names */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div 
            key={day} 
            className="text-center font-medium text-gray-500 text-sm py-2"
          >
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {calendarDays.map(day => (
          <div
            key={day.key}
            className={`
              h-24 p-1 border rounded relative
              ${day.isBlank ? 'bg-gray-50' : ''}
              ${day.isWeekend && !day.isBlank ? 'bg-gray-50' : ''}
              ${day.isToday && !day.isBlank ? 'border-blue-500 border-2' : ''}
              ${getStatusColor(day)}
              ${day.date && isSameDay(day.date, selectedDate) ? 'ring-2 ring-blue-500' : ''}
            `}
            onClick={() => !day.isBlank && handleDateClick(day)}
          >
            {!day.isBlank && (
              <>
                <div className="text-right">
                  <span className={`text-sm ${day.isToday ? 'font-bold' : ''}`}>
                    {format(day.date, 'd')}
                  </span>
                </div>
                
                {day.attendanceRecord && (
                  <div className="mt-2 text-xs">
                    <div className="font-medium text-gray-700">
                      {day.attendanceRecord.status.charAt(0).toUpperCase() + day.attendanceRecord.status.slice(1)}
                    </div>
                    
                    {day.attendanceRecord.timeIn && (
                      <div className="text-gray-600">
                        In: {day.attendanceRecord.timeIn}
                      </div>
                    )}
                    
                    {day.attendanceRecord.timeOut && (
                      <div className="text-gray-600">
                        Out: {day.attendanceRecord.timeOut}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-100 border border-green-400 rounded mr-2"></div>
          <span className="text-sm">Present</span>
        </div>
        
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-100 border border-red-400 rounded mr-2"></div>
          <span className="text-sm">Absent</span>
        </div>
        
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-100 border border-yellow-400 rounded mr-2"></div>
          <span className="text-sm">Late</span>
        </div>
        
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-100 border border-blue-400 rounded mr-2"></div>
          <span className="text-sm">Half Day</span>
        </div>
        
        <div className="flex items-center">
          <div className="w-4 h-4 bg-purple-100 border border-purple-400 rounded mr-2"></div>
          <span className="text-sm">Remote</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;