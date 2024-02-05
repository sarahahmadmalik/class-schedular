import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
} from '@mui/material';

const StyledTableContainer = styled(TableContainer)({
  marginTop: 16,
  
});

const StyledTableCell = styled(TableCell)(({ hasClasses }) => ({
  backgroundColor: hasClasses ? 'lightgreen' : 'white',
}));

const CustomTableCell = styled(TableCell)(({ theme }) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  fontSize: 14,
}));

const CustomTable = ({ schedule }) => {
  const days = Object.keys(schedule);
  const timeSlots = [...new Set(Object.values(schedule).flatMap(day => Object.keys(day.classes)))];
  const dateArray = schedule.map(item => item.date);
  const formatTime = (timeSlot) => {
    const [start, end] = timeSlot.split('-');
    const formattedStart = `${parseInt(start, 10) % 12 || 12}am`;
    const formattedEnd = `${parseInt(end, 10) % 12 || 12}${parseInt(end, 10) >= 12 ? 'pm' : 'am'}`;
    return `${formattedStart} - ${formattedEnd}`;
  };
  

  return (
    <StyledTableContainer   component={Paper}>
      <Table sx={{
        backgroundColor: "#ECF1F5",
        fontSize: "1.1rem"
      }}>
        <TableHead sx={{
          "& th": {
            color: "white",
            backgroundColor: "#615794",
          },
          "& .MuiTableCell-root": {
            border: '1px solid white'
          }
        }}>
          <TableRow >
            <CustomTableCell>Time Slot</CustomTableCell>
            {dateArray.map((day) => (
              <CustomTableCell key={day}>{ day}</CustomTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {timeSlots.map((timeSlot) => (
            <TableRow key={timeSlot}>
              <CustomTableCell>{formatTime(timeSlot)}</CustomTableCell>
              {days.map((day) => (
                <StyledTableCell
                  key={`${day}-${timeSlot}`}
                  hasClasses={Boolean(schedule[day]?.classes?.[timeSlot])}
                >
                  {schedule[day]?.classes?.[timeSlot]?.map((scheduledClass, index) => (
                    <div key={`${day}-${timeSlot}-${index}`}>
                    {`${scheduledClass.courseName} - ${scheduledClass.instructorName}`}<br /> 
                    {`(${scheduledClass.classroom})`}
                  </div>
                  ))}
                </StyledTableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
};

export default CustomTable;
