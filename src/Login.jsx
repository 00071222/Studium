import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import LogoUCA from './assets/img/LogoUCA-blanco.png';
import { useNavigate } from 'react-router-dom';
import { GLOBAL } from './assets/js/services'

export const Login = () => {
    //CREDENCIALES
    const API_URL = GLOBAL.map((e) => { return e.BASE_URL });
    const GOOGLE = GLOBAL.map((e) => { return e.GOOGLE });
    //PARA NAVEGAR AL HOME
    const navigate = useNavigate();
    const redirectHome = () => {
        navigate('/home');
    };
    //EXPRESIONES REGULARES
    const validarEstudiante = (email) => {
        const regex = /^[0-9]{8}/;
        return regex.test(email);
    }

    const realizarPeticionPost = async (data) => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            //console.log("ID MONGO USER:", response.data); //ID DE MONGO
            localStorage.setItem("ID", response.data); //GUARDA EN Local Storage EL ID
            return response.data;
        } catch (error) {
            console.error('Error en la petición:', error);
            throw error;
        }
    }

    const handleCallbackResponse = async (response) => {
        const userObject = jwtDecode(response.credential);
        //console.log(userObject); //DATOS DE GOOGLE

        if (!userObject.hd || userObject.hd !== "uca.edu.sv") {
            //SE DETIENE SI NO ES CORREO UCA
            setMensaje("Inicia sesion con tu cuenta institucional")
            setEstadoBooleano(true);
            return;
        }
        //DATOS QUE SE ENVIAN A LA API
        const emailAsString = String(userObject.email);
        const nameAsString = String(userObject.name);
        const ImagenAsString = String(userObject.picture);
        localStorage.setItem("EMAIL", userObject.email);
        localStorage.setItem("NAME", userObject.name);

        setEstadoBooleano(false);

        if (validarEstudiante(userObject.email)) {
            //ESTUDIANTE
            const formEST = {
                username: emailAsString,
                nombre: nameAsString,
                tipo: 2,
                imagen: ImagenAsString
            };
            try {
                await realizarPeticionPost(formEST);
            } catch (error) {
                console.error("Error al enviar los datos del usuario:", error);
                setMensaje("Error al conectar con la API")
                setEstadoBooleano(true);
            }
            redirectHome(); //LO ENVIAMOS A HOME
        } else {
            //CATEDRATICO
            const formCATE = {
                username: emailAsString,
                nombre: nameAsString,
                tipo: 3,
                imagen: ImagenAsString
            };
            try {
                await realizarPeticionPost(formCATE);
            } catch (error) {
                console.error("Error al enviar los datos del usuario:", error);
                setMensaje("Error al conectar con la API")
                setEstadoBooleano(true);
            }
            redirectHome(); //LO ENVIAMOS A HOME
        }
    }

    useEffect(() => {
        //GOOGLE
        google.accounts.id.initialize({
            client_id: GOOGLE,
            callback: handleCallbackResponse,
        });
        google.accounts.id.renderButton(
            document.getElementById("googleDIV"),
            { theme: "outline", size: "large" },
        );
    }, []);
    //MENSAJES DE ERROR
    const [mensaje, setMensaje] = useState('');
    const [estadoBooleano, setEstadoBooleano] = useState(false);
    //RENDER
    return (
        <div className='login'>
            <h1><b><span className='h1-rosa'>Bienvenidos a </span><span className='h1-azul'>Studium</span></b></h1>
            <article>
                <img src={LogoUCA} alt="Logo-UCA"></img>
                <p>Ingresa utilizando tu cuenta institucional</p>
                <div id='googleDIV' className='googlebtn'></div>
                {
                    estadoBooleano === true &&
                    <div className='alertLogin'>
                        {mensaje}
                    </div>
                }
            </article>
        </div>
    )
}

export default Login;
