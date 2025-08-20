import React, { createContext, useState } from 'react';


export const AuthContextPatient = createContext(null);


export function AuthProviderPatient({ children }) {
  const [patient, setPatient] = useState(null); 
  return (
    <AuthContextPatient.Provider value={{ patient, setPatient }}>
      {children}
    </AuthContextPatient.Provider>
  );
}
