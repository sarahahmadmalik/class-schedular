// Create a new file, e.g., AppContext.js
import React, { createContext, useState, useContext } from 'react';

// Create the context
const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [instructors, setInstructors] = useState([
    {
      name: '',
      courses: [''],
      workHours: 1,
      PTO: 0,
      instructionPercentage: 0,
      classrooms: [''],
      isActive: true,
    },
  ]);
  const [courses, setCourses] = useState([
    { name: '', classHours: 1, startDate: '', endDate: '', classrooms: '', numberOfInstructors: 1, showInstructorNames: false },
  ]);
  
  const [otherParams, setOtherParams] = useState({
    offDates: [],
    excludeWeekends: true,
    percentagePriority: 'Force Percentage',
  });

  return (
    <AppContext.Provider
      value={{
        selectedMonth,
        setSelectedMonth,
        instructors,
        setInstructors,
        courses,
        setCourses,
        otherParams,
        setOtherParams,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Create a custom hook to use the context
export const useAppContext = () => {
  return useContext(AppContext);
};
