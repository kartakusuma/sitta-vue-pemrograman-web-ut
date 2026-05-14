import { initSubmenuToggle, getGreeting } from "./utility.js";

const initLogoutFeature = () => {
    document.getElementById("btnLogout").addEventListener("click", (e) => {
        e.preventDefault();

        Swal.fire({
            title: 'Apakah Anda yakin ingin logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, logout!',
            cancelButtonText: 'Batal',
            customClass: {
                confirmButton: 'swal-delete-btn',
                cancelButton: 'swal-cancel-btn'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                sessionStorage.clear();
                window.location.href = 'index.html';
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initLogoutFeature();
    initSubmenuToggle();

    let greeting = getGreeting();

    const user = sessionStorage.getItem("user");
    if (!user) {
        window.location.href = 'index.html';
    }

    const greetingEl = document.getElementById("greeting");
    if (greetingEl) {
        greeting += `, ${user.split(' ')[0]}`;
        greetingEl.innerText = greeting;
    }

    const btnLogout = document.getElementById("btnLogout");
    btnLogout.classList.add("show");
})