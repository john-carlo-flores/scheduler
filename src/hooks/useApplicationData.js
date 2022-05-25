import { useReducer, useEffect } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

export const useApplicationData = () => {
  const [ state, dispatch ] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  function reducer(state, action) {
    switch(action.type) {
      case SET_DAY:
        return { ...state, day: action.day};
      case SET_APPLICATION_DATA:
        return {
          ...state,
          days: action.days,
          appointments: action.appointments,
          interviewers: action.interviewers
        };
      case SET_INTERVIEW:
        return { 
          ...state,
          appointments: action.appointments,
          days: action.days
        };
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    };
  };

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
    console.log('state.day', state.day);
    console.log('state', state);
    console.log('state.days.', state.days);

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