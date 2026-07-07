"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import styles from "./perfil.module.css";
import { Servicio } from "../../types/Servicios";

import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
} from "firebase/firestore";


export default function PerfilPage() {

  const { user } = useAuth();
  const router = useRouter();

  const [services, setServicios] = useState<Servicio[]>([]);
  const [search, setSearch] = useState("");


  useEffect(() => {

    if (!user) {
      router.replace("/login");
    }

  }, [user, router]);




  // Cargar servicios desde Firebase
  useEffect(() => {

    const cargarServicios = async () => {

      try {

        const snapshot = await getDocs(
          collection(db, "servicios")
        );


        const datos = snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data()
          })
        ) as Servicio[];


        setServicios(datos);


      } catch (error) {

        console.error(
          "Error cargando servicios:",
          error
        );

      }

    };


    cargarServicios();


  }, []);




  const esAdmin = user?.role === "admin";



  const misSolicitudes = useMemo(() => {


    const filtered = esAdmin

      ? services

      : services.filter(
          (s) =>
            s.clienteNombre === user?.nombre &&
            s.clienteRut === user?.rut
        );



    if (!search.trim()) {
      return filtered;
    }



    const q = search.toLowerCase();



    return filtered.filter(
      (s) =>
        s.nombre
          .toLowerCase()
          .includes(q)

        ||

        s.descripcion
          .toLowerCase()
          .includes(q)
    );



  }, [
    search,
    services,
    esAdmin,
    user?.nombre,
    user?.rut
  ]);





  if (!user) return null;




  return (

    <main className={styles.container}>


      <header className={styles.header}>

        <h1>
          Mi Perfil
        </h1>

      </header>





      <section className={styles.profileCard}>


        <h2>
          Información Personal
        </h2>



        <div className={styles.infoGrid}>


          <div>

            <label>
              Nombre
            </label>

            <p>
              {user.nombre} {user.apellido}
            </p>

          </div>



          <div>

            <label>
              Email
            </label>

            <p>
              {user.email}
            </p>

          </div>



          <div>

            <label>
              RUT
            </label>

            <p>
              {user.rut}
            </p>

          </div>



          <div>

            <label>
              Teléfono
            </label>

            <p>
              {user.telefono}
            </p>

          </div>


        </div>


      </section>







      <section className={styles.section}>


        <div className={styles.searchRow}>


          <h2>
            Mis Solicitudes ({misSolicitudes.length})
          </h2>



          <input

            type="search"

            placeholder="Buscar mis solicitudes..."

            value={search}

            onChange={(event)=>
              setSearch(
                event.target.value
              )
            }

            className={styles.searchInput}

          />


        </div>







        {
          misSolicitudes.length === 0

          ?

          <p className={styles.emptyState}>
            No tienes solicitudes aún.
          </p>


          :



          <div className={styles.listContainer}>


            <div className={styles.listHeader}>


              <span>
                Servicio
              </span>


              <span>
                Trabajador
              </span>


              <span>
                Estado
              </span>


              <span>
                Duración
              </span>


              <span>
                Precio
              </span>


            </div>






            {
              misSolicitudes.map(
                (servicio)=>(


                <div
                  key={servicio.id}
                  className={styles.listRow}
                >



                  <div
                    className={styles.singleLine}
                  >

                    <strong>
                      {servicio.nombre}
                    </strong>


                    <p>
                      {servicio.descripcion}
                    </p>


                  </div>




                  <span>
                    {
                      servicio.trabajador ||
                      "Sin asignar"
                    }
                  </span>




                  <span>
                    {servicio.estado}
                  </span>




                  <span>
                    {
                      servicio.duracion ||
                      "-"
                    }
                  </span>




                  <span>

                    {
                      servicio.precio > 0

                      ?

                      `$${servicio.precio.toLocaleString()}`

                      :

                      "-"
                    }

                  </span>



                </div>


              ))
            }



          </div>


        }



      </section>



    </main>


  );


}