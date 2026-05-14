import { dataBahanAjar } from "../data/dataBahanAjar.js";

const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            upbjjList: dataBahanAjar.upbjjList,
            kategoriList: dataBahanAjar.kategoriList,
            stok: dataBahanAjar.stok,

            sortList: [
                { key: "judul", value: "Judul" },
                { key: "qty", value: "Stok" },
                { key: "harga", value: "Harga" }
            ],

            selectedUpbjj: "",
            selectedKategori: "",
            isSafetyStock: false,
            sortBy: "",

            newStock: {
                kode: "",
                judul: "",
                kategori: "",
                upbjj: "",
                lokasiRak: "",
                harga: 0,
                qty: 0,
                safety: 0,
                catatanHTML: ""
            }
        };
    },
    computed: {
        filteredKategoriList() {
            if (!this.selectedUpbjj) return [];

            const kategoriSet = this.stok
                .filter(item => item.upbjj === this.selectedUpbjj)
                .map(item => item.kategori);

            return [...new Set(kategoriSet)];
        },

        filteredStok() {
            let result = this.stok;

            if (this.selectedUpbjj) {
                result = result.filter(item => item.upbjj === this.selectedUpbjj);
            }

            if (this.selectedKategori) {
                result = result.filter(item => item.kategori === this.selectedKategori);
            }

            if (this.isSafetyStock) {
                result = result.filter(item => item.qty <= item.safety || item.qty === 0);
            }

            if (this.sortBy === "judul") {
                result = result.slice().sort((a, b) => a.judul.localeCompare(b.judul));
            } else if (this.sortBy === "qty") {
                result = result.slice().sort((a, b) => a.qty - b.qty);
            } else if (this.sortBy === "harga") {
                result = result.slice().sort((a, b) => a.harga - b.harga);
            }

            return result;
        }
    },
    methods: {
        resetFilters() {
            this.selectedUpbjj = "";
            this.selectedKategori = "";
            this.isSafetyStock = false;
            this.sortBy = "";
        },

        safetyStatus(item) {
            if (item.qty === 0) {
                return "Habis";
            } else if (item.qty <= item.safety) {
                return "Menipis";
            } else {
                return "Aman";
            }
        },

        safetyClass(item) {
            if (item.qty === 0) {
                return "danger";
            } else if (item.qty <= item.safety) {
                return "warning";
            } else {
                return "success";
            }
        },

        async addStock() {
            const upbjjOptions = this.upbjjList
                .map(upbjj => `<option value="${upbjj}">${upbjj}</option>`)
                .join("");

            const kategoriOptions = this.kategoriList
                .map(kategori => `<option value="${kategori}">${kategori}</option>`)
                .join("");

            const { value: formValues } = await Swal.fire({
                title: "Tambah Bahan Ajar",
                width: 600,
                html: `
                    <div class="swal-form-container">
                        <div class="input-group">
                            <label for="kode">Kode Bahan Ajar</label>
                            <input type="text" id="kode" placeholder="Masukkan kode bahan ajar" required>
                        </div>
                        <div class="input-group">
                            <label for="judul">Judul Bahan Ajar</label>
                            <input type="text" id="judul" placeholder="Masukkan judul bahan ajar" required>
                        </div>
                        <div class="input-group">
                            <label for="kategori">Kategori</label>
                            <select id="kategori" required>
                                <option value="">Pilih Kategori</option>${kategoriOptions}
                            </select>
                        </div>
                        <div class="input-group">
                            <label for="upbjj">UPBJJ</label>
                            <select id="upbjj" required>
                                <option value="">Pilih UPBJJ</option>${upbjjOptions}
                            </select>
                        </div>
                        <div class="input-group">
                            <label for="lokasiRak">Lokasi Rak</label>
                            <input type="text" id="lokasiRak" placeholder="Masukkan lokasi rak" required>
                        </div>
                        <div class="input-group">
                            <label for="harga">Harga</label>
                            <input type="number" id="harga" placeholder="Masukkan harga" required>
                        </div>
                        <div class="input-group">
                            <label for="qty">Jumlah</label>
                            <input type="number" id="qty" placeholder="Masukkan jumlah stok" required>
                        </div>
                        <div class="input-group">
                            <label for="safety">Safety Stock</label>
                            <input type="number" id="safety" placeholder="Masukkan safety stock" required>
                        </div>
                        <div class="input-group">
                            <label for="catatanHTML">Catatan</label>
                            <textarea id="catatanHTML" placeholder="Masukkan catatan (opsional)"></textarea>
                        </div>
                    </div>
                `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: "Simpan",
                cancelButtonText: "Batal",
                customClass: {
                    htmlContainer: 'swal-custom-form',
                    confirmButton: 'swal-confirm-btn',
                    cancelButton: 'swal-cancel-btn'
                },
                preConfirm: () => {
                    return {
                        kode: document.getElementById("kode").value,
                        judul: document.getElementById("judul").value,
                        kategori: document.getElementById("kategori").value,
                        upbjj: document.getElementById("upbjj").value,
                        lokasiRak: document.getElementById("lokasiRak").value,
                        harga: Number(document.getElementById("harga").value),
                        qty: Number(document.getElementById("qty").value),
                        safety: Number(document.getElementById("safety").value),
                        catatanHTML: document.getElementById("catatanHTML").value
                    };
                }
            });

            if (formValues) {
                if (!formValues.kode || !formValues.judul
                    || !formValues.kategori || !formValues.upbjj
                    || !formValues.lokasiRak || !formValues.harga
                    || !formValues.qty || !formValues.safety) {
                    Swal.fire({
                        title: "Gagal",
                        text: "Semua field wajib diisi!",
                        icon: "error",
                        showConfirmButton: false,
                        timer: 2000
                    });
                    return;
                }

                if (this.stok.some(item => item.kode === formValues.kode)) {
                    Swal.fire({
                        title: "Gagal",
                        text: "Kode sudah ada!",
                        icon: "error",
                        showConfirmButton: false,
                        timer: 2000
                    });
                    return;
                }

                this.stok.push(formValues);
                Swal.fire({
                    title: "Berhasil",
                    text: "Bahan ajar berhasil ditambahkan!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 2000
                });
            }
        },

        async editStock(item) {
            const upbjjOptions = this.upbjjList
                .map(upbjj => `<option value="${upbjj}" ${upbjj === item.upbjj ? "selected" : ""}>${upbjj}</option>`)
                .join("");

            const kategoriOptions = this.kategoriList
                .map(kategori => `<option value="${kategori}" ${kategori === item.kategori ? "selected" : ""}>${kategori}</option>`)
                .join("");

            const { value: formValues } = await Swal.fire({
                title: "Edit Bahan Ajar",
                width: 600,
                html: `
                    <div class="swal-form-container">
                        <div class="input-group">
                            <label for="judul">Judul Bahan Ajar</label>
                            <input type="text" id="judul" value="${item.judul}" required>
                        </div>
                        <div class="input-group">
                            <label for="kategori">Kategori</label>
                            <select id="kategori" required>${kategoriOptions}</select>
                        </div>
                        <div class="input-group">
                            <label for="upbjj">UPBJJ</label>
                            <select id="upbjj" required>${upbjjOptions}</select>
                        </div>
                        <div class="input-group">
                            <label for="lokasiRak">Lokasi Rak</label>
                            <input type="text" id="lokasiRak" value="${item.lokasiRak}" required>
                        </div>
                        <div class="input-group">
                            <label for="harga">Harga</label>
                            <input type="number" id="harga" type="number" value="${item.harga}" required>
                        </div>
                        <div class="input-group">
                            <label for="qty">Jumlah</label>
                            <input type="number" id="qty" value="${item.qty}" required>
                        </div>
                        <div class="input-group">
                            <label for="safety">Safety Stock</label>
                            <input type="number" id="safety" value="${item.safety}" required>
                        </div>
                        <div class="input-group">
                            <label for="catatanHTML">Catatan</label>
                            <textarea id="catatanHTML"  placeholder="Masukkan catatan (opsional)">${item.catatanHTML || ""}</textarea>
                        </div>
                    </div>
                `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: "Simpan",
                cancelButtonText: "Batal",
                customClass: {
                    htmlContainer: 'swal-custom-form',
                    confirmButton: 'swal-confirm-btn',
                    cancelButton: 'swal-cancel-btn'
                },
                preConfirm: () => {
                    return {
                        kode: item.kode,
                        judul: document.getElementById("judul").value,
                        kategori: document.getElementById("kategori").value,
                        upbjj: document.getElementById("upbjj").value,
                        lokasiRak: document.getElementById("lokasiRak").value,
                        harga: Number(document.getElementById("harga").value),
                        qty: Number(document.getElementById("qty").value),
                        safety: Number(document.getElementById("safety").value),
                        catatanHTML: document.getElementById("catatanHTML").value
                    };
                }
            });

            if (formValues) {
                if (!formValues.judul || !formValues.kategori || !formValues.upbjj
                    || !formValues.lokasiRak || !formValues.harga
                    || !formValues.qty || !formValues.safety) {
                    Swal.fire({
                        title: "Gagal",
                        text: "Semua field wajib diisi!",
                        icon: "error",
                        showConfirmButton: false,
                        timer: 2000
                    });
                    return;
                }

                Object.assign(item, formValues);
                Swal.fire({
                    title: "Berhasil",
                    text: "Bahan ajar berhasil diperbarui!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 2000
                });
            }
        },

        deleteStock(item) {
            Swal.fire({
                title: "Hapus Bahan Ajar",
                text: `Apakah Anda yakin ingin menghapus "${item.judul}"?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Ya, hapus",
                cancelButtonText: "Batal",
                customClass: {
                    confirmButton: 'swal-delete-btn',
                    cancelButton: 'swal-cancel-btn'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    this.stok = this.stok.filter(s => s.kode !== item.kode);
                    Swal.fire({
                    title: "Berhasil",
                    text: "Bahan ajar telah dihapus.",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 2000
                });
                }
            });
        }
    }
});

app.mount("#stockApp");