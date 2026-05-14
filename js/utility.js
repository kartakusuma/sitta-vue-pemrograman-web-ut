import { dataPengguna } from "../data/data.js";

export const getGreeting = () => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) {
        return "Selamat Pagi";
    } else if (hour >= 12 && hour < 15) {
        return "Selamat Siang";
    } else if (hour >= 15 && hour < 18) {
        return "Selamat Sore";
    } else {
        return "Selamat Malam";
    }
}

export const authenticate = (email, password) => {
    const user = dataPengguna.find(user => user.email === email && user.password === password);
    return user || null;
}

const toggleSubmenu = () => {
    const submenuContent = document.querySelector(".submenu-content");
    submenuContent.classList.toggle("show");
}

export const initSubmenuToggle = () => {
    document.querySelector(".submenu-toggle").addEventListener("click", toggleSubmenu);
}

export const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
