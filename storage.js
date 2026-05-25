/* =========================
   USUARIOS
========================= */

if(!localStorage.getItem("users")){

    const users = [

        {
            id:1,
            name:"Administrador",
            email:"admin@barberchamos.com",
            password:"admin123",
            role:"admin",
            active:true
        }

    ];

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

}

/* =========================
   SERVICIOS
========================= */

if(!localStorage.getItem("services")){

    const services = [

        {
            id:1,
            nombre:"Corte Fade",
            precio:30000,
            tiempo:40,
            imagen:"https://images.unsplash.com/photo-1621605815971-fbc98d665033"
        },

        {
            id:2,
            nombre:"Perfilado de barba",
            precio:20000,
            tiempo:20,
            imagen:"https://images.unsplash.com/photo-1585747860715-2ba37e788b70"
        },

        {
            id:3,
            nombre:"Cejas",
            precio:10000,
            tiempo:10,
            imagen:""
        },

        {
            id:4,
            nombre:"Pigmentación",
            precio:35000,
            tiempo:50,
            imagen:""
        }

    ];

    localStorage.setItem(
        "services",
        JSON.stringify(services)
    );

}

/* =========================
   BARBEROS
========================= */

if(!localStorage.getItem("barbers")){

    const barbers = [

        {
            id:1,
            nombre:"Alejandro",
            especialidad:"Fades",
            imagen:"https://i.imgur.com/UP6vG7x.png"
        },

        {
            id:2,
            nombre:"Camilo",
            especialidad:"Barbas",
            imagen:"https://i.imgur.com/UP6vG7x.png"
        },

        {
            id:3,
            nombre:"Santiago",
            especialidad:"Cortes clásicos",
            imagen:"https://i.imgur.com/UP6vG7x.png"
        }

    ];

    localStorage.setItem(
        "barbers",
        JSON.stringify(barbers)
    );

}

/* =========================
   CITAS
========================= */

if(!localStorage.getItem("appointments")){

    localStorage.setItem(
        "appointments",
        JSON.stringify([])
    );

}

/* =========================
   ALERTA GLOBAL
========================= */

function showAlert(msg){

    const alert =
    document.getElementById(
        "customAlert"
    );

    alert.innerHTML = msg;

    alert.classList.add("show");

    setTimeout(()=>{

        alert.classList.remove("show");

    }, 3000);

}
