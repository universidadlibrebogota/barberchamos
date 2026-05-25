/* =========================
   ABRIR MODAL
========================= */

function openLogin(){

    document.getElementById(
        "loginModal"
    ).style.display = "flex";

}

/* =========================
   CERRAR MODAL
========================= */

function closeLogin(){

    document.getElementById(
        "loginModal"
    ).style.display = "none";

}

/* =========================
   MOSTRAR REGISTRO
========================= */

function showRegister(){

    document.getElementById(
        "loginForm"
    ).style.display = "none";

    document.getElementById(
        "registerForm"
    ).style.display = "block";

    document.getElementById(
        "modalTitle"
    ).innerHTML = "Registrarse";

}

/* =========================
   MOSTRAR LOGIN
========================= */

function showLogin(){

    document.getElementById(
        "registerForm"
    ).style.display = "none";

    document.getElementById(
        "loginForm"
    ).style.display = "block";

    document.getElementById(
        "modalTitle"
    ).innerHTML = "Iniciar sesión";

}

/* =========================
   REGISTRO
========================= */

function register(){

    const name =
    document.getElementById(
        "registerName"
    ).value.trim();

    const email =
    document.getElementById(
        "registerEmail"
    ).value.trim();

    const phone =
    document.getElementById(
        "registerPhone"
    ).value.trim();

    const password =
    document.getElementById(
        "registerPassword"
    ).value;

    if(
        !name ||
        !email ||
        !phone ||
        !password
    ){

        showAlert(
            "Completa todos los campos"
        );

        return;

    }

    const users =
    JSON.parse(
        localStorage.getItem("users")
    ) || [];

    const exists =
    users.find(
        user => user.email === email
    );

    if(exists){

        showAlert(
            "El correo ya está registrado"
        );

        return;

    }

    const newUser = {

        id:Date.now(),

        name,
        email,
        phone,
        password,

        role:"cliente",

        active:true

    };

    users.push(newUser);

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    /* LOGIN AUTOMÁTICO */

    localStorage.setItem(
        "currentUser",
        JSON.stringify(newUser)
    );

    showAlert(
        "¡Registro exitoso! Bienvenido " + name
    );

    closeLogin();

    updateNavAuth();

}

/* =========================
   LOGIN
========================= */

function login(){

    const email =
    document.getElementById(
        "loginEmail"
    ).value.trim();

    const password =
    document.getElementById(
        "loginPassword"
    ).value;

    if(!email || !password){

        showAlert(
            "Completa todos los campos"
        );

        return;

    }

    const users =
    JSON.parse(
        localStorage.getItem("users")
    ) || [];

    const user =
    users.find(u =>
        u.email === email &&
        u.password === password
    );

    if(!user){

        showAlert(
            "Correo o contraseña incorrectos"
        );

        return;

    }

    if(!user.active){

        showAlert(
            "Tu cuenta está desactivada"
        );

        return;

    }

    /* GUARDAR SESIÓN */

    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );

    showAlert(
        "¡Bienvenido " + user.name + "!"
    );

    closeLogin();

    updateNavAuth();

    /* REDIRIGIR ADMIN */

    if(user.role === "admin"){

        window.location.href =
        "dashboard-admin.html";

    }

}

/* =========================
   LOGOUT
========================= */

function logout(){

    localStorage.removeItem(
        "currentUser"
    );

    showAlert(
        "Sesión cerrada correctamente"
    );

    updateNavAuth();

}

/* =========================
   ACTUALIZAR NAV
========================= */

function updateNavAuth(){

    const user =
    JSON.parse(
        localStorage.getItem("currentUser")
    );

    const navAuth =
    document.querySelector(".nav-auth");

    if(!navAuth) return;

    if(user){

        navAuth.innerHTML = `

        <span style="color:var(--gold);font-weight:600;">
            ${user.name}
        </span>

        <button
        class="btn-outline"
        onclick="logout()">
            Cerrar sesión
        </button>

        `;

    } else {

        navAuth.innerHTML = `

        <button
        class="btn-outline"
        onclick="openLogin()">
            Iniciar sesión
        </button>

        <button
        class="btn-primary nav-register"
        onclick="openLogin(); showRegister();">
            Registrarse
        </button>

        `;

    }

}

/* INICIALIZAR AL CARGAR */

document.addEventListener(
    "DOMContentLoaded",
    updateNavAuth
);
