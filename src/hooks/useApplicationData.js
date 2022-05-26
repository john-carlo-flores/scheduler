import { useReducer, useEffect } from "react";
import axios from "axios";
import reducer, { SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW } from "reducers/application";

export const useApplicationData = () => {
  const [ state, dispatch ] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
    ws: null
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
          days: updateSpots(appointments)
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
          days: updateSpots(appointments)
        });
      });
  };

  const updateSpots = (appointments) => {
    const day = state.days.find(day => day.name === state.day);
    const spots = day.appointments.filter(id => !appointments[id].interview).length;

    return state.days.map(day => 
      state.day === day.name ? { ...day, spots } : { ...day }
    );
  };
  
  useEffect(() => {
    state.ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

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

    return () => {
      state.ws.close();
      state.ws = null;
    }
  }, []);

  useEffect(() => {
    state.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const { type, id, interview } = data;

      if (type === "SET_INTERVIEW") {
        const appointment = {
          ...state.appointments[id],
          interview: interview ? {...interview} : null
        };
        
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };

        dispatch({
          type: SET_INTERVIEW,
          appointments,
          days: updateSpots(appointments, id)
        });
      }
    }
  }, [state.appointments])

  return { state, setDay, bookInterview, cancelInterview };
};