 // 📅 إعدادات التقويم
const calendarElement = document.getElementById("calendar");
const nextBtn = document.getElementById("to-step-2");

// التاريخ الحالي
const today = new Date();
const selectedMonth = 7; // أغسطس = 7 (من 0 إلى 11)
const selectedYear = 2025;

// 🧩 إنشاء التقويم
function generateCalendar(month, year) {
  calendarElement.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay(); // بداية الشهر
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // أيام الأسبوع (اختياري لعرضها)
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  daysOfWeek.forEach(day => {
    const dayElement = document.createElement("div");
    dayElement.textContent = day;
    dayElement.style.fontWeight = "bold";
    calendarElement.appendChild(dayElement);
  });

  // مسافات فارغة لأيام قبل بداية الشهر
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    calendarElement.appendChild(empty);
  }

  // إنشاء الأيام
  for (let day = 1; day <= daysInMonth; day++) {
    const dateElement = document.createElement("div");
    dateElement.classList.add("day");
    dateElement.textContent = day;

    const isPast =
      year < today.getFullYear() ||
      (year === today.getFullYear() && month < today.getMonth()) ||
      (year === today.getFullYear() && month === today.getMonth() && day < today.getDate());

    if (isPast) {
      dateElement.classList.add("disabled");
    } else {
      dateElement.addEventListener("click", () => {
        // إزالة التحديد السابق
        document.querySelectorAll(".day").forEach(el => el.classList.remove("selected"));
        // تمييز المختار
        dateElement.classList.add("selected");
        nextBtn.disabled = false;
      });
    }

    calendarElement.appendChild(dateElement);
  }
}

// عرض التقويم
generateCalendar(selectedMonth, selectedYear);

// 🔘 زر "Next"
nextBtn.disabled = true;
nextBtn.addEventListener("click", () => {
  alert("تم اختيار التاريخ! الخطوة التالية: اختيار الوقت.");
  // هنا لاحقًا هننقل المستخدم للخطوة 2
});
const step1 = document.getElementById("step-1");
const step2 = document.getElementById("step-2");
const timeGrid = document.getElementById("time-grid");

// توليد الأوقات من 12:00 PM إلى 12:00 AM
function generateTimeSlots() {
  timeGrid.innerHTML = "";
  const startHour = 12;
  const endHour = 24;

  for (let h = startHour; h < endHour; h++) {
    const time1 = formatTime(h, 0);  // :00
    const time2 = formatTime(h, 30); // :30

    createTimeSlot(time1);
    createTimeSlot(time2);
  }
}

function formatTime(hour24, minute) {
  const period = hour24 >= 12 ? "PM" : "AM";
  let hour = hour24 % 12;
  hour = hour === 0 ? 12 : hour;
  const min = minute === 0 ? "00" : minute;
  return `${hour}:${min} ${period}`;
}

function createTimeSlot(timeText) {
  const slot = document.createElement("div");
  slot.className = "time-slot";
  slot.textContent = timeText;

  slot.addEventListener("click", () => {
    document.querySelectorAll(".time-slot").forEach(s => s.classList.remove("selected"));
    slot.classList.add("selected");
    toStep3Btn.disabled = false;
  });

  timeGrid.appendChild(slot);
}

// الانتقال من الخطوة 1 → 2
nextBtn.addEventListener("click", () => {
  step1.classList.add("hidden");
  step2.classList.remove("hidden");
  generateTimeSlots();
});

// 🕓 عرض الوقت والتاريخ في الفوتر
function updateTime() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formatted = now.toLocaleDateString('en-US', options) + " – " + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  document.getElementById("system-time").textContent = formatted;
}
updateTime();
setInterval(updateTime, 10000); // تحديث كل 10 ثوانٍ
const navStep2 = document.getElementById("nav-step-2");
const toStep3Btn = document.getElementById("to-step-3");
const backToStep1Btn = document.getElementById("back-to-step-1");

// عرض أزرار التنقل بعد الانتقال لخطوة الوقت
nextBtn.addEventListener("click", () => {
  document.querySelector(".navigation-buttons").classList.add("hidden");
  navStep2.classList.remove("hidden");
});

// رجوع من خطوة 2 إلى 1
backToStep1Btn.addEventListener("click", () => {
  step2.classList.add("hidden");
  step1.classList.remove("hidden");
  navStep2.classList.add("hidden");
  document.querySelector(".navigation-buttons").classList.remove("hidden");
});