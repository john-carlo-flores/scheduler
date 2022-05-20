export const getAppointmentsForDay = (state, day) => {
  if (state.days.length === 0) return [];

  const appointmentList = state.days.find(d => d.name === day);
  if (!appointmentList) return [];

  const filteredAppointments = Object.values(state.appointments).filter(appointment => appointmentList.appointments.includes(appointment.id));
  return filteredAppointments;
};

export const getInterview = (state, interview) => {
  if (!interview) return null;

  const interviewer = state.interviewers[interview.interviewer];
  if (!interviewer) return null;

  return { ...interview, interviewer};
};