// هنستنى لحد ما الصفحة كلها تحمل عشان نضمن إن كل العناصر موجودة
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. تعريف كل العناصر اللي هنتعامل معاها ---

    // حاويات الخطوات
    const reservationContainer = document.getElementById('reservation-container');
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');

    // شريط الخطوات (الأرقام 1, 2, 3)
    const stepIndicator1 = document.querySelector('.step[data-step="1"]');
    const stepIndicator2 = document.querySelector('.step[data-step="2"]');
    const stepIndicator3 = document.querySelector('.step[data-step="3"]');

    // زراير التنقل
    const nextToStep2Btn = document.getElementById('next-to-step-2');
    const nextToStep3Btn = document.getElementById('next-to-step-3');
    const backToStep1Btn = document.getElementById('back-to-step-1');
    const backToStep2Btn = document.getElementById('back-to-step-2');
    
    // فورم الحجز
    const bookingForm = document.getElementById('booking-form');
    const submitBookingBtn = document.getElementById('submit-booking');

    // شاشة الأدمن لوجن
    const showAdminLoginBtn = document.getElementById('show-admin-login-btn');
    const adminLoginContainer = document.getElementById('admin-login-container');
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const adminCancelBtn = document.getElementById('admin-cancel-btn');

    // شاشة نجاح الحجز
    const successMessage = document.getElementById('success-message');
    const successOkBtn = document.getElementById('success-ok-btn');

    // --- 2. متغيرات لحفظ بيانات الحجز ---
    let selectedDate = '';
    let selectedTime = '';

    // --- 3. دوال (Functions) مساعدة ---

    // فانكشن لتغيير الخطوة
    function goToStep(stepNum) {
        // إخفاء كل الخطوات
        [step1, step2, step3].forEach(step => step.classList.add('hidden'));
        
        // إلغاء تنشيط كل مؤشرات الخطوات
        [stepIndicator1, stepIndicator2, stepIndicator3].forEach(ind => ind.classList.remove('active'));

        // إظهار الخطوة المطلوبة وتنشيط مؤشرها
        if (stepNum === 1) {
            step1.classList.remove('hidden');
            stepIndicator1.classList.add('active');
        } else if (stepNum === 2) {
            step2.classList.remove('hidden');
            stepIndicator1.classList.add('active');
            stepIndicator2.classList.add('active');
        } else if (stepNum === 3) {
            step3.classList.remove('hidden');
            stepIndicator1.classList.add('active');
            stepIndicator2.classList.add('active');
            stepIndicator3.classList.add('active');
        }
    }

    // --- 4. ربط الأحداث (Event Listeners) ---

    // التنقل من خطوة 1 إلى 2
    nextToStep2Btn.addEventListener('click', () => {
        // TODO: المفروض هنا نتأكد إن اليوزر اختار تاريخ
        // selectedDate = ... (هناخد القيمة من التقويم)
        goToStep(2);
    });

    // التنقل من خطوة 2 إلى 3
    nextToStep3Btn.addEventListener('click', () => {
        // TODO: المفروض هنا نتأكد إن اليوزر اختار وقت
        // selectedTime = ... (هناخد القيمة من زرار الوقت)
        goToStep(3);
    });

    // الرجوع من 2 إلى 1
    backToStep1Btn.addEventListener('click', () => {
        goToStep(1);
    });

    // الرجوع من 3 إلى 2
    backToStep2Btn.addEventListener('click', () => {
        goToStep(2);
    });

    // --- 5. لوجيك لوجن الأدمن ---

    // إظهار شاشة لوجن الأدمن
    showAdminLoginBtn.addEventListener('click', () => {
        reservationContainer.classList.add('hidden'); // اخفي خطوات الحجز
        adminLoginContainer.classList.remove('hidden'); // اظهر شاشة اللوجن
    });

    // إخفاء شاشة اللوجن (لما يدوس Cancel)
    adminCancelBtn.addEventListener('click', () => {
        adminLoginContainer.classList.add('hidden'); // اخفي شاشة اللوجن
        reservationContainer.classList.remove('hidden'); // اظهر خطوات الحجز تاني
    });

    // لما الأدمن يدوس Login
    adminLoginBtn.addEventListener('click', () => {
        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;

        // TODO: هنا هتحط كود التحقق بتاعك
        // مثال:
        if (password === "omar2025") { // ده الباسورد اللي كان في الكود القديم بتاعك
            alert('Login Successful!');
            // المفروض هنا توديه لصفحة الأدمن بانل
            // window.location.href = 'admin.html'; // <--- زي كده
        } else {
            alert('Wrong username or password');
        }
    });

    // --- 6. لوجيك الحجز (Booking Form) ---

    // لما اليوزر يدوس "Book Now"
    bookingForm.addEventListener('submit', (event) => {
        event.preventDefault(); // امنع الصفحة إنها تعمل ريلود

        // 1.اجمع البيانات من الفورم
        const name = document.getElementById('user-name').value;
        const phone = document.getElementById('user-phone').value;
        const email = document.getElementById('user-email').value;
        const people = document.getElementById('user-people').value;

        // 2. اعرض البيانات في شاشة النجاح (زي الصورة)
        document.getElementById('success-date').textContent = "2025-11-04"; // TODO: استخدم selectedDate
        document.getElementById('success-time').textContent = "3:30 PM"; // TODO: استخدم selectedTime
        document.getElementById('success-people').textContent = people;
        document.getElementById('success-name').textContent = name;
        document.getElementById('success-phone').textContent = phone;
        document.getElementById('success-email').textContent = email;

        // 3. اظهر شاشة النجاح
        successMessage.classList.remove('hidden');

        
        // 4. TODO: هنا هتحط كود الـ Firebase بتاعك
        // اللي هيبعت البيانات دي (name, phone, email, people, selectedDate, selectedTime)
        // لـ Realtime Database
        
        // مثال (ده مجرد مثال، هتستخدم الكود بتاعك):
        /*
        import { getDatabase, ref, set } from "firebase/database";
        const db = getDatabase();
        set(ref(db, 'bookings/' + selectedDate + '/' + selectedTime), {
            username: name,
            email: email,
            phone: phone,
            people: people
        });
        */
    });

    // لما اليوزر يدوس "OK" في شاشة النجاح
    successOkBtn.addEventListener('click', () => {
        successMessage.classList.add('hidden'); // اخفي الشاشة
        bookingForm.reset(); // افضّي الفورم
        goToStep(1); // رجعه للخطوة الأولى
    });


    // --- 7. لوجيك اختيار الوقت والتاريخ (مؤقت) ---
    // (ده لوجيك بسيط عشان الزراير يبقى شكلها بيتغير)

    // التقويم
    const dates = document.querySelectorAll('.date-num');
    dates.forEach(date => {
        date.addEventListener('click', () => {
            // شيل 'selected' من كل التواريخ
            dates.forEach(d => d.classList.remove('selected'));
            // ضيف 'selected' للي دوست عليه بس
            date.classList.add('selected');
            selectedDate = date.textContent; // (ده مجرد مثال بسيط)
        });
    });

    // المواعيد
    const times = document.querySelectorAll('.time-slot');
    times.forEach(time => {
        time.addEventListener('click', () => {
            // شيل 'selected' من كل المواعيد
            times.forEach(t => t.classList.remove('selected'));
            // ضيف 'selected' للي دوست عليه بس
            time.classList.add('selected');
            selectedTime = time.textContent;
        });
    });

});
