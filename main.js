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

// 🧾 Handle form submit
document.getElementById("bookingForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const date = document.getElementById("date").value;
  const start = document.getElementById("start-time").value;
  const end = document.getElementById("end-time").value;
  const status = document.getElementById("status");

  // ✅ Basic validation
  if (!name || !phone || !date || !start || !end) {
    status.textContent = "Please fill all fields.";
    return;
  }

  if (start >= end) {
    status.textContent = "End time must be after start time.";
    return;
  }

  const time = `${start} - ${end}`;
  status.textContent = "⏳ Checking availability...";

  // 🔍 Check if time already booked
  const bookingRef = ref(db, `bookings/${date}/${time}`);
  const snapshot = await get(bookingRef);

  if (snapshot.exists()) {
    status.textContent = "⚠️ This time is already booked.";
    return;
  }

  // ✅ Save booking
  await push(bookingRef, {
    name: name,
    phone: phone,
    date: date,
    time: time
  });

  // ✅ Show confirmation
  status.textContent = "✅ Booking confirmed!";

  // 🔗 Open WhatsApp
  const message = `مرحبًا ${name}، تم تأكيد حجزك بتاريخ ${date} من ${time} في عيادة دكتورة هايدي.`;
  const whatsappURL = `https://wa.me/201010876605?text=${encodeURIComponent(message)}`;

  setTimeout(() => {
    window.open(whatsappURL, '_blank');
  }, 500); // نصف ثانية تأخير

  this.reset();
});

// ✅ عرض اسم اليوم بالإنجليزي
document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("date");
  const dayLabel = document.getElementById("dayNameLabel");

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  if (dateInput && dayLabel) {
    dateInput.addEventListener("change", function () {
      const selectedDate = new Date(this.value);
      if (!isNaN(selectedDate)) {
        const dayName = days[selectedDate.getDay()];
        dayLabel.textContent = `Day: ${dayName}`;
      } else {
        dayLabel.textContent = "";
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("date");
  const dayLabel = document.getElementById("dayNameLabel");

  console.log("dateInput:", dateInput);
  console.log("dayLabel:", dayLabel);

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  if (dateInput && dayLabel) {
    dateInput.addEventListener("change", function () {
      const selectedDate = new Date(this.value);
      if (!isNaN(selectedDate)) {
        const dayName = days[selectedDate.getDay()];
        dayLabel.textContent = `Day: ${dayName}`;
        console.log("✅ Day set:", dayName);
      } else {
        dayLabel.textContent = "";
        console.log("❌ Invalid date");
      }
    });
  } else {
    console.log("🚨 عنصر التاريخ أو الليبل مش موجودين");
  }
});
