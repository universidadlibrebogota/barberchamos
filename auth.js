function openLogin(){
    document.getElementById("loginModal").style.display = "flex";
}
function closeLogin(){
    document.getElementById("loginModal").style.display = "none";
}
function showRegister(){
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "block";
    document.getElementById("modalTitle").innerHTML = "Registrarse";
}
function showLogin(){
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("modalTitle").innerHTML = "Iniciar sesión";
}
function register(){
    const name     = document.getElementById("registerName").value.trim();
    const email    = document.getElementById("registerEmail").value.trim();
    const phone    = document.getElementById("registerPhone").value.trim();
    const password = document.getElementById("registerPassword").value;
    if(!name || !email || !phone || !password){
        showAlert("Completa todos los campos", "error"); return;
    }
    const users = getAllUsers();
    if(users.find(u => u.email === email)){
        showAlert("El correo ya está registrado", "error"); return;
    }
    const newUser = {
        id: Date.now(),
        name, email, phone, password,
        role: "cliente",
        active: true,
        createdAt: new Date().toISOString()
    };
    users.push(newUser);
    saveUsers(users);
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    showAlert("¡Registro exitoso! Bienvenido " + name);
    closeLogin();
    updateNavAuth();
}
function login(){
    const email    = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    if(!email || !password){
        showAlert("Completa todos los campos", "error"); return;
    }
    const users = getAllUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if(!user){
        showAlert("Correo o contraseña incorrectos", "error"); return;
    }
    if(!user.active){
        showAlert("Tu cuenta está desactivada. Contacta al administrador.", "error"); return;
    }
    localStorage.setItem("currentUser", JSON.stringify(user));
    showAlert("¡Bienvenido " + user.name + "!");
    closeLogin();
    updateNavAuth();
    setTimeout(()=>{
        if(user.role === "admin"){
            window.location.href = "dashboard-admin.html";
        } else if(user.role === "barbero"){
            window.location.href = "dashboard-barbero.html";
        } else {
            window.location.href = "dashboard-cliente.html";
        }
    }, 800);
}
function logout(){
    localStorage.removeItem("currentUser");
    showAlert("Sesión cerrada correctamente");
    setTimeout(()=>{ window.location.href = "index.html"; }, 800);
}
function updateNavAuth(){
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const navAuth = document.querySelector(".nav-auth");
    if(!navAuth) return;
    if(user){
        let dashLink = "#";
        if(user.role === "admin") dashLink = "dashboard-admin.html";
        else if(user.role === "barbero") dashLink = "dashboard-barbero.html";
        else dashLink = "dashboard-cliente.html";
        navAuth.innerHTML = `
        <a href="${dashLink}" style="color:var(--gold);font-weight:600;text-decoration:none;">
            ${user.name}
        </a>
        <button class="btn-outline" onclick="logout()">Cerrar sesión</button>
        `;
    } else {
        navAuth.innerHTML = `
        <button class="btn-outline" onclick="openLogin()">Iniciar sesión</button>
        <button class="btn-primary nav-register" onclick="openLogin(); showRegister();">Registrarse</button>
        `;
    }
}
document.addEventListener("DOMContentLoaded", updateNavAuth);