if(!localStorage.getItem("users")){
    const users = [
        {
            id:1,
            name:"Administrador",
            email:"admin@barberchamos.com",
            password:"admin123",
            role:"admin",
            active:true,
            phone:"3001234567",
            createdAt: new Date().toISOString()
        },
        {
            id:2,
            name:"Alejandro Ríos",
            email:"alejandro@barberchamos.com",
            password:"barbero123",
            role:"barbero",
            active:true,
            phone:"3111111111",
            createdAt: new Date().toISOString()
        },
        {
            id:3,
            name:"Camilo Torres",
            email:"camilo@barberchamos.com",
            password:"barbero456",
            role:"barbero",
            active:true,
            phone:"3122222222",
            createdAt: new Date().toISOString()
        },
        {
            id:4,
            name:"Santiago Mora",
            email:"santiago@barberchamos.com",
            password:"barbero789",
            role:"barbero",
            active:true,
            phone:"3133333333",
            createdAt: new Date().toISOString()
        },
        {
            id:5,
            name:"Carlos Pérez",
            email:"carlos@gmail.com",
            password:"cliente123",
            role:"cliente",
            active:true,
            phone:"3144444444",
            createdAt: new Date().toISOString()
        },
        {
            id:6,
            name:"Andrés López",
            email:"andres@gmail.com",
            password:"cliente456",
            role:"cliente",
            active:true,
            phone:"3155555555",
            createdAt: new Date().toISOString()
        },
        {
            id:7,
            name:"Miguel Gómez",
            email:"miguel@gmail.com",
            password:"cliente789",
            role:"cliente",
            active:true,
            phone:"3166666666",
            createdAt: new Date().toISOString()
        }
    ];
    localStorage.setItem("users", JSON.stringify(users));
}
if(!localStorage.getItem("services")){
    const services = [
        { id:1, nombre:"Corte Fade", precio:30000, tiempo:40, descripcion:"Corte degradado moderno con máquina y tijera" },
        { id:2, nombre:"Perfilado de barba", precio:20000, tiempo:20, descripcion:"Definición y perfilado de barba con navaja" },
        { id:3, nombre:"Cejas", precio:10000, tiempo:10, descripcion:"Depilación y diseño de cejas con hilo o navaja" },
        { id:4, nombre:"Pigmentación", precio:35000, tiempo:50, descripcion:"Pigmentación capilar para cubrir zonas sin cabello" }
    ];
    localStorage.setItem("services", JSON.stringify(services));
}
if(!localStorage.getItem("blockedSlots")){
    localStorage.setItem("blockedSlots", JSON.stringify([]));
}
if(!localStorage.getItem("appointments")){
    localStorage.setItem("appointments", JSON.stringify([]));
}
function getBarbers(){
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return users.filter(u => u.role === "barbero" && u.active);
}
function getAllUsers(){
    return JSON.parse(localStorage.getItem("users")) || [];
}
function saveUsers(users){
    localStorage.setItem("users", JSON.stringify(users));
}
function getServices(){
    return JSON.parse(localStorage.getItem("services")) || [];
}
function saveServices(s){
    localStorage.setItem("services", JSON.stringify(s));
}
function getAppointments(){
    return JSON.parse(localStorage.getItem("appointments")) || [];
}
function saveAppointments(a){
    localStorage.setItem("appointments", JSON.stringify(a));
}
function getBlockedSlots(){
    return JSON.parse(localStorage.getItem("blockedSlots")) || [];
}
function saveBlockedSlots(s){
    localStorage.setItem("blockedSlots", JSON.stringify(s));
}
function showAlert(msg, type="success"){
    const alert = document.getElementById("customAlert");
    if(!alert) return;
    alert.innerHTML = msg;
    alert.className = "custom-alert show " + (type === "error" ? "alert-error" : "");
    setTimeout(()=>{ alert.className = "custom-alert"; }, 3000);
}
function showConfirm(msg, onConfirm){
    const modal = document.getElementById("confirmModal");
    const msgEl = document.getElementById("confirmMsg");
    const btnYes = document.getElementById("confirmYes");
    const btnNo = document.getElementById("confirmNo");
    if(!modal) { if(confirm(msg)) onConfirm(); return; }
    msgEl.innerHTML = msg;
    modal.style.display = "flex";
    btnYes.onclick = ()=>{ modal.style.display="none"; onConfirm(); };
    btnNo.onclick = ()=>{ modal.style.display="none"; };
}
function isSlotAvailable(barberId, date, time){
    const appointments = getAppointments();
    const blocked = getBlockedSlots();
    const isBlocked = blocked.some(b =>
        b.barberId == barberId && b.date === date && b.time === time
    );
    if(isBlocked) return false;
    const taken = appointments.some(a =>
        a.barberId == barberId &&
        a.date === date &&
        a.time === time &&
        (a.status === "pendiente" || a.status === "confirmada")
    );
    return !taken;
}
