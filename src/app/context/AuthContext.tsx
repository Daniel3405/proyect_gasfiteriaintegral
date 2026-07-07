"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";

import { auth } from "@/lib/firebase";


type UserSession = {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  rut?: string;
  role: string;
};


type AuthContextType = {

  user: UserSession | null;

  isLoading: boolean;

  login(
    email:string,
    password:string
  ): Promise<boolean>;


  register(
    nombre:string,
    apellido:string,
    email:string,
    telefono:string,
    rut:string,
    password:string
  ): Promise<boolean>;


  logout():Promise<void>;

};



const AuthContext =
createContext<AuthContextType | undefined>(undefined);





export function AuthProvider({
  children
}:{
  children:ReactNode
}){


  const [user,setUser] =
    useState<UserSession | null>(null);


  const [isLoading,setIsLoading] =
    useState(true);





  useEffect(()=>{


    const unsubscribe =
      onAuthStateChanged(
        auth,
        (firebaseUser)=>{


          if(firebaseUser){


            setUser({

              nombre:
                firebaseUser.displayName || "",

              apellido:"",

              email:
                firebaseUser.email || "",

              role:
                firebaseUser.email ===
                "admin@gasfiteria.com"
                ?
                "admin"
                :
                "cliente"

            });


          }else{


            setUser(null);


          }


          setIsLoading(false);


        }
      );



    return ()=>unsubscribe();



  },[]);







  const login = async(
    email:string,
    password:string
  )=>{


    try{


      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );


      return true;



    }catch(error){


      console.log(error);

      return false;


    }


  };









  const register = async(
    nombre:string,
    apellido:string,
    email:string,
    telefono:string,
    rut:string,
    password:string
  )=>{


    try{


      const result =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );



      await updateProfile(
        result.user,
        {
          displayName:nombre
        }
      );



      return true;



    }catch(error){


      console.log(error);

      return false;


    }


  };








  const logout = async()=>{


    await signOut(auth);


  };







  const value = useMemo(()=>({

    user,

    isLoading,

    login,

    register,

    logout


  }),[
    user,
    isLoading
  ]);







  return (

    <AuthContext.Provider value={value}>

      {children}

    </AuthContext.Provider>

  );


}







export function useAuth(){


  const context =
    useContext(AuthContext);



  if(!context){


    throw new Error(
      "useAuth debe estar dentro de AuthProvider"
    );


  }



  return context;


}