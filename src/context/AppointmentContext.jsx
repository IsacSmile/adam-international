import React, { createContext, useContext, useState, useCallback } from 'react';

const AppointmentContext = createContext(null);

export function AppointmentProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    service: '',
    country: '',
    university: '',
    branch: '',
  });

  const openAppointment = useCallback((data = {}) => {
    setAppointmentData({
      service: data.service || '',
      country: data.country || '',
      university: data.university || '',
      branch: data.branch || '',
    });
    setIsOpen(true);
  }, []);


  const closeAppointment = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <AppointmentContext.Provider
      value={{
        isOpen,
        appointmentData,
        openAppointment,
        closeAppointment,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointment() {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
}

export function useOptionalAppointment() {
  return useContext(AppointmentContext);
}

