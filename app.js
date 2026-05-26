
document.addEventListener("DOMContentLoaded", initApp);
function initApp(){
    const services = getServices();
    const barbers  = getBarbers();
    const servicesContainer = document.getElementById("servicesContainer");
    const bookingServices   = document.getElementById("bookingServices");
    const barbersContainer  = document.getElementById("barbersContainer");
    const bookingBarbers    = document.getElementById("bookingBarbers");
    if(servicesContainer){
        if(services.length === 0){
            servicesContainer.innerHTML = `<p style="color:var(--gray);text-align:center;grid-column:1/-1;">No hay servicios disponibles.</p>`;
        } else {
            services.forEach(service=>{
                servicesContainer.innerHTML += `
                <div class="service-card">
                    <h3>${service.nombre}</h3>
                    <p>${service.tiempo} min · ${service.descripcion || ""}</p>
                    <h4>$${service.precio.toLocaleString()}</h4>
                </div>`;
            });
        }
    }
    if(bookingServices){
        services.forEach(service=>{
            bookingServices.innerHTML += `
            <div class="booking-service-card" id="service-${service.id}" onclick="selectService(${service.id})">
                <h3>${service.nombre}</h3>
                <p>${service.tiempo} min</p>
                <h4>$${service.precio.toLocaleString()}</h4>
            </div>`;
        });
    }
    if(barbersContainer){
        if(barbers.length === 0){
            barbersContainer.innerHTML = `<p style="color:var(--gray);text-align:center;grid-column:1/-1;">Próximamente nuestro equipo.</p>`;
        } else {
            barbers.forEach(barber=>{
                barbersContainer.innerHTML += `
                <div class="barber-card">
                    <div class="barber-avatar">${barber.name.charAt(0)}</div>
                    <h3>${barber.name}</h3>
                </div>`;
            });
        }
    }
    if(bookingBarbers){
        if(barbers.length === 0){
            bookingBarbers.innerHTML = `<p style="color:var(--gray);text-align:center;grid-column:1/-1;">No hay barberos disponibles aún.</p>`;
        } else {
            barbers.forEach(barber=>{
                bookingBarbers.innerHTML += `
                <div class="booking-barber-card" id="barber-${barber.id}" onclick="selectBarber(${barber.id})">
                    <div class="barber-avatar large">${barber.name.charAt(0)}</div>
                    <h3>${barber.name}</h3>
                </div>`;
            });
        }
    }
    const times = ["8:00 AM","9:00 AM","10:00 AM","11:00 AM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM"];
    const timeGrid = document.getElementById("timeGrid");
    if(timeGrid){
        times.forEach(time=>{
            timeGrid.innerHTML += `
            <div class="time-slot" id="time-${time.replace(/\s|:/g,'-')}" onclick="selectTime('${time}')">
                ${time}
            </div>`;
        });
    }
}
function refreshTimeSlots(){
    if(!selectedBarber) return;
    const date = document.getElementById("appointmentDate")?.value;
    if(!date) return;
    const times = ["8:00 AM","9:00 AM","10:00 AM","11:00 AM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM"];
    times.forEach(time=>{
        const id = "time-" + time.replace(/\s|:/g,"-");
        const slot = document.getElementById(id);
        if(!slot) return;
        const available = isSlotAvailable(selectedBarber, date, time);
        if(!available){
            slot.classList.add("unavailable");
            slot.onclick = null;
        } else {
            slot.classList.remove("unavailable");
            slot.onclick = ()=>selectTime(time);
        }
    });
}
function scrollToAgenda(){
    document.getElementById("agenda").scrollIntoView({ behavior:"smooth" });
}
