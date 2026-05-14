import { authenticate } from "./utility.js";

const initButtonActions = () => {
    document.getElementById("btnLupaPassword")
        .addEventListener("click", () => {
            Swal.fire({
                title: "Lupa Password",
                text: "Fitur lupa password belum tersedia. Silakan hubungi admin untuk reset password.",
                icon: "info",
                confirmButtonText: "Tutup",
                customClass: {
                    confirmButton: 'swal-confirm-btn',
                }
            });
        });

    document.getElementById("btnDaftar")
        .addEventListener("click", () => {
            Swal.fire({
                title: "Daftar Akun",
                text: "Fitur pendaftaran belum tersedia. Silakan hubungi admin untuk mendaftar.",
                icon: "info",
                confirmButtonText: "Tutup",
                customClass: {
                    confirmButton: 'swal-confirm-btn',
                }
            });
        });
};

const initLoginFormAction = () => {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        sessionStorage.clear();

        const email = loginForm.email.value;
        const password = loginForm.password.value;

        const user = authenticate(email, password);
        if (user) {
            sessionStorage.setItem("user", user.nama);

            Swal.fire({
                title: "Login Berhasil",
                text: `Selamat datang, ${user.nama}!`,
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            }).then(() => window.location.href = "dashboard.html");
        } else {
            loginForm.email.value = '';
            loginForm.password.value = '';

            Swal.fire({
                title: "Login Gagal",
                text: "Email atau password salah. Silakan coba lagi.",
                icon: "error",
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initButtonActions();
    initLoginFormAction();
});