// main.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bookingForm");
  const status = document.getElementById("status");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // ✅ إعادة تعيين لون الرسالة
    status.style.color = "white"; // أو اللون الافتراضي
    status.textContent = "⏳ Checking availability...";

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const date = document.getElementById("date").value;
    const start = document.getElementById("start-time").value;
    const end = document.getElementById("end-time").value;

    if (!name || !phone || !date || !start || !end) {
      status.style.color = "red";
      status.textContent = "Please fill all fields.";
      return;
    }

    if (start >= end) {
      status.style.color = "red";
      status.textContent = "End time must be after start time.";
      return;
    }

    // ✅ نكوّن الوقت من البداية والنهاية
    const time = `${start} - ${end}`;

    // ✅ نتحقق من الحجز
    const bookingRef = ref(db, `bookings/${date}/${time}`);
    const snapshot = await get(bookingRef);

    // ✅ إذا فيه حجز بنفس الوقت، نمنع الحجز الجديد
    if (snapshot.exists()) {
      status.style.color = "red";
      status.textContent = "⚠️ This time is already booked.";
      return;
    }

    // ✅ نحجز الوقت مباشرة
    await set(bookingRef, {
      name: name,
      phone: phone,
      date: date,
      time: time,
      attended: false // ✅ إضافة حالة الحضور افتراضيًا
    });

    status.style.color = "green";
    status.textContent = "✅ Booking confirmed successfully!";

    const message = `مرحبًا ${name}، تم تأكيد حجزك بتاريخ ${date} من ${time} في عيادة دكتورة هايدي.`;
    const whatsappURL = `https://wa.me/201010876605?text=${encodeURIComponent(message)}`;

    setTimeout(() => {
      window.open(whatsappURL, '_blank');
    }, 500);

    this.reset();
    if (dayLabel) dayLabel.textContent = ""; // مسح اسم اليوم بعد الحجز
  });

  // ✅ عرض اسم اليوم
  const dateInput = document.getElementById("date");
  const dayLabel = document.getElementById("dayNameLabel");
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  if (dateInput && dayLabel) {
    dateInput.addEventListener("change", function () {
      try {
        const selectedDate = new Date(this.value);
        if (!isNaN(selectedDate.getTime())) {
          const dayName = days[selectedDate.getDay()];
          dayLabel.textContent = `Day: ${dayName}`;
        } else {
          dayLabel.textContent = "";
        }
      } catch (error) {
        dayLabel.textContent = "";
      }
    });
  }
});
