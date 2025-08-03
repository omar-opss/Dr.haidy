import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getDatabase, ref, push, get, child } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDvdYelGHJPA49QsZ9wCaAyy9tT-eP3nrw",
  authDomain: "clinic-booking-eeaee.firebaseapp.com",
  databaseURL: "https://clinic-booking-eeaee-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "clinic-booking-eeaee",
  storageBucket: "clinic-booking-eeaee.appspot.com",
  messagingSenderId: "21071960927",
  appId: "1:21071960927:web:d46bea119060b4f046b4ea",
  measurementId: "G-8H7KWF6Q09"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Form submit
document.getElementById('bookingForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const status = document.getElementById('status');

  if (!name || !phone || !date || !time) {
    status.textContent = "Please fill all fields.";
    return;
  }

  const bookingRef = ref(db, 'bookings/' + date + '/' + time);

  const snapshot = await get(bookingRef);
  if (snapshot.exists()) {
    status.textContent = "⚠️ This time is already booked.";
    return;
  }

  await push(bookingRef, {
    name: name,
    phone: phone,
    date: date,
    time: time
  });

  // Open WhatsApp with details
  const message = `Name: ${name}%0APhone: ${phone}%0ADate: ${date}%0ATime: ${time}`;
  const whatsappURL = `https://wa.me/201010876605?text=${message}`;
  window.open(whatsappURL, '_blank');

  status.textContent = "✅ Booking confirmed!";
  this.reset();
});
