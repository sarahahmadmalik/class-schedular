import SchedulerResult from "./Schedular";

// Input Data
const courses = [
  { name: 'Science', classHours: 8, numberOfInstructors: 1, startDate: '2/1/24', endDate: '2/29/24' },
  { name: 'Finance', classHours: 12, numberOfInstructors: 1, startDate: '2/1/24', endDate: '2/29/24' },
  { name: 'Accounting', classHours: 4, numberOfInstructors: 1, startDate: '2/1/24', endDate: '2/29/24' }, // Updated class hours
  { name: 'English Lit', classHours: 2, numberOfInstructors: 1, startDate: '2/1/24', endDate: '2/29/24' }, // Updated class hours
  { name: 'Philosophy', classHours: 2, numberOfInstructors: 1, startDate: '2/1/24', endDate: '2/29/24' }, // Updated class hours
];

const instructors = [
  {
    name: 'Johnson',
    workHours: { start: 7, end: 15.5 },
    offTime: { start: 12.5, end: 13 }, // Added offTime property
    PTO: 0,
    instructionPercentage: { min: 25, max: 50 },
    isActive: true,
    classrooms: ['Bldg 907, CR 223', 'Bldg 907, CR 224', 'Bldg 907, CR 225'],
    availability: {}, // Add availability if needed
    courses: ['Finance', 'Philosophy', 'Accounting', 'English Lit'],
  },
  {
    name: 'Smith',
    workHours: { start: 7, end: 15.5 },
    offTime: { start: 12.5, end: 13.5 }, // Added offTime property
    PTO: { startDate: 0, endDate: 0, allDay: true },
    instructionPercentage: { min: 25, max: 50 },
    isActive: true,
    classrooms: ['Bldg 907, CR 223', 'Bldg 907, CR 224', 'Bldg 907, CR 225', 'BLDG 610, CR 201'],
    availability: {}, // Add availability if needed
    courses: ['Science', 'Philosophy', 'Accounting', 'Finance'],
  },
  {
    name: 'Jones',
    workHours: { start: 7, end: 15.5 },
    offTime: { start: 12, end: 15.5 }, // Added offTime property
    PTO: { startDate: 14, endDate: 14, startTime: 12, endTime: 15.5 },
    instructionPercentage: { min: 25, max: 50 },
    isActive: true,
    classrooms: ['Bldg 907, CR 224', 'Bldg 907, CR 225', 'BLDG 610, CR 201'],
    availability: {}, // Add availability if needed
    courses: ['Science', 'Finance', 'Accounting', 'English Lit'],
  },
];

const otherParams = {
  percentagePriority: 'Distribute Evenly',
  instructorPriority: ['Johnson', 'Smith', 'Jones'],
  offDates: ['February-26'],
};

const selectedMonth = 'February';

function Tester() {
  return (
    <div>
      <SchedulerResult selectedMonth={selectedMonth} instructors={instructors} courses={courses} otherParams={otherParams} />
    </div>
  );
}

export default Tester;
