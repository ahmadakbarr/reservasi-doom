// Data Ruangan dan Reservasi
let ruanganList = [
    { nomor: 1, kapasitas: 30, tersedia: true, reservasi: [] },
    { nomor: 2, kapasitas: 25, tersedia: true, reservasi: [] },
    { nomor: 3, kapasitas: 20, tersedia: true, reservasi: [] },
    { nomor: 4, kapasitas: 40, tersedia: true, reservasi: [] }
];

let daftarReservasi = [];

// Fungsi untuk menampilkan daftar ruangan
function tampilkanRuangan() {
    const table = document.getElementById("ruangan-table");
    table.innerHTML = ''; // Clear previous rows

    ruanganList.forEach(ruangan => {
        const row = table.insertRow();
        row.innerHTML = `
            <td class="py-2 px-4">${ruangan.nomor}</td>
            <td class="py-2 px-4">${ruangan.kapasitas}</td>
            <td class="py-2 px-4">${ruangan.tersedia ? 'Tersedia' : 'Tidak Tersedia'}</td>
        `;
    });
}

// Fungsi untuk menambahkan reservasi
function tambahReservasi(nama, nomorRuangan, tanggal, waktuMulai, durasi) {
    const ruangan = ruanganList.find(r => r.nomor === nomorRuangan);
    if (!ruangan) {
        alert('Ruangan tidak ditemukan.');
        return;
    }

    // Memeriksa apakah ada konflik jadwal
    const jamMulai = new Date(`${tanggal}T${waktuMulai}`);
    const jamSelesai = new Date(jamMulai.getTime() + durasi * 60 * 60 * 1000);

    // Cek apakah ada reservasi yang tumpang tindih dengan waktu yang baru
    const konflik = ruangan.reservasi.some(res => {
        const reservasiMulai = new Date(res.tanggal + 'T' + res.waktuMulai);
        const reservasiSelesai = new Date(reservasiMulai.getTime() + res.durasi * 60 * 60 * 1000);

        // Memeriksa apakah waktu pemesanan baru tumpang tindih dengan waktu reservasi yang ada
        return (
            (jamMulai >= reservasiMulai && jamMulai < reservasiSelesai) ||
            (jamSelesai > reservasiMulai && jamSelesai <= reservasiSelesai) ||
            (jamMulai <= reservasiMulai && jamSelesai >= reservasiSelesai)
        );
    });

    // Jika ada konflik, tampilkan pesan error
    if (konflik) {
        document.getElementById('error-message').textContent = 'Ruangan sudah dipesan pada waktu ini.';
        return;
    }

    // Menambahkan reservasi jika tidak ada konflik
    ruangan.reservasi.push({ nama, tanggal, waktuMulai, durasi });
    daftarReservasi.push({ nama, nomorRuangan, tanggal, waktuMulai, durasi });

    // Update tampilan daftar reservasi dan ruangan
    tampilkanReservasi();
    tampilkanRuangan();

    document.getElementById('error-message').textContent = ''; // Clear error message
}


// Fungsi untuk menampilkan daftar reservasi
// Fungsi untuk menampilkan daftar reservasi
function tampilkanReservasi() {
    const table = document.getElementById("reservasi-table");
    table.innerHTML = ''; // Clear previous rows

    daftarReservasi.forEach((reservasi, index) => {
        const row = table.insertRow();
        row.innerHTML = `
            <td class="py-2 px-4">${reservasi.nama}</td>
            <td class="py-2 px-4">${reservasi.nomorRuangan}</td>
            <td class="py-2 px-4">${reservasi.tanggal}</td>
            <td class="py-2 px-4">${reservasi.waktuMulai}</td>
            <td class="py-2 px-4">${reservasi.durasi} jam</td>
            <td class="py-2 px-4">
                <button onclick="batalReservasi(${index})" class="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600">Batal</button>
            </td>
        `;
    });
}


// Fungsi untuk membatalkan reservasi
function batalReservasi(index) {
    const reservasi = daftarReservasi[index];
    const ruangan = ruanganList.find(r => r.nomor === reservasi.nomorRuangan);

    // Hapus dari daftar reservasi ruangan
    ruangan.reservasi = ruangan.reservasi.filter(r => r !== reservasi);

    // Hapus dari daftar reservasi global
    daftarReservasi.splice(index, 1);

    tampilkanReservasi(); // Update tampilan daftar reservasi
    tampilkanRuangan();   // Update tampilan daftar ruangan
}

// Event listener untuk formulir pemesanan
document.getElementById('form-reservasi').addEventListener('submit', function (event) {
    event.preventDefault();

    const nama = document.getElementById('nama-pemesan').value;
    const nomorRuangan = parseInt(document.getElementById('nomor-ruangan').value);
    const tanggal = document.getElementById('tanggal-reservasi').value;
    const waktuMulai = document.getElementById('waktu-mulai').value;
    const durasi = parseInt(document.getElementById('durasi').value);

    tambahReservasi(nama, nomorRuangan, tanggal, waktuMulai, durasi);
});

// Inisialisasi tampilan awal
document.addEventListener("DOMContentLoaded", function () {
    tampilkanRuangan();  // Pastikan ruangan tampil setelah halaman dimuat
    tampilkanReservasi(); // Pastikan daftar reservasi tampil
});
