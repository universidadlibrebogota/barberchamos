/* =========================
   CARGAR DATOS DESDE STORAGE
========================= */

document.addEventListener(
    "DOMContentLoaded",
    initApp
);

function initApp(){

    const services =
    JSON.parse(
        localStorage.getItem("services")
    );

    const barbers =
    JSON.parse(
        localStorage.getItem("barbers")
    );

    /* =========================
       CONTENEDORES
    ========================= */

    const servicesContainer =
    document.getElementById(
        "servicesContainer"
    );

    const bookingServices =
    document.getElementById(
        "bookingServices"
    );

    const barbersContainer =
    document.getElementById(
        "barbersContainer"
    );

    const bookingBarbers =
    document.getElementById(
        "bookingBarbers"
    );

    /* =========================
       SERVICIOS
    ========================= */

    if(servicesContainer){

        services.forEach(service=>{

            servicesContainer.innerHTML += `

            <div class="service-card">

                <h3>${service.nombre}</h3>

                <p>${service.tiempo} min</p>

                <h4>$${service.precio.toLocaleString()}</h4>

            </div>

            `;

        });

    }

    if(bookingServices){

        services.forEach(service=>{

            bookingServices.innerHTML += `

            <div
            class="booking-service-card"
            id="service-${service.id}"
            onclick="selectService(${service.id})">

                <h3>${service.nombre}</h3>

                <p>${service.tiempo} min</p>

                <h4>$${service.precio.toLocaleString()}</h4>

            </div>

            `;

        });

    }

    /* =========================
       BARBEROS
    ========================= */

    if(barbersContainer){

        barbers.forEach(barber=>{

            barbersContainer.innerHTML += `

            <div class="barber-card">

                <img src="${barber.imagen}"
                alt="${barber.nombre}">

                <h3>${barber.nombre}</h3>

            </div>

            `;

        });

    }

    if(bookingBarbers){

        barbers.forEach(barber=>{

            bookingBarbers.innerHTML += `

            <div
            class="booking-barber-card"
            id="barber-${barber.id}"
            onclick="selectBarber(${barber.id})">

                <img src="${barber.imagen}"
                alt="${barber.nombre}">

                <h3>${barber.nombre}</h3>

            </div>

            `;

        });

    }

    /* =========================
       HORARIOS
    ========================= */

    const times = [

        "8:00 AM",
        "9:00 AM",
        "10:00 AM",
        "11:00 AM",
        "1:00 PM",
        "2:00 PM",
        "3:00 PM",
        "4:00 PM"

    ];

    const timeGrid =
    document.getElementById("timeGrid");

    if(timeGrid){

        times.forEach(time=>{

            timeGrid.innerHTML += `

            <div
            class="time-slot"
            id="time-${time.replace(/\s|:/g,'-')}"
            onclick="selectTime('${time}')">

                ${time}

            </div>

            `;

        });

    }

}

/* =========================
   SCROLL AGENDA
========================= */

function scrollToAgenda(){

    document
    .getElementById("agenda")
    .scrollIntoView({
        behavior:"smooth"
    });

}
