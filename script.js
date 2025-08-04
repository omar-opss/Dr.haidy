import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue, remove, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDvdYelGHJPA49QsZ9wCaAyy9tT-eP3nrw",
  authDomain: "clinic-booking-eeaee.firebaseapp.com",
  databaseURL: "https://clinic-booking-eeaee-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "clinic-booking-eeaee",
  storageBucket: "clinic-booking-eeaee.appspot.com",
  messagingSenderId: "21071960927",
  appId: "1:21071960927:web:d46bea119060b4f046b4ea"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const tableBody = document.getElementById("tableBody");

function convertTo12Hour(time24) {
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
}

function fetchBookings() {
  const bookingsRef = ref(database, 'bookings/');
  onValue(bookingsRef, (snapshot) => {
    tableBody.innerHTML = "";

    let total = 0;
    let allTimes = [];
    let allDays = new Set();

    snapshot.forEach(dateSnap => {
      const dateKey = dateSnap.key;
      allDays.add(dateKey);
      const timesSnap = dateSnap.val();

      for (let timeKey in timesSnap) {
        const timeGroup = timesSnap[timeKey];

        for (let bookingId in timeGroup) {
          const data = timeGroup[bookingId];
          const name = data.name || "—";
          const phone = data.phone || "—";
          const date = data.date || dateKey;
          const rawTime = data.time || timeKey;

          let time;
          if (rawTime.includes(" - ")) {
            const [start, end] = rawTime.split(" - ");
            time = `${convertTo12Hour(start)} - ${convertTo12Hour(end)}`;
          } else {
            time = convertTo12Hour(rawTime);
          }

          const attended = data.attended ? "✔️" : "❌";

          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${name}</td>
            <td>${phone}</td>
            <td><button onclick="sendWhatsapp('${phone}', '${name}', '${date}', '${time}')">📤</button></td>
            <td>${date}</td>
            <td>${time}</td>
            <td><button onclick="toggleAttended('${dateKey}', '${timeKey}', '${bookingId}', ${data.attended ? 'false' : 'true'})">${attended}</button></td>
            <td><button onclick="deleteBooking('${dateKey}', '${timeKey}', '${bookingId}')">🗑</button></td>
          `;
          tableBody.appendChild(tr);
          total++;
          allTimes.push(time);
        }
      }
    });

    document.getElementById("totalBookings").innerText = total;
    document.getElementById("bookingDays").innerText = allDays.size;

    const timeCounts = {};
    allTimes.forEach(t => timeCounts[t] = (timeCounts[t] || 0) + 1);
    const peak = Object.entries(timeCounts).sort((a, b) => b[1] - a[1])[0];
    document.getElementById("peakTime").innerText = peak ? `${peak[0]} (${peak[1]})` : "—";
  }, { onlyOnce: true });
}

function login() {
  const pass = document.getElementById("adminPass").value;
  if (pass === "omar2025") {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
    fetchBookings();
  } else {
    alert("كلمة السر غير صحيحة");
  }
}

function sendWhatsapp(phone, name, date, time) {
  const msg = `مرحبًا ${name}، تم تأكيد حجزك بتاريخ ${date} من ${time} في عيادة دكتورة هايدي.`;
  const url = `https://wa.me/${phone.replace(/^0/, "2")}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

function toggleAttended(date, time, id, newState) {
  const bookingRef = ref(database, `bookings/${date}/${time}/${id}`);
  update(bookingRef, { attended: newState });
  fetchBookings();
}

function deleteBooking(date, time, id) {
  const bookingRef = ref(database, `bookings/${date}/${time}/${id}`);
  remove(bookingRef).then(() => {
    alert("تم حذف الحجز");
    fetchBookings();
  });
}

function exportToExcel() {
  const rows = [];
  const headers = ["الاسم", "رقم الهاتف", "تاريخ", "وقت", "الحضور"];
  rows.push(headers);

  document.querySelectorAll("#tableBody tr").forEach(row => {
    const cells = row.querySelectorAll("td");
    if (cells.length >= 5) {
      const rowData = [
        cells[0].innerText,
        cells[1].innerText,
        cells[3].innerText,
        cells[4].innerText,
        cells[5].innerText
      ];
      rows.push(rowData);
    }
  });

  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
  XLSX.writeFile(workbook, "الحجوزات.xlsx");
}

// تسجيل الدوال في window علشان تشتغل في HTML
window.login = login;
window.fetchBookings = fetchBookings;
window.sendWhatsapp = sendWhatsapp;
window.toggleAttended = toggleAttended;
window.deleteBooking = deleteBooking;
window.exportToExcel = exportToExcel;

// زر التحديث
document.getElementById("refreshBtn").addEventListener("click", fetchBookings);
