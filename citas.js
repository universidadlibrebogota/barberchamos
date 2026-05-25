/* =========================
   VARIABLES GLOBALES
========================= */

let selectedServices = [];
let selectedBarber = null;
let selectedTime = null;

/* =========================
   VALIDAR LOGIN
========================= */

function isLoggedIn(){

    const user =
    localStorage.getItem("currentUser");

    return user ? true : false;

}

/* =========================
   SELECCIONAR SERVICIO
========================= */

function selectService(id){

    /* VALIDAR SI HAY SESIÓN */

    if(!isLoggedIn()){

        showAlert(
            "Debes iniciar sesión para agendar"
        );

        openLogin();

        return;

    }

    const services =
    JSON.parse(
        localStorage.getItem("services")
    );

    const service =
    services.find(s => s.id === id);

    const exists =
    selectedServices.find(s => s.id === id);

    const card =
    document.getElementById("service-" + id);

    /* SI YA EXISTE -> QUITAR */

    if(exists){

        selectedServices =
        selectedServices.filter(
            s => s.id !== id
        );

        card.classList.remove("selected");

    }

    /* SI NO EXISTE -> AGREGAR */

    else{

        selectedServices.push(service);

        card.classList.add("selected");

    }

    updateSummary();

}

/* =========================
   ACTUALIZAR RESUMEN
========================= */

function updateSummary(){

    let total = 0;
    let duration = 0;

    selectedServices.forEach(service=>{

        total += service.precio;

        duration += service.tiempo;

    });

    document.getElementById(
        "totalPrice"
    ).innerHTML =
    "$" + total.toLocaleString();

    document.getElementById(
        "totalTime"
    ).innerHTML =
    duration + " min";

}

/* =========================
   SELECCIONAR BARBERO
========================= */

function selectBarber(id){

    selectedBarber = id;

    document
    .querySelectorAll(".booking-barber-card")
    .forEach(card=>{

        card.classList.remove("selected");

    });

    document
    .getElementById("barber-" + id)
    .classList.add("selected");

}

/* =========================
   SELECCIONAR HORA
========================= */

function selectTime(time){

    selectedTime = time;

    document
    .querySelectorAll(".time-slot")
    .forEach(slot=>{

        slot.classList.remove("active");

    });

    /* ID NORMALIZADO (igual que en app.js) */

    const id =
    "time-" + time.replace(/\s|:/g,"-");

    document
    .getElementById(id)
    .classList.add("active");

}

/* =========================
   SIGUIENTE PASO
========================= */

function nextStep(step){

    /* VALIDAR SERVICIOS */

    if(step === 2){

        if(selectedServices.length === 0){

            showAlert(
                "Selecciona al menos un servicio"
            );

            return;

        }

    }

    /* VALIDAR BARBERO */

    if(step === 3){

        if(!selectedBarber){

            showAlert(
                "Selecciona un barbero"
            );

            return;

        }

    }

    /* VALIDAR FECHA Y HORA */

    if(step === 4){

        const date =
        document.getElementById(
            "appointmentDate"
        ).value;

        if(!date || !selectedTime){

            showAlert(
                "Selecciona fecha y hora"
            );

            return;

        }

    }

    /* VALIDAR DATOS Y SESIÓN */

    if(step === 5){

        const name =
        document.getElementById(
            "clientName"
        ).value.trim();

        const email =
        document.getElementById(
            "clientEmail"
        ).value.trim();

        const phone =
        document.getElementById(
            "clientPhone"
        ).value.trim();

        if(!name || !email || !phone){

            showAlert(
                "Completa todos los datos"
            );

            return;

        }

        /* VERIFICAR SESIÓN ANTES DE CONFIRMAR */

        if(!isLoggedIn()){

            showAlert(
                "Debes iniciar sesión para continuar"
            );

            openLogin();

            return;

        }

        generateFinalSummary();

    }

    /* CAMBIAR PANEL */

    document
    .querySelectorAll(".step-panel")
    .forEach(panel=>{

        panel.classList.remove("active");

    });

    document
    .getElementById("step" + step)
    .classList.add("active");

    updateSteps(step);

}

/* =========================
   PASO ANTERIOR
========================= */

function prevStep(step){

    document
    .querySelectorAll(".step-panel")
    .forEach(panel=>{

        panel.classList.remove("active");

    });

    document
    .getElementById("step" + step)
    .classList.add("active");

    updateSteps(step);

}

/* =========================
   ACTUALIZAR PASOS
========================= */

function updateSteps(current){

    const steps =
    document.querySelectorAll(".step");

    steps.forEach((step, index)=>{

        step.classList.remove("active");

        if(index + 1 <= current){

            step.classList.add("active");

        }

    });

}

/* =========================
   GENERAR RESUMEN FINAL
========================= */

function generateFinalSummary(){

    let total = 0;
    let duration = 0;

    const servicesNames =
    selectedServices.map(service=>{

        total += service.precio;

        duration += service.tiempo;

        return service.nombre;

    });

    const barbers =
    JSON.parse(
        localStorage.getItem("barbers")
    );

    const barber =
    barbers.find(
        b => b.id === selectedBarber
    );

    document.getElementById(
        "summaryServices"
    ).innerHTML =
    servicesNames.join(", ");

    document.getElementById(
        "summaryBarber"
    ).innerHTML =
    barber ? barber.nombre : "";

    document.getElementById(
        "summaryDate"
    ).innerHTML =
    document.getElementById(
        "appointmentDate"
    ).value;

    document.getElementById(
        "summaryTime"
    ).innerHTML =
    selectedTime;

    document.getElementById(
        "summaryTotal"
    ).innerHTML =
    "$" + total.toLocaleString();

    document.getElementById(
        "summaryDuration"
    ).innerHTML =
    duration + " min";

}

/* =========================
   CONFIRMAR CITA
========================= */

function confirmAppointment(){

    const user =
    JSON.parse(
        localStorage.getItem("currentUser")
    );

    const appointments =
    JSON.parse(
        localStorage.getItem("appointments")
    ) || [];

    const barbers =
    JSON.parse(
        localStorage.getItem("barbers")
    );

    const barber =
    barbers.find(
        b => b.id === selectedBarber
    );

    let total = 0;
    let duration = 0;

    selectedServices.forEach(s=>{
        total += s.precio;
        duration += s.tiempo;
    });

    const newAppointment = {

        id: Date.now(),

        userId: user.id,
        userName: user.name,
        userEmail: user.email,

        services: selectedServices.map(
            s => s.nombre
        ),

        barberId: selectedBarber,
        barberName: barber ? barber.nombre : "",

        date: document.getElementById(
            "appointmentDate"
        ).value,

        time: selectedTime,

        total,
        duration,

        status: "pendiente",

        createdAt: new Date().toISOString()

    };

    appointments.push(newAppointment);

    localStorage.setItem(
        "appointments",
        JSON.stringify(appointments)
    );

    showAlert(
        "¡Cita agendada correctamente!"
    );

    /* RESETEAR */

    selectedServices = [];

    selectedBarber = null;

    selectedTime = null;

    /* VOLVER AL PASO 1 */

    setTimeout(()=>{

        document
        .querySelectorAll(
            ".booking-service-card, .booking-barber-card"
        )
        .forEach(el=>{
            el.classList.remove("selected");
        });

        document
        .querySelectorAll(".time-slot")
        .forEach(el=>{
            el.classList.remove("active");
        });

        document.getElementById(
            "appointmentDate"
        ).value = "";

        updateSummary();

        prevStep(1);

    }, 1500);

}
