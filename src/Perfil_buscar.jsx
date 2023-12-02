import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './assets/styles/components/_perfil.scss';
import axios from "axios";
import Cum_mat_vista from "./Cum_mat_vista";
import { GLOBAL } from './assets/js/services';
import Notas_perfil from "./Notas_vista";
import Cards from './components/Cards';

function Perfil_editar_vist() {
    const API_URL = GLOBAL.map((e) => { return e.BASE_URL });
    const [userData, setUserData] = useState(null);
    const params = useParams();
    const [course, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${API_URL}/course/`);
                setCourses(response.data);
            } catch (error) {
                console.error('Error al obtener los datos de los cursos', error);
            }
        };

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${API_URL}/user/profile/${params.id}`);
                if (response.status === 200) {
                    setUserData(response.data);
                } else {
                    console.error("Error al obtener los datos del usuario. Estado de respuesta:", response.status);
                }
            } catch (error) {
                console.error("Error al obtener los datos del usuario:", error.message);
            }
        };

        fetchCourses();
        fetchUserData();
    }, [params.id]);

    return (
        <div className="perfil">
            <div className="cabecera-busqueda">
                {userData && (<img className='imagen' src={userData.imagen} alt="Imagen de perfil de Google" />)}
                <div className="container-datos-user">
                    {userData && (
                        <div>
                            <h1 className="nomP">{userData.nombre}</h1>
                            <h3 className="carP">Ingeniería Informática</h3>
                            <h3 className="corP">{userData.username}</h3>
                        </div>
                    )}

                </div>

            </div>

            <Cum_mat_vista />
            <Notas_perfil />

            <h2 className="cursos-propios">Cursos impartidos: </h2>
            <div className='cards-container'>
                {course.courses && Array.isArray(course.courses) && course.courses
                    .filter(cursos => cursos.id_tutor === params.id) 
                    .map(cursos => (
                        <Cards key={cursos._id} titulo={cursos.nombre} tutor={cursos.nombre_tutor} id={cursos._id} f_fin={cursos.fecha_fin} f_inicio={cursos.fecha_inicio} img={cursos.imagen} h_inicio={cursos.horario} h_fin={""}></Cards>
                    ))}

            </div>
        </div>
    );
}

export default Perfil_editar_vist;
