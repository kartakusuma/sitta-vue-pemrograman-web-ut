import { dataTracking } from '../data/data.js';
import { dataBahanAjar } from '../data/dataBahanAjar.js';

const renderDataTracking = (nomorDO) => {
  const combinedDataTracking = { ...dataTracking, ...dataBahanAjar.tracking };

  const data = combinedDataTracking[nomorDO];
  if (!data) {
    setTimeout(() => {
      Swal.fire({
        title: "Tracking Info",
        text: "Data pengiriman tidak ditemukan.",
        icon: "warning",
        showConfirmButton: false,
        timer: 1500
      });
    }, 250);

    return;
  }

  document.getElementById('ui-status').textContent = data.status;
  document.getElementById('ui-nomorDO').textContent = nomorDO;
  document.getElementById('ui-nama').textContent = data.nama;
  document.getElementById('ui-ekspedisi').textContent = data.ekspedisi;
  document.getElementById('ui-tanggal').textContent = data.tanggalKirim;
  document.getElementById('ui-paket').textContent = data.paket;
  document.getElementById('ui-total').textContent = 'Rp' + data.total.toLocaleString('id-ID');

  const timelineElement = document.getElementById('ui-timeline');
  const riwayatPerjalanan = [...data.perjalanan].reverse();
  timelineElement.innerHTML = '';

  riwayatPerjalanan.forEach(item => {
    const li = document.createElement('li');
    li.className = 'timeline-item';

    li.innerHTML = `
        <div class="timeline-time">${item.waktu}</div>
        <div class="timeline-desc">${item.keterangan}</div>
      `;

    timelineElement.appendChild(li);
  });

  const trackingResult = document.querySelector('.tracking-result');
  if (trackingResult) {
    trackingResult.classList.add('show');
  }
}

const initTrackingFeature = () => {
  document.addEventListener('click', (e) => {
    if (e.target.id === 'btnTracking' || e.target.closest('#btnTracking')) {
      const trackingResult = document.querySelector('.tracking-result');
      if (trackingResult) {
        trackingResult.classList.remove('show');
      }

      const trackingNumberInput = document.getElementById('trackingNumber');
      const trackingNumber = trackingNumberInput.value.trim();
      if (trackingNumber === '') {
        setTimeout(() => {
          Swal.fire({
            title: "Tracking Info",
            text: "Nomor delivery order harus diisi!",
            icon: "warning",
            showConfirmButton: false,
            timer: 1500
          });
        }, 250);

        return;
      }

      renderDataTracking(trackingNumber);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTrackingFeature();
});
