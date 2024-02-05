import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LazyLoader from '@/components/LazyLoader';
import CustomTable from './CustomTable';
import ExcelJS from 'exceljs';

const SchedulerResult = ({ selectedMonth, instructors, courses, otherParams }) => {
  const router = useRouter();
  const [isSchedulingDone, setSchedulingDone] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const delay = 2000; 
    // Function to calculate podium time for an instructor
    const calculatePodiumTime = (instructor) => {
      // Calculate the total available hours for an instructor considering work hours and PTO
      const totalAvailableHours = instructor.workHours.end - instructor.workHours.start - (instructor.PTO || 0);
      // Calculate the podium time based on the instruction percentage
      return (instructor.instructionPercentage.max / 100) * totalAvailableHours;
    };

    // Filter active instructors
    const activeInstructors = instructors.filter((instructor) => instructor.isActive);

    // Calculate the total required podium time for all active instructors
    const totalRequiredPodiumTime = activeInstructors.reduce((total, instructor) => total + calculatePodiumTime(instructor), 0);

    // Calculate the total required courses based on podium time and course duration
    let totalRequiredCourses = Math.ceil(totalRequiredPodiumTime / (courses.length > 0 ? courses[0].classHours : 1));

    // Handle different priority cases
    switch (otherParams.percentagePriority) {
      case 'Distribute Evenly':
        // Ensure that the total required courses are at least the number of active instructors
        totalRequiredCourses = Math.max(totalRequiredCourses, activeInstructors.length);
        break;

      case 'Instructor Priority':
        // Sort active instructors based on priority order
        activeInstructors.sort((a, b) => {
          const priorityOrder = otherParams.instructorPriority;
          return priorityOrder.indexOf(a.name) - priorityOrder.indexOf(b.name);
        });
        break;

      case 'Force Percentage':
        // Adjust the total required courses to meet the specified percentage, if needed
        const achievedPodiumTime = totalRequiredCourses * (courses.length > 0 ? courses[0].classHours : 1);
        if (achievedPodiumTime < totalRequiredPodiumTime) {
          const additionalCoursesNeeded = Math.ceil((totalRequiredPodiumTime - achievedPodiumTime) / (courses.length > 0 ? courses[0].classHours : 1));
          totalRequiredCourses += additionalCoursesNeeded;
        }
        break;

      default:
        // 'Force Percentage': No additional adjustment needed
    }

    // Function to get the next available time slot for a day
    const getNextAvailableTimeSlot = (day) => {
      const daySchedule = schedule[day]?.classes;

      // If no classes scheduled for the day, start from 7 AM
      if (!daySchedule) {
        return 7;
      }

      // Find the latest end time among scheduled classes for the day
      const latestEndTime = Math.max(...Object.keys(daySchedule).map((timeSlot) => parseFloat(timeSlot.split('-')[1])));

      // Return the next available time slot
      return Math.ceil(latestEndTime * 2) / 2;
    };

   // Function to get an available classroom for an instructor, day, and course
const getAvailableClassroom = (instructor, day, course, startTime) => {
  return instructor.classrooms.find(
    (classroom) =>
      (instructor.availability?.[`${selectedMonth}-${day}`] ?? true) !== false &&
      !Object.values(schedule[day]?.classes?.[`${day}-${startTime}`] || {}).some(
        (scheduledClass) =>
          scheduledClass.instructorName === instructor.name &&
          scheduledClass.startDate <= `${selectedMonth}-${day}` &&
          scheduledClass.endDate >= `${selectedMonth}-${day}` &&
          scheduledClass.courseName === course.name
      )
  );
};


  // Function to schedule a class
const scheduleClass = (classroom, day, startTime, course, instructor) => {
  const startDate = `${selectedMonth}-${day}`;
  const timeSlot = `${startTime}-${startTime + course.classHours}`;

  // If the schedule for the day doesn't exist, create it
  if (!schedule[day]) {
    schedule[day] = { date: startDate, classes: {} };
  }

  // If the time slot doesn't exist for the day, create it
  if (!schedule[day].classes[timeSlot]) {
    schedule[day].classes[timeSlot] = [];
  }

  // Add the scheduled class to the time slot
  schedule[day].classes[timeSlot].push({
    courseName: course.name,
    instructorName: instructor.name,
    classroom,
    startDate,
    startTime,
    endTime: startTime + course.classHours,
  });

  // If the instructor doesn't have a courses array, create it
  if (!instructor.courses) {
    instructor.courses = [];
  }

  // Add the scheduled class to the instructor's courses
  instructor.courses.push({
    courseName: course.name,
    numberOfInstructors: course.numberOfInstructors,
    startDate,
    endDate: startDate, // Update as needed
  });

  // Subtract the class duration from the instructor's available work hours
  instructor.workHours.end -= course.classHours;
};

// Function to schedule all classes
const scheduleClasses = () => {
  for (let day = 1; day <= 29; day++) {
    // Randomize the order of courses and instructors
    const randomizedCourses = courses.slice().sort(() => Math.random() - 0.5);
    const randomizedInstructors = activeInstructors.slice().sort(() => Math.random() - 0.5); 

    randomizedCourses.forEach((course) => {
    
      randomizedInstructors.forEach((instructor) => {
     
        if (
          instructor.workHours.start < instructor.workHours.end &&
          instructor.workHours.end > 0 &&
          !otherParams.offDates?.includes(`${selectedMonth}-${day}`) &&
          instructor.courses?.includes(course.name)
        ) {
          let startTime = getNextAvailableTimeSlot(day);
        

          // Iterate until a valid time slot is found
          while (startTime + course.classHours <= 15.5) {
            const availableClassroom = getAvailableClassroom(instructor, day, course, startTime);
            

            // Check if the availableClassroom is valid
            if (availableClassroom) {
              console.log("inside")
              // Check if the scheduled class falls completely within the institute's working hours
              if (startTime + course.classHours <= 15.5) {
                // Check if the course has already been scheduled on this day
                const isCourseAlreadyScheduled = Object.values(schedule[day]?.classes?.[`${day}-${startTime}`] || {}).some(
                  (scheduledClass) => scheduledClass.courseName === course.name
                );

                if (!isCourseAlreadyScheduled) {
                  scheduleClass(availableClassroom, day, startTime, course, instructor);
                  break; // Break the loop once a class is scheduled for the current time slot
                }
              }
            }

            // Move to the next time slot
            startTime = getNextAvailableTimeSlot(day);
          }
        }
      });
    }
  )}

  // Log the final scheduled classes
  console.log(schedule);
  
};
    const timeoutId = setTimeout(() => {
      scheduleClasses();
      setSchedulingDone(true);
      setLoading(false); // Set loading to false after the delay
     
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [selectedMonth, instructors, courses, otherParams, schedule]);

  useEffect(() => {
    // Redirect to the output page when scheduling is done
    if (isSchedulingDone) {
      
      router.push('/output');
    }
  }, [schedule]);

  
  // Function to generate and download an Excel file from the schedule data
  const generateExcelFile = async (scheduleData) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Schedule');
  
    // Add headers to the Excel sheet
    sheet.addRow(['Date', 'Time Slot', 'Course Name', 'Instructor Name', 'Classroom']);
  
    // Set styles for header row
    const headerRow = sheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '615794' }, // Hex color for the background
      };
      cell.font = {
        color: { argb: 'ffffff' }, // Hex color for the font
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  
    // Add schedule data to the sheet
    Object.keys(scheduleData).forEach((date) => {
      const classes = scheduleData[date].classes;
  
      Object.keys(classes).forEach((timeSlot) => {
        classes[timeSlot].forEach((scheduledClass) => {
          // Add a row for each scheduled class in the Excel sheet
          const row = sheet.addRow([
            scheduleData[date].date,
            timeSlot,
            scheduledClass.courseName,
            scheduledClass.instructorName,
            scheduledClass.classroom,
          ]);
  
          // Set styles for the data row
          row.eachCell((cell) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
  
            // Add conditional styling based on your logic for hasClasses
            if (cell.value === 'lightgreen') {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '98FB98' }, // Hex color for lightgreen
              };
            } else {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFFF' }, // Hex color for white
              };
            }
          });
        });
      });
    });
  
    // Create a blob from the Excel file
    const blob = await workbook.xlsx.writeBuffer();
  
    // Create a download link and trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    link.download = 'schedule.xlsx';
    link.click();
  };
  
  const handleDownloadClick = () => {
    generateExcelFile(schedule);
  };

  return (
    <div className="">
      {!isLoading  ? (
        <div className="bg-result">
          <div className='flex w-full items-center justify-between p-8 bg-[#152E48]'>
          <h1 className="text-3xl font-bold text-white">Scheduling Completed!</h1>
          
          <button
            className="button-download"
            onClick={handleDownloadClick}
          >
            <span className="button__icon">
              <svg className="svg" viewBox="0 0 384 512">
                <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path>
              </svg>
            </span>
            <span className="button__text">Download</span>
          </button>
          </div>
          <div className='p-6'>
            <CustomTable schedule={schedule} />
            </div>
         
        </div>
      ) : (
        <LazyLoader />
      )}
    </div>
  );
};

export default SchedulerResult;
