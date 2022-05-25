import { useReducer, useEffect } from "react";
import axios from "axios";
import reducer, { SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW } from "reducers/application";

export const useApplicationData = () => {
  const [ state, dispatch ] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => dispatch({ type: SET_DAY, day });

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: {...interview}
    };
    
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
  
    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => {
        dispatch({
          type: SET_INTERVIEW,
          appointments,
          days: updateSpots(appointments, id)
        });
      });
  };

  const cancelInterview = id => {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
  
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
  
    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        dispatch({
          type: SET_INTERVIEW,
          appointments,
          days: updateSpots(appointments, id)
        });
      });
  };

  const updateSpots = (appointments, id) => {
    const dayIndex = state.days.findIndex(day => day.name === state.day);

    const appointmentList = [...state.days[dayIndex].appointments];
    if (id && !appointmentList.includes(id)) appointmentList.push(id);
  
    let spotsRemaining = appointmentList.length;
    appointmentList.forEach(id => {
      if (appointments[id].interview) spotsRemaining--;
    });
  
    const day = {
      ...state.days[dayIndex],
      spots: spotsRemaining
    };
    
    const days = [...state.days];
    days[dayIndex] = day;
  
    return days;
  };
  
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      });
    });
  }, []);

  return { state, setDay, bookInterview, cancelInterview };
};