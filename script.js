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

export function fetchBookings() {
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
          let rawTime = data.time || timeKey;
          let time = rawTime.includes(" - ")
            ? rawTime.split(" - ").map(convertTo12Hour).join(" - ")
            : convertTo12Hour(rawTime);
          const attended = data.attended ? "✔️" : "❌";

          total++;
          allTimes.push(time);

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
        }
      }
    });

    document.getElementById("totalBookings").innerText = total;
    document.getElementById("bookingDays").innerText = allDays.size;

    const timeCounts = {};
    allTimes.forEach(t => timeCounts[t] = (timeCounts[t] || 0) + 1);
    const peak = Object.entries(timeCounts).sort((a, b) => b[1] - a[1])[0];
    document.getElementById("peakTime").innerText = peak ? `${peak[0]} (${peak[1]})` : "—";
  }, {
    onlyOnce: true
  });
}

window.fetchBookings = fetchBookings;
