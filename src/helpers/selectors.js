export const getAppointmentsForDay = (state, day) => {
  const appointmentList = state.days.find(d => d.name === day);
  if (!appointmentList) return [];

  const filteredAppointments = Object.values(state.appointments).filter(appointment => 
    appointmentList.appointments.includes(appointment.id)
  );
  return filteredAppointments;
};

export const getInterview = (state, interview) => {
  if (!interview) return null;

  const interviewer = state.interviewers[interview.interviewer];
  if (!interviewer) return null;

  return { ...interview, interviewer};
};

export const getInterviewersForDay = (state, day) => {
  const dayObject = state.days.find(d => d.name === day);
  if (!dayObject) return [];

  const filteredInterviewers = Object.values(state.interviewers).filter(interviewer => 
    dayObject.interviewers.includes(interviewer.id)
  );
  return filteredInterviewers;
};