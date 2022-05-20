export const getAppointmentsForDay = (state, day) => {
  if (state.days.length === 0) return [];

  const appointmentList = state.days.filter(d => d.name === day)[0];
  if (!appointmentList) return [];

  const filteredAppointments = Object.values(state.appointments).filter(appointment => appointmentList.appointments.includes(appointment.id));
  return filteredAppointments;
};
