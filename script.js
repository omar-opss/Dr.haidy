import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getDatabase, ref, push, get } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

// إعدادات Firebase الخاصة بيك
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

  status.textContent = "⏳ Checking availability...";

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

 

أيوه 💯  
بما إن عندك ملف اسمه `script.js`، وكنت بتستخدمه أصلاً في مشروعك لحجز المواعيد، فده هو نفس دور `app.js` اللي كنا هنعمله.

يعني **أيوه، `script.js` هو هو نفس الملف المطلوب** 👇

---

## ✅ المطلوب دلوقتي:

1. افتح `script.js`  
2. امسح أي كود قديم جواه (لو فيه)
3. انسخ الكود الجاهز اللي كتبته فوق والصقه بالكامل جواه
4. **تأكد إنك رابط الملف داخل `index.html` زي كده:**

```html
<script type="module" src="script.js"></script>
