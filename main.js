import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getDatabase, ref, push, get } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDvdYelGHJPA49QsZ9wCaAyy9tT-eP3nrw",
  authDomain: "clinic-booking-eeaee.firebaseapp.com",
  databaseURL: "https://clinic-booking-eeaee-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "clinic-booking-eeaee",
  storageBucket: "clinic-booking-eeaee.appspot.com",
  messagingSenderId: "21071960927",
  appId: "1:21071960927:web:d46bea119060b4f046b4ea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Form submit handler
document.getElementById("bookingForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const date = document.getElementById("date").value;
  const start = document.getElementById("start-time").value;
  const end = document.getElementById("end-time").value;
  const status = document.getElementById("status");

  // Validation
  if (!name || !phone || !date || !start || !end) {
    status.textContent = "Please fill all fields.";
    return;
  }

  if (start >= end) {
    status.textContent = "End time must be after start time.";
    return;
  }

  const time = `${start} - ${end}`;

  // Step 1: Checking...
  status.textContent = "⏳ Checking availability...";

  const bookingRef = ref(db, `bookings/${date}/${time}`);
  const snapshot = await get(bookingRef);

  if (snapshot.exists()) {
    status.textContent = "⚠️ This time is already booked.";
    return;
  }

  // Step 2: Save to database
  await push(bookingRef, {
    name: name,
    phone: phone,
    date: date,
    time: time
  });

  // Step 3: Booking confirmed
  status.textContent = "✅ Booking confirmed!";

  // Step 4: Open WhatsApp
  const message = `مرحبًا ${name}، تم تأكيد حجزك بتاريخ ${date} من ${time} في عيادة دكتورة هايدي.`;
  const whatsappURL = `https://wa.me/201010876605?text=${encodeURIComponent(message)}`;
  
  setTimeout(() => {
    window.open(whatsappURL, '_blank');
  }, 500); // نصف ثانية تأخير لراحة المستخدم

  this.reset();
});
