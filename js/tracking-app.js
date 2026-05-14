import { dataBahanAjar } from "../data/dataBahanAjar.js";

const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            upbjjList: dataBahanAjar.upbjjList,
            pengirimanList: dataBahanAjar.pengirimanList,
            paketList: dataBahanAjar.paket,
            trackingList: dataBahanAjar.tracking,
            addTrackingDataView: true,
            ekspedisiName: "JNE",
            ekspedisiFormatted: "",

            deliveryOrder: {
                nim: "",
                nama: "",
                ekspedisi: "",
                paket: "",
                tanggalKirim: "",
                total: 0,
                status: "",
            }
        }
    },
    computed: {
        selectedPaket() {
            return this.paketList.find(paket => paket.kode === this.deliveryOrder.paket);
        },

        selectedPengiriman() {
            return this.pengirimanList.find(pengiriman => pengiriman.kode === this.deliveryOrder.ekspedisi);
        },

        counterNomorDeliveryOrder() {
            const tahun = new Date().getFullYear();
            const counter = Object.keys(this.trackingList).length + 1;
            const counterString = String(counter).padStart(4, "0");
            return `DO${tahun}-${counterString}`;
        }
    },
    watch: {
        selectedPaket(newVal) {
            let total = 0;

            if (newVal) {
                total = newVal.harga;
            }

            this.deliveryOrder.total = total;
        },

        selectedPengiriman(newVal) {
            if (newVal) {
                const tipe = newVal.nama.split(' ')[0];
                this.ekspedisiFormatted = `${this.ekspedisiName} (${tipe})`;
            }
        }
    },
    methods: {
        toggleView() {
            this.addTrackingDataView = !this.addTrackingDataView;
            if (!this.addTrackingDataView) {
                this.resetForm();
            }
        },
        resetForm() {
            this.deliveryOrder = {
                nim: "",
                nama: "",
                ekspedisi: "",
                paket: "",
                tanggalKirim: "",
                total: 0,
                status: "",
            };
            this.ekspedisiFormatted = "";
        },
        addDeliveryOrder() {
            if (!this.deliveryOrder.nim || !this.deliveryOrder.nama
                || !this.deliveryOrder.ekspedisi || !this.deliveryOrder.paket
                || !this.deliveryOrder.tanggalKirim) {
                Swal.fire({
                    title: "Info Tambah Delivery Order",
                    text: "Semua kolom wajib diisi.",
                    icon: "warning",
                    showConfirmButton: false,
                    timer: 1500
                });

                return;
            }

            const nomorDeliveryOrder = this.counterNomorDeliveryOrder;
            const newDeliveryOrder = {
                nim: this.deliveryOrder.nim,
                nama: this.deliveryOrder.nama,
                status: "Dalam Proses",
                ekspedisi: this.ekspedisiFormatted || this.deliveryOrder.ekspedisi,
                tanggalKirim: this.deliveryOrder.tanggalKirim,
                paket: this.deliveryOrder.paket,
                total: this.deliveryOrder.total,
                perjalanan: [
                    {
                        waktu: new Date().toLocaleString("id-ID"),
                        keterangan: "Penerimaan di Loket: TANGSEL"
                    }
                ]
            };

            this.trackingList[nomorDeliveryOrder] = newDeliveryOrder;

            Swal.fire({
                title: "Berhasil",
                text: `Delivery Order ${nomorDeliveryOrder} berhasil ditambahkan.`,
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            });

            this.resetForm();
        }
    }
});

app.mount('#trackingApp');