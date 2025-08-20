import react,{createContext,useState} from 'react';

export const AuthContextDoctor=createContext(null);

export function AuthProviderDoctor({children}){
    const [doctor,setDoctor]=useState(null);

    return(
        <AuthContextDoctor.Provider value={{doctor,setDoctor}}>
            {children}
        </AuthContextDoctor.Provider>
    );
}