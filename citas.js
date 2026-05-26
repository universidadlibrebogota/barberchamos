let selectedServices = [];
let selectedBarber   = null;
let selectedTime     = null;
function isLoggedIn(){
    return !!localStorage.getItem("currentUser");
}
function selectService(id){
    if(!isLoggedIn()){
        showAlert("Debes iniciar sesión para agendar", "error");
        openLogin();
        return;
    }
    const service = getServices().find(s => s.id === id);
    const exists  = selectedServices.find(s => s.id === id);
    const card    = document.getElementById("service-" + id);
    if(exists){
        selectedServices = selectedServices.filter(s => s.id !== id);
        card.classList.remove("selected");
    } else {
        selectedServices.push(service);
        card.classList.add("selected");
    }
    updateSummary();
}
function updateSummary(){
    let total = 0, duration = 0;
    selectedServices.forEach(s=>{ total += s.precio; duration += s.tiempo; });
    document.getElementById("totalPrice").innerHTML = "$" + total.toLocaleString();
    document.getElementById("totalTime").innerHTML  = duration + " min";
}
function selectBarber(id){
    selectedBarber = id;
    document.querySelectorAll(".booking-barber-card").forEach(c=>c.classList.remove("selected"));
    document.getElementById("barber-" + id).classList.add("selected");

    // Reset time selection when barber changes
    selectedTime = null;
    document.querySelectorAll(".time-slot").forEach(s=>s.classList.remove("active"));
}
function selectTime(time){
    selectedTime = time;
    document.querySelectorAll(".time-slot").forEach(s=>s.classList.remove("active"));
    const id = "time-" + time.replace(/\s|:/g,"-");
    document.getElementById(id)?.classList.add("active");
}
function nextStep(step){
    if(step === 2 && selectedServices.length === 0){
        showAlert("Selecciona al menos un servicio", "error"); return;
    }
    if(step === 3 && !selectedBarber){
        showAlert("Selecciona un barbero", "error"); return;
    }
    if(step === 4){
        const date = document.getElementById("appointmentDate").value;
        if(!date || !selectedTime){
            showAlert("Selecciona fecha y hora", "error"); return;
        }
        // Verify availability
        if(!isSlotAvailable(selectedBarber, date, selectedTime)){
            showAlert("Ese horario ya está ocupado, elige otro", "error"); return;
        }
    }
    if(step === 5){
        const name  = document.getElementById("clientName").value.trim();
        const email = document.getElementById("clientEmail").value.trim();
        const phone = document.getElementById("clientPhone").value.trim();
        if(!name || !email || !phone){ showAlert("Completa todos los datos", "error"); return; }
        if(!isLoggedIn()){ showAlert("Debes iniciar sesión para continuar", "error"); openLogin(); return; }
        generateFinalSummary();
    }
    document.querySelectorAll(".step-panel").forEach(p=>p.classList.remove("active"));
    document.getElementById("step" + step).classList.add("active");
    updateSteps(step);
    if(step === 4){
        const user = JSON.parse(localStorage.getItem("currentUser"));
        if(user){
            document.getElementById("clientName").value  = user.name || "";
            document.getElementById("clientEmail").value = user.email || "";
            document.getElementById("clientPhone").value = user.phone || "";
        }
    }
}
function prevStep(step){
    document.querySelectorAll(".step-panel").forEach(p=>p.classList.remove("active"));
    document.getElementById("step" + step).classList.add("active");
    updateSteps(step);
}
function updateSteps(current){
    document.querySelectorAll(".step").forEach((step, index)=>{
        step.classList.toggle("active", index + 1 <= current);
    });
}
function generateFinalSummary(){
    let total = 0, duration = 0;
    const names = selectedServices.map(s=>{ total += s.precio; duration += s.tiempo; return s.nombre; });
    const barber = getBarbers().find(b => b.id === selectedBarber);
    const date   = document.getElementById("appointmentDate").value;
    document.getElementById("summaryServices").innerHTML = names.join(", ");
    document.getElementById("summaryBarber").innerHTML   = barber ? barber.name : "";
    document.getElementById("summaryDate").innerHTML     = date;
    document.getElementById("summaryTime").innerHTML     = selectedTime;
    document.getElementById("summaryTotal").innerHTML    = "$" + total.toLocaleString();
    document.getElementById("summaryDuration").innerHTML = duration + " min";
}
function confirmAppointment(){
    const user   = JSON.parse(localStorage.getItem("currentUser"));
    const barber = getBarbers().find(b => b.id === selectedBarber);
    const date   = document.getElementById("appointmentDate").value;
    if(!isSlotAvailable(selectedBarber, date, selectedTime)){
        showAlert("Lo sentimos, ese horario ya fue tomado", "error"); return;
    }
    let total = 0, duration = 0;
    selectedServices.forEach(s=>{ total += s.precio; duration += s.tiempo; });
    const appointments = getAppointments();
    const newApp = {
        id:        Date.now(),
        userId:    user.id,
        userName:  user.name,
        userEmail: user.email,
        userPhone: user.phone || "",
        services:  selectedServices.map(s => s.nombre),
        serviceIds:selectedServices.map(s => s.id),
        barberId:  selectedBarber,
        barberName:barber ? barber.name : "",
        date, time: selectedTime,
        total, duration,
        status:    "pendiente",
        createdAt: new Date().toISOString()
    };
    appointments.push(newApp);
    saveAppointments(appointments);
    showAlert("¡Cita agendada correctamente!");
    selectedServices = [];
    selectedBarber   = null;
    selectedTime     = null;
    setTimeout(()=>{
        document.querySelectorAll(".booking-service-card, .booking-barber-card").forEach(el=>el.classList.remove("selected"));
        document.querySelectorAll(".time-slot").forEach(el=>el.classList.remove("active","unavailable"));
        document.getElementById("appointmentDate").value = "";
        document.getElementById("clientName").value = "";
        document.getElementById("clientEmail").value = "";
        document.getElementById("clientPhone").value = "";
        updateSummary();
        prevStep(1);
    }, 1500);
}
