"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import styles from "./servicios.module.css";

import type { Trabajador } from "../../types/Trabajador";

import {
  Servicio,
  ServicioFormState,
  initialFormState,
} from "../../types/Servicios";

import { db } from "@/lib/firebase";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";


export default function ServiciosPage() {

  const { user } = useAuth();
  const router = useRouter();

  const esAdmin = user?.role === "admin";


  const [services, setServicios] =
    useState<Servicio[]>([]);


  const [trabajadores, setTrabajadores] =
    useState<Trabajador[]>([]);


  const [form, setForm] =
    useState<ServicioFormState>(
      initialFormState
    );


  const [search, setSearch] =
    useState("");


  const [editingId, setEditingId] =
    useState<string | null>(null);


  const [error, setError] =
    useState("");



  useEffect(() => {

    if (!user) {
      router.replace("/login");
      return;
    }

    cargarServicios();
    cargarTrabajadores();


  }, [user]);





  const cargarServicios = async () => {

    try {

      const snapshot = await getDocs(
        collection(db,"servicios")
      );


      const lista: Servicio[] =
        snapshot.docs.map((docu)=>{

          const data = docu.data();


          return {

            id: docu.id,

            nombre:
              data.nombre || "",

            descripcion:
              data.descripcion || "",

            clienteNombre:
              data.clienteNombre || "",

            clienteRut:
              data.clienteRut || "",

            clienteTelefono:
              data.clienteTelefono || "",

            precio:
              data.precio || 0,

            duracion:
              data.duracion || "",

            estado:
              data.estado || "Pendiente",

            trabajador:
              data.trabajador || "",

            garantia:
              data.garantia || "Sin garantía",

          };

        });


      setServicios(lista);


    } catch(error){

      console.error(
        "Error cargando servicios",
        error
      );

    }

  };






  const cargarTrabajadores = async () => {


    try {


      const snapshot =
        await getDocs(
          collection(db,"trabajadores")
        );



      const lista: Trabajador[] =
        snapshot.docs.map((docu)=>{


          const data = docu.data();



          return {

            id: docu.id,

            nombre:
              data.nombre || "",


            apellido:
              data.apellido || "",


            telefono:
              data.telefono || "",


            especialidad:
              data.especialidad || "",


            correo:
              data.correo || "",


            estado:
              data.estado || "Activo",


          };


        });



      setTrabajadores(lista);



    } catch(error){

      console.error(
        "Error cargando trabajadores",
        error
      );

    }


  };






  useEffect(()=>{


    if(
      !esAdmin &&
      user
    ){

      setForm((prev)=>({

        ...prev,

        clienteNombre:
          user.nombre || "",


        clienteRut:
          user.rut || "",


        clienteTelefono:
          user.telefono || "",


      }));

    }


  },[
    user,
    esAdmin
  ]);






  const filteredServices =
    useMemo(()=>{


      const visibles =
        esAdmin

        ?

        services

        :

        services.filter(
          (s)=>
            s.clienteNombre === user?.nombre &&
            s.clienteRut === user?.rut
        );



      if(!search.trim())
        return visibles;



      const q =
        search.toLowerCase();



      return visibles.filter(
        (s)=>

          s.nombre
          .toLowerCase()
          .includes(q)

          ||

          s.descripcion
          .toLowerCase()
          .includes(q)

      );



    },[
      services,
      search,
      esAdmin,
      user
    ]);
  const handleChange = (
    field: keyof ServicioFormState,
    value: string | number
  ) => {

    setForm((prev)=>({

      ...prev,

      [field]: value,

    }));

  };





  const resetForm = ()=>{

    setForm(initialFormState);

    setEditingId(null);

    setError("");

  };







  const handleSubmit = async (
    event: React.SyntheticEvent<HTMLFormElement>
  )=>{

    event.preventDefault();

    setError("");



    if(
      !form.nombre.trim() ||
      !form.descripcion.trim()
    ){

      setError(
        "Completa nombre y descripción."
      );

      return;

    }



    const nuevoServicio = {


      nombre:
        form.nombre.trim(),


      descripcion:
        form.descripcion.trim(),


      clienteNombre:
        form.clienteNombre.trim(),


      clienteRut:
        form.clienteRut.trim(),


      clienteTelefono:
        form.clienteTelefono.trim(),


      precio:
        esAdmin
        ? Number(form.precio)
        : 0,


      duracion:
        esAdmin
        ? form.duracion
        : "",


      estado:
        esAdmin
        ? form.estado
        : "Solicitud",


      trabajador:
        esAdmin
        ? form.trabajador
        : "",


      garantia:
        esAdmin
        ? form.garantia
        : "Sin garantía",


    };




    try {


      if(editingId){


        await updateDoc(
          doc(
            db,
            "servicios",
            editingId
          ),

          nuevoServicio

        );


        alert(
          "Servicio actualizado"
        );


      }else{


        await addDoc(
          collection(
            db,
            "servicios"
          ),

          nuevoServicio

        );


        alert(
          "Solicitud enviada"
        );


      }



      resetForm();

      cargarServicios();



    }catch(error){


      console.error(error);


      alert(
        "Error al guardar servicio"
      );


    }


  };







  const handleEdit = (
    servicio: Servicio
  )=>{


    setEditingId(
      servicio.id
    );



    setForm({

      nombre:
        servicio.nombre,


      descripcion:
        servicio.descripcion,


      clienteNombre:
        servicio.clienteNombre,


      clienteRut:
        servicio.clienteRut,


      clienteTelefono:
        servicio.clienteTelefono,


      precio:
        servicio.precio,


      duracion:
        servicio.duracion,


      estado:
        servicio.estado,


      trabajador:
        servicio.trabajador,


      garantia:
        servicio.garantia,


    });


  };







  const handleDelete = async(
    id:string
  )=>{


    if(
      !confirm(
        "¿Eliminar servicio?"
      )
    )
      return;



    try{


      await deleteDoc(
        doc(
          db,
          "servicios",
          id
        )
      );


      alert(
        "Servicio eliminado"
      );


      cargarServicios();



    }catch(error){


      console.error(error);


    }


  };







  return (

    <main className={styles.container}>


      <header className={styles.header}>

        <h1>
          Gestión de servicios
        </h1>

        <p>
          Usuario:
          {" "}
          {user?.nombre}
          {" "}
          {user?.apellido}
        </p>


      </header>





      <section className={styles.section}>


        <h2>

          {
            esAdmin
            ?
            "Crear servicio"
            :
            "Solicitar servicio"
          }

        </h2>




        <form
          onSubmit={handleSubmit}
          className={styles.form}
        >



          {!esAdmin && (

            <>


              <label>
                Nombre
              </label>

              <input

                value={
                  form.clienteNombre
                }

                onChange={(e)=>
                  handleChange(
                    "clienteNombre",
                    e.target.value
                  )
                }

                className={styles.input}

              />



              <label>
                RUT
              </label>


              <input

                value={
                  form.clienteRut
                }

                onChange={(e)=>
                  handleChange(
                    "clienteRut",
                    e.target.value
                  )
                }

                className={styles.input}

              />



              <label>
                Teléfono
              </label>


              <input

                value={
                  form.clienteTelefono
                }

                onChange={(e)=>
                  handleChange(
                    "clienteTelefono",
                    e.target.value
                  )
                }

                className={styles.input}

              />


            </>

          )}






          <label>
            Nombre Servicio
          </label>


          <input

            value={
              form.nombre
            }

            onChange={(e)=>
              handleChange(
                "nombre",
                e.target.value
              )
            }

            className={styles.input}

          />





          <label>
            Descripción
          </label>


          <textarea

            value={
              form.descripcion
            }

            onChange={(e)=>
              handleChange(
                "descripcion",
                e.target.value
              )
            }

            className={styles.textarea}

          />





          {esAdmin && (

            <>


              <label>
                Trabajador
              </label>


              <select

                value={
                  form.trabajador
                }

                onChange={(e)=>
                  handleChange(
                    "trabajador",
                    e.target.value
                  )
                }

                className={styles.input}

              >

                <option value="">
                  Seleccione trabajador
                </option>


                {
                  trabajadores.map(
                    (trabajador)=>(

                      <option

                        key={
                          trabajador.id
                        }

                        value={
                          `${trabajador.nombre} ${trabajador.apellido}`
                        }

                      >

                        {
                          trabajador.nombre
                        }
                        {" "}
                        {
                          trabajador.apellido
                        }

                      </option>

                    )
                  )
                }


              </select>




              <label>
                Precio
              </label>


              <input

                type="number"

                value={
                  form.precio
                }

                onChange={(e)=>
                  handleChange(
                    "precio",
                    Number(
                      e.target.value
                    )
                  )
                }

                className={styles.input}

              />




            </>

          )}






          {error && (

            <p className={styles.errorText}>
              {error}
            </p>

          )}






          <button

            type="submit"

            className={
              styles.buttonPrimary
            }

          >

            {
              editingId
              ?
              "Actualizar"
              :
              esAdmin
              ?
              "Crear servicio"
              :
              "Enviar solicitud"
            }


          </button>



        </form>


      </section>







      <section>


        <h2>
          Listado de servicios
        </h2>



        <input

          placeholder="Buscar..."

          value={search}

          onChange={(e)=>
            setSearch(
              e.target.value
            )
          }

          className={
            styles.searchInput
          }

        />





        {
          filteredServices.map(
            (servicio)=>(


              <article
                key={
                  servicio.id
                }
                className={
                  styles.card
                }
              >


                <h3>
                  {
                    servicio.nombre
                  }
                </h3>


                <p>
                  {
                    servicio.descripcion
                  }
                </p>


                {
                  esAdmin && (

                    <>


                      <p>
                        Cliente:
                        {" "}
                        {
                          servicio.clienteNombre
                        }
                      </p>


                      <p>
                        Estado:
                        {" "}
                        {
                          servicio.estado
                        }
                      </p>



                      <button

                        onClick={()=>
                          handleEdit(
                            servicio
                          )
                        }

                        className={
                          styles.buttonPrimary
                        }

                      >

                        Editar

                      </button>




                      <button

                        onClick={()=>
                          handleDelete(
                            servicio.id
                          )
                        }

                        className={
                          styles.buttonDanger
                        }

                      >

                        Eliminar

                      </button>


                    </>

                  )
                }


              </article>


            )
          )
        }



      </section>



    </main>

  );


}