import { useState, useEffect } from 'react';
import {
  Button,
  Checkbox,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  Breadcrumbs,
  Stepper,
  Step,
  StepLabel,
  Alert
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { ReactTyped  } from 'react-typed';
import { useAppContext } from '@/Contexts/DataContexts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useSpring, animated } from 'react-spring';
import SchedulerResult from '@/components/Schedular';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import Check from '@mui/icons-material/Check';
import useMediaQuery from '@mui/material/useMediaQuery';

const CustomSwitch = styled(Switch)(({ theme, color = "#218380" }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    '&:hover': {
      backgroundColor: alpha('#218380', theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#218380',
  },
}));

const InputPage = () => {
  const [step, setStep] = useState(1);
  const [nextButtonClicked, setNextButtonClicked] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [classroomInputs, setClassroomInputs] = useState(['']); // Separate array for classrooms
  const [courseInputs, setCourseInputs] = useState(['']);
  const isSmallScreen = useMediaQuery('(max-width:1024px)');
  const steps = ['Enter Parameters', 'Auto Schedule', 'Voila! Download Scheduled File'];
  const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 10,
      left: 'calc(-50% + 16px)',
      right: 'calc(50% + 16px)',
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: '#784af4',
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: '#784af4',
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
      minHeight: '40px',
      borderRadius: 1,
    },
  }));
  
  const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
    ...(ownerState.active && {
      color: '#784af4',
    }),
    '& .QontoStepIcon-completedIcon': {
      color: '#784af4',
      zIndex: 1,
      fontSize: 26,
    },
    '& .QontoStepIcon-circle': {
      width: 12,
      height: 12,
      borderRadius: '50%',
      backgroundColor: 'currentColor',
      
    },
  }));
  
  function QontoStepIcon(props) {
    const { active, completed, className } = props;
  
    return (
      <QontoStepIconRoot ownerState={{ active }} className={className}>
        {completed ? (
          <Check className="QontoStepIcon-completedIcon" />
        ) : (
          <div className="QontoStepIcon-circle" />
        )}
      </QontoStepIconRoot>
    );
  }
  
  
  useEffect(() => {
    setIsMounted(true); // Set isMounted to true when the component mounts
  }, []);

  const handleFormSubmit = () => {
    console.log(instructors)
    console.log(courses);
    console.log(otherParams)
    setStep((prevStep) => prevStep + 1);
    setTimeout(() => {
      setFormSubmitted(true);
    }, 2000); 
  };


  const { selectedMonth, setSelectedMonth, instructors, setInstructors, courses, setCourses, otherParams, setOtherParams } = useAppContext();

  const [errorMessage, setErrorMessage] = useState('');

  const handleInstructorAdd = () => {
    const newInstructor = {
      name: '',
      courses: [{ courseName: '', numberOfInstructors: 0 }],
      workHours: 1,
      PTO: 0,
      instructionPercentage: 0,
      classrooms: [''],
      isActive: true,
    };
  
    setInstructors([...instructors, newInstructor]);
  };

  const handleInstructorNameChange = (index, value) => {
    const updatedInstructors = [...instructors];
    updatedInstructors[index].name = value;
    setInstructors(updatedInstructors);
  };
  

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const validateCourses = () => {
    return courses.every(
      (course) =>
        course.name &&
        course.classHours &&
        course.startDate &&
        course.endDate &&
        course.classrooms
    );
  };
  const validateInstructors = () => {
    console.log(instructors)
    return instructors.every(
      (instructor) =>
        instructor.name && instructor.courses.every((course) => course)
    );
  };

  const handleNext = () => {
    if (
      (step === 1 && validateInstructors()) ||
      (step === 2 && validateCourses()) ||
      step === 3
    ) {
      setStep((prevStep) => prevStep + 1);
      setErrorMessage(''); // Clear any previous error message
      setNextButtonClicked(true); // Set the state to true when the "Next" button is clicked
    } else {
      setErrorMessage('Please fill in all required fields before proceeding.');
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };
  const handlePrev = () => {
    setStep((prevStep) => prevStep - 1);
  };
  const clearErrorMessage = () => {
    setErrorMessage('');
  };

  const formAnimation = useSpring({
    opacity: isMounted && (nextButtonClicked || step >= 1) ? 1 : 0, // Apply the animation conditionally
    from: { opacity: 0 },
    reset: true,
  });


  const renderFormStep = () => {
    switch (step) {
      case 1:
        return (
          <animated.div style={formAnimation}>
            {renderInstructorsForm()}
          </animated.div>
        );
      case 2:
        return (
          <animated.div style={formAnimation}>
            {renderCoursesForm()}
          </animated.div>
        );
      case 3:
        return (
          <animated.div style={formAnimation}>
            {renderOtherParamsForm()}
          </animated.div>
        );
      default:
        return null;
    }
  };
  
  const handleInstructorToggle = (index) => {
    const updatedInstructors = [...instructors];
    updatedInstructors[index].isActive = !updatedInstructors[index].isActive;
    setInstructors(updatedInstructors);
  };
  
  const handleCourseAdd = (index) => {
    const updatedInstructors = [...instructors];
    updatedInstructors[index].courses.push({ courseName: '', numberOfInstructors: 0 });
    setInstructors(updatedInstructors);
  };

  const handleClassroomChange = (index, value) => {
    setClassroomInputs((prev) => {
      const updatedInputs = [...prev];
      updatedInputs[index] = value;
      return updatedInputs;
    });
  
    const updatedInstructors = [...instructors];
    const classrooms = value.split(',').map((classroom) => classroom.trim());
    updatedInstructors[index].classrooms = classrooms;
    setInstructors(updatedInstructors);
  };
  
  const handleCourseChange = (index, value) => {
    setCourseInputs((prev) => {
      const updatedInputs = [...prev];
      updatedInputs[index] = value;
      return updatedInputs;
    });
  
    const updatedInstructors = [...instructors];
    const courses = value.split(',').map((course) => course.trim());
    updatedInstructors[index].courses = courses;
    setInstructors(updatedInstructors);
  };
  

  const handleOtherParamsChange = (param, value) => {
    setOtherParams((prevParams) => ({ ...prevParams, [param]: value }));
  };
  const handleOffDateChange = (index, property, value) => {
    const updatedOffDates = [...otherParams.offDates];
    updatedOffDates[index][property] = value;
    setOtherParams((prevParams) => ({ ...prevParams, offDates: updatedOffDates }));
  };
  
  const handleAddOffDate = () => {
    const newOffDate = { date: '', time: '' };
    setOtherParams((prevParams) => ({ ...prevParams, offDates: [...prevParams.offDates, newOffDate] }));
  };
  
  const handleRemoveOffDate = (index) => {
    const updatedOffDates = [...otherParams.offDates];
    updatedOffDates.splice(index, 1);
    setOtherParams((prevParams) => ({ ...prevParams, offDates: updatedOffDates }));
  };
  
  
  const handleWorkHoursChange = (index, value) => {
    const updatedInstructors = [...instructors];
    updatedInstructors[index].workHours = Math.max(0, value);
    setInstructors(updatedInstructors);
  };
  
  const handlePTOChange = (index, value) => {
    const updatedInstructors = [...instructors];
    updatedInstructors[index].PTO = Math.max(0, value);
    setInstructors(updatedInstructors);
  };
  
  const handleInstructionPercentageChange = (index, value) => {
    const updatedInstructors = [...instructors];
    updatedInstructors[index].instructionPercentage = Math.max(0, value);
    setInstructors(updatedInstructors);
  };
  
  
  
  const handleCoursePropertyChange = (index, property, value) => {
    const updatedCourses = [...courses];
  
    if (property === 'numberOfInstructors' || property === 'classHours') {
      value = Math.max(0, parseInt(value, 10));
    } else if (property === 'classrooms') {
      console.log(value)
      value.split(',')
      .map((classroom) => classroom.trim())
      .filter((classroom) => classroom !== ''); 
    }
  
    updatedCourses[index][property] = value;
    setCourses(updatedCourses);
    
  };
  
  const renderBreadcrumbs = () => {
    if (step === 1) {
      return (
        <Breadcrumbs separator="›">
          <p className="text-neutral-600 cursor-pointer">Instructors</p>
          <p></p>
        </Breadcrumbs>
      );
    } else if (step === 2 && validateInstructors()) {
      return (
        <Breadcrumbs separator="›">
          <p className="text-neutral-600 cursor-pointer" onClick={() => setStep(1)}>
            Instructors
          </p>
          <p className="cursor-pointer text-neutral-400">Courses</p>
        </Breadcrumbs>
      );
    } else if (step === 3 && validateCourses()) {
      return (
        <Breadcrumbs separator="›">
          <p className="text-neutral-600 cursor-pointer" onClick={() => setStep(1)}>
            Instructors
          </p>
          <p className="text-neutral-600 cursor-pointer" onClick={() => setStep(2)}>
            Courses
          </p>
          <p className="cursor-pointer text-neutral-400">Other Parameters</p>
        </Breadcrumbs>
      );
    }
    return null; // Hide breadcrumbs for other cases
  };
  
  
  

  const renderInstructorsForm = () => {
    return (
      <div>
         {/* Input for Instructors */}
      <div className="mb-8" >
        <div className="flex flex-col  mb-4">
        <Typography variant="h5" sx={{ fontWeight: 500 }}>
  Instructors
</Typography>

            <hr className="w-full mt-2 border border-neutral-300 border rounded-lg" />
            <FormControl fullWidth margin="normal">
            <InputLabel>Select Month</InputLabel>
        <Select
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          <MenuItem value="01">January</MenuItem>
          <MenuItem value="02">February</MenuItem>
          <MenuItem value="03">March</MenuItem>
          <MenuItem value="04">April</MenuItem>
          <MenuItem value="05">May</MenuItem>
          <MenuItem value="06">June</MenuItem>
          <MenuItem value="07">July</MenuItem>
          <MenuItem value="08">August</MenuItem>
          <MenuItem value="09">September</MenuItem>
          <MenuItem value="10">October</MenuItem>
          <MenuItem value="11">November</MenuItem>
          <MenuItem value="12">December</MenuItem>
        </Select>
      </FormControl>
        </div>
        {instructors.map((instructor, instructorIndex) => (
          <div key={instructorIndex} className="mb-4">
            <div className="grid grid-cols-2 gap-4" style={{ gridTemplateColumns: '1fr 6fr' }}
              >
              <div>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Instructor {instructorIndex + 1}</Typography>
              </div>
              <div className=''>
              <div className="flex items-center space-x-2">
                  <CustomSwitch          
  checked={instructor.isActive}
  onChange={() => handleInstructorToggle(instructorIndex)}
                  />
                
              <Typography variant="body1">On-Off</Typography>

     
            </div>
                <TextField
                  label="Name"
                  value={instructor.name}
                  onChange={(e) => {
                   
                    handleInstructorNameChange(instructorIndex,e.target.value);
                  }}
                  fullWidth
                  margin="normal"
                  onClick={clearErrorMessage} 
                />
               <TextField
  label="Work Hours"
  type="number"
  value={instructor.workHours}
  onChange={(e) => handleWorkHoursChange(instructorIndex, e.target.value)}
  fullWidth
  margin="normal"
  onClick={clearErrorMessage}
/>

<TextField
  label="PTO"
  type="number"
  value={instructor.PTO}
  onChange={(e) => handlePTOChange(instructorIndex, e.target.value)}
  fullWidth
  margin="normal"
  onClick={clearErrorMessage}
/>

<TextField
  label="Instruction %"
  type="number"
  value={instructor.instructionPercentage}
  onChange={(e) => handleInstructionPercentageChange(instructorIndex, e.target.value)}
  fullWidth
  margin="normal"
  onClick={clearErrorMessage}
                />
<TextField
  label="Classrooms"
  placeholder="Enter classrooms separated by ','"
  value={classroomInputs[instructorIndex]}
  onChange={(e) => handleClassroomChange(instructorIndex, e.target.value)}
  fullWidth
  margin="normal"
  onClick={clearErrorMessage}
/>

<TextField
  label="Courses"
  placeholder="Enter courses separated by ','"
  value={courseInputs[instructorIndex]}
  onChange={(e) => handleCourseChange(instructorIndex, e.target.value)}
  fullWidth
  margin="normal"
  onClick={clearErrorMessage}
/>





              </div>
            </div>
          </div>
        ))}
        <div className='flex w-full justify-end'><Button  variant="contained"  style={{
                      backgroundColor: '#4e598c' }} onClick={handleInstructorAdd}>
            <FontAwesomeIcon icon={faPlus} />
          <p className='mx-2'>Add Instructor</p>
        </Button></div>
        <div className='flex w-full justify-end mt-4'>
         
          <Button variant="contained" style={{ backgroundColor: '#218380' }} onClick={handleNext}>
            Next
          </Button>
        </div>
      </div>

      </div>
    );
  };

  const renderCoursesForm = () => {
    return (
      <div>
        {/* Input for Courses */}
        <div className="mb-8">
          <div className="flex flex-col mb-4">
            <Typography variant="h5" sx={{ fontWeight: 500 }}>Courses</Typography>
            <hr className="w-full mt-2 border border-neutral-300 border rounded-lg" />
          </div>
          {courses.map((course, index) => (
            <div key={index} className="mb-4">
              <div className="grid grid-cols-2 gap-4" style={{ gridTemplateColumns: '1fr 6fr' }}>
                <div>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Course {index + 1}</Typography>
                </div>
                <div>
                <TextField
  label="Name"
  value={course.name}
  onChange={(e) => handleCoursePropertyChange(index, 'name', e.target.value)}
  fullWidth
  margin="normal"
  onClick={clearErrorMessage}
/>

<TextField
  label="Class Hours"
  type="number"
  value={course.classHours}
  onChange={(e) => handleCoursePropertyChange(index, 'classHours', e.target.value)}
  fullWidth
  margin="normal"
  onClick={clearErrorMessage}
/>

<TextField
  label="Number of Instructors"
  type="number"
  value={course.numberOfInstructors}
  onChange={(e) => handleCoursePropertyChange(index, 'numberOfInstructors', e.target.value)}
  fullWidth
  margin="normal"
  onClick={clearErrorMessage}
/>

<TextField
  label="Start Date"
  type="date"
  value={course.startDate}
  onChange={(e) => handleCoursePropertyChange(index, 'startDate', e.target.value)}
  fullWidth
  margin="normal"
  InputLabelProps={{
    shrink: true,
  }}
  InputProps={{
    placeholder: '',
  }}
/>

<TextField
  label="End Date"
  type="date"
  value={course.endDate}
  onChange={(e) => handleCoursePropertyChange(index, 'endDate', e.target.value)}
  fullWidth
  margin="normal"
  InputLabelProps={{
    shrink: true,
  }}
  InputProps={{
    placeholder: '',
  }}
/>

<TextField
  label="Classrooms"
  value={course.classrooms}
  onChange={(e) => handleCoursePropertyChange(index, 'classrooms', e.target.value)}
  fullWidth
  margin="normal"
  onClick={clearErrorMessage}
/>

                  <div className="flex items-center space-x-2">
                  <Checkbox
  checked={course.showInstructorNames}
  onClick={clearErrorMessage}
  onChange={(e) => handleCoursePropertyChange(index, 'showInstructorNames', e.target.checked)}
/>

                    <Typography variant="body1">Show Instructor Names</Typography>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className='flex w-full justify-end'>
            <Button variant="contained" style={{ backgroundColor: '#4e598c' }} onClick={() => setCourses([...courses, { name: '' }])}>
               <FontAwesomeIcon icon={faPlus} />
              <p className='mx-2'>Add Course</p>
            </Button>
          </div>
          <div className='flex w-full justify-between mt-4'>
            <Button variant="outlined" onClick={handlePrev}>
              Back
            </Button>
            <Button variant="contained" style={{ backgroundColor: '#218380' }} onClick={handleNext}>
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  };
  

  const renderOtherParamsForm = () => {
    return (
      <div>
        {/* Input for Other Parameters */}
        <div className='mb-8'>
          <div className="flex flex-col  mb-4">
            <Typography variant="h5" sx={{fontFamily: 'Francois One, sans-serif !important;'}}>Other Parameters</Typography>
            <hr className="w-full mt-2 border border-neutral-300 border rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4" style={{ gridTemplateColumns: '1fr 5fr' }}>
          <div>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Other Information</Typography>
          </div>
          {/* Off Dates / Times */}
          <div>
            {otherParams.offDates.map((offDate, index) => (
              <div key={index} className="flex space-x-2">
                <TextField
                  label="Date"
                  type="date"
                  value={offDate.date}
                  onChange={(e) => handleOffDateChange(index, 'date', e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                {offDate.date && (
                  <TextField
                    label="Time"
                    type="time"
                    value={offDate.time}
                    onChange={(e) => handleOffDateChange(index, 'time', e.target.value)}
                  />
                )}
                <Button variant="outlined" onClick={() => handleRemoveOffDate(index)}>
                  Remove
                </Button>
              </div>
            ))}
            <Button variant="contained" onClick={handleAddOffDate}>
              Add Off Date
            </Button>
  
            {/* Exclude Weekends */}
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={otherParams.excludeWeekends}
                onChange={() => handleOtherParamsChange('excludeWeekends', !otherParams.excludeWeekends)}
                onClick={clearErrorMessage}
              />
              <Typography variant="body1">Exclude Weekends</Typography>
            </div>
  
            {/* Percentage Priority */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Percentage Priority</InputLabel>
              <Select
                value={otherParams.percentagePriority}
                onChange={(e) => handleOtherParamsChange('percentagePriority', e.target.value)}
              >
                <MenuItem value="Force Percentage">Force Percentage</MenuItem>
                <MenuItem value="Distribute Evenly">Distribute Evenly</MenuItem>
                <MenuItem value="Instructor Priority">Instructor Priority</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
  
        <Button onClick={handleFormSubmit}>
          <p style={{ backgroundColor: '#218380' }} className="text-white px-4 py-2 rounded">
            Submit
          </p>
        </Button>
      </div>
    );
  };


  
  
  return (
    <div  className='bg-set w-full  h-full flex justify-center items-start py-6 mx-auto'>
     
          {formSubmitted ? (
           
            <SchedulerResult />
      ) : (
          <div className='flex lg:flex-row flex-col justify-center items-center lg:items-start lg:space-x-6 lg:space-y-0 space-y-6'>
            
            <div className='content glass-effect  lg:w-[30%] mt-[5%] p-6 bg-white rounded-lg border border-2-gray' style={{
              animation: 'bounce 4s infinite',
            boxShadow: '1px 6px 17px 4px rgba(140, 136, 136, 0.75)',
            WebkitBoxShadow: '1px 6px 17px 4px rgba(140, 136, 136, 0.75)',
            MozBoxShadow: '1px 6px 17px 4px rgba(140, 136, 136, 0.75)'
          }} >
  <div className="mb-4">
  <Typography
        variant="h4"
        component="span"
        sx={{
          fontFamily: 'Francois One, sans-serif !important;',
          color: '#218380',
          fontWeight: 'bold',
          fontSize: "30",
          textShadow: '2px 2px 4px rgba(33, 131, 128, 0.5)',
          '@media (max-width: 600px)': {
            fontSize: '24px',
          },
        }}
                >
                  <ReactTyped
          strings={["Your one-stop solution for hassle-free scheduling!", "Effortless planning, seamless scheduling – your all-in-one solution", "Scheduling made smart, your ultimate solution for a stress-free agenda", "Scheduling made easy, solutions made simple – your stress-free planning partner"]}
          typeSpeed={50}
          backSpeed={30}
          backDelay={1000}
          showCursor
          cursorChar="|"
          loop
                  />
                  </Typography>
  </div>
  <Stepper  orientation={isSmallScreen ? 'horizontal' : 'vertical'} activeStep={step - 1} connector={<QontoConnector />}>
    {steps.map((label) => (
      <Step key={label}>
        <StepLabel sx={{ fontSize: `20 !important` }} StepIconComponent={QontoStepIcon}>{label}</StepLabel>
      </Step>
    ))}
  </Stepper>
</div>

<div className="content glass-effect p-6 w-full lg:w-[60%] rounded-lg" style={{
            boxShadow: '1px 6px 17px 4px rgba(140, 136, 136, 0.75)',
            WebkitBoxShadow: '1px 6px 17px 4px rgba(140, 136, 136, 0.75)',
            MozBoxShadow: '1px 6px 17px 4px rgba(140, 136, 136, 0.75)'
          }}>
                <Typography variant="h4" gutterBottom sx={{fontFamily: 'Francois One, sans-serif !important;'}}>
                  Enter Parameters
                </Typography>
          
                  <div className='p-3'>
                  {renderBreadcrumbs()}
                  </div>
               
          
          
          
                  {/* Render the form based on the current step */}
                  <div className='mt-2 mb-4'>
                  {errorMessage && (
              <Alert severity="error">{errorMessage}</Alert>
            )}
                    {renderFormStep()}
                    </div>
          
                </div>
          </div>
           
            
              
          )}
      </div>
      
   
  );
};

export default InputPage;
