const initModalEventsDashboard = () => {
    document.getElementById("menuInformasiBahanAjar").addEventListener("click", () => {
        window.location.href = "stok.html";
    });

    document.getElementById("menuTrackingPengiriman").addEventListener("click", () => {
        window.location.href = "tracking.html";
    });

    document.getElementById("menuLaporan").addEventListener("click", () => {
        Swal.fire({
            title: 'Laporan',
            html: `
                <div class="menu-laporan">
                    <a href="#" class="menu-item">
                        📊 Monitoring Progress DO Bahan Ajar
                    </a>

                    <a href="#" class="menu-item">
                        📁 Rekap Bahan Ajar
                    </a>
                </div>
                `,
            showConfirmButton: false,
            width: '400px',
            showCloseButton: true,
            customClass: {
                popup: 'swal-popup',
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initModalEventsDashboard();
});