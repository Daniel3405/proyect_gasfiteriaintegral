"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import styles from "./login.module.css";

export default function LoginPage() {

  const [mode, setMode] =
    useState<"login" | "register">("login");

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rut, setRut] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");



  const {
    user,
    login,
    register
  } = useAuth();


  const router = useRouter();




  useEffect(() => {

    if(user){
      router.replace("/dashboard");
    }

  },[
    user,
    router
  ]);





  const validateEmail = (value:string)=>
    /^\S+@\S+\.\S+$/.test(value);



  const validateNombre = (value:string)=>
    /^[A-Za-zÀ-ÿ\s]+$/.test(value);



  const validateApellido = (value:string)=>
    /^[A-Za-zÀ-ÿ\s]+$/.test(value);



  const validateRut = (value:string)=>
    /^[0-9]+[-‐][0-9kK]{1}$/.test(value);



  const validateTelefono = (value:string)=>
    /^[0-9]{8,12}$/.test(value);






  const handleSubmit = async(
    event:React.SyntheticEvent<HTMLFormElement>
  )=>{


    event.preventDefault();

    setError("");




    if(
      !email.trim() ||
      !password.trim() ||
      (
        mode==="register" &&
        (
          !nombre.trim() ||
          !apellido.trim() ||
          !telefono.trim() ||
          !rut.trim() ||
          !confirmPassword.trim()
        )
      )
    ){

      setError(
        "Completa todos los campos obligatorios."
      );

      return;

    }







    if(!validateEmail(email.trim())){

      setError(
        "Ingresa un email válido."
      );

      return;

    }







    if(mode==="register"){



      if(!validateNombre(nombre.trim())){

        setError(
          "Ingresa un nombre válido sin números ni símbolos."
        );

        return;

      }



      if(!validateApellido(apellido.trim())){

        setError(
          "Ingresa un apellido válido sin números ni símbolos."
        );

        return;

      }




      if(!validateRut(rut.trim())){

        setError(
          "Ingresa un RUT válido. Ej: 12345678-9"
        );

        return;

      }




      if(!validateTelefono(telefono.trim())){

        setError(
          "Ingresa un teléfono válido."
        );

        return;

      }




      if(password.length < 6){

        setError(
          "La contraseña debe tener al menos 6 caracteres."
        );

        return;

      }




      if(password !== confirmPassword){

        setError(
          "Las contraseñas no coinciden."
        );

        return;

      }






      const success =
        await register(
          nombre.trim(),
          apellido.trim(),
          email.trim(),
          telefono.trim(),
          rut.trim(),
          password.trim()
        );




      if(!success){

        setError(
          "No se pudo registrar el usuario."
        );

        return;

      }





      router.push("/dashboard");

      return;



    }








    const success =
      await login(
        email.trim(),
        password.trim()
      );





    if(!success){

      setError(
        "Credenciales incorrectas."
      );

      return;

    }





    router.push("/dashboard");



  };







  return (

    <main className={styles.main}>


      <h1 className={styles.title}>

        {
          mode==="login"
          ?
          "Iniciar sesión"
          :
          "Registrar usuario"
        }

      </h1>





      <form
        onSubmit={handleSubmit}
        noValidate
        className={styles.form}
      >




      {
        mode==="register" &&

        <>

          <div className={styles.field}>

            <label>
              Nombre
            </label>


            <input

              type="text"

              value={nombre}

              onChange={(e)=>
                setNombre(e.target.value)
              }

              className={styles.input}

            />

          </div>





          <div className={styles.field}>

            <label>
              Apellido
            </label>


            <input

              type="text"

              value={apellido}

              onChange={(e)=>
                setApellido(e.target.value)
              }

              className={styles.input}

            />

          </div>





          <div className={styles.field}>

            <label>
              Teléfono
            </label>


            <input

              type="tel"

              value={telefono}

              onChange={(e)=>
                setTelefono(e.target.value)
              }

              className={styles.input}

            />

          </div>





          <div className={styles.field}>

            <label>
              RUT
            </label>


            <input

              type="text"

              value={rut}

              onChange={(e)=>
                setRut(e.target.value)
              }

              className={styles.input}

            />

          </div>


        </>

      }





      <div className={styles.field}>

        <label>
          Email
        </label>


        <input

          type="email"

          value={email}

          onChange={(e)=>
            setEmail(e.target.value)
          }

          className={styles.input}

        />


      </div>





      <div className={styles.field}>

        <label>
          Contraseña
        </label>


        <input

          type="password"

          value={password}

          onChange={(e)=>
            setPassword(e.target.value)
          }

          className={styles.input}

        />


      </div>






      {
        mode==="register" &&

        <div className={styles.field}>


          <label>
            Confirmar contraseña
          </label>


          <input

            type="password"

            value={confirmPassword}

            onChange={(e)=>
              setConfirmPassword(
                e.target.value
              )
            }

            className={styles.input}

          />


        </div>

      }







      {
        error &&

        <div className={styles.errorText}>

          {error}

        </div>

      }







      <button
        type="submit"
        className={styles.submitButton}
      >

        {
          mode==="login"
          ?
          "Entrar"
          :
          "Registrarse"
        }

      </button>






      </form>







      <div className={styles.switchRow}>


      {
        mode==="login"

        ?

        <>

        ¿No tienes cuenta?{" "}


        <button

          type="button"

          onClick={()=>{
            setMode("register");
            setError("");
          }}

          className={styles.switchButton}

        >

          Registrarse

        </button>


        </>


        :


        <>


        ¿Ya tienes cuenta?{" "}


        <button

          type="button"

          onClick={()=>{

            setMode("login");
            setError("");

          }}

          className={styles.switchButton}

        >

          Iniciar sesión

        </button>



        </>


      }



      </div>



    </main>

  );

}