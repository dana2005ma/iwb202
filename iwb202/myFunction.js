$(document).ready(function() {
    // 1. التحكم بظهور وإخفاء التفاصيل
    $('.detail-btn').click(function(e) {
        e.preventDefault();
        var mealId = $(this).attr('data-meal');
        var targetDetail = $("#detail" + mealId);
        
        // إغلاق جميع التفاصيل الأخرى
        $('.detail-row').not(targetDetail).hide();
        
        // إظهار/إخفاء التفاصيل للأكلة المحددة
        targetDetail.toggle();
    });

    // 2. التحكم بظهور النموذج (Form) عند الضغط على "متابعة"
    $("#toggleBtn").click(function() {
        var selectedMeals = $(".meal-check:checked").length;
        if (selectedMeals === 0) {
            alert("يرجى اختيار وجبة واحدة على الأقل قبل المتابعة");
            return false;
        }
        $("#modal").fadeIn(); 
    });

    // 3. زر إغلاق النافذة
    $("#close").click(function() {
        $("#modal").fadeOut();
    });

    // 4. منع إدخال غير الأرقام في حقول الموبايل والرقم الوطني
    $('#NumberPhone, #Number_s').on('input', function() {
        var node = $(this);
        node.val(node.val().replace(/\D/g, ""));
    });
});

function validateForm() {
    var name = document.getElementById("yourName").value;
    var nationalId = document.getElementById("Number_s").value;
    var phone = document.getElementById("NumberPhone").value;
    var email = document.getElementById("email").value;
    var date = document.getElementById("date").value;
    
    // --- 1. التحقق من الرقم الوطني (إلزامي) ---
    if (nationalId === "") {
        alert("حقل الرقم الوطني واجب الإدخال");
        return false;
    }
    
    if (nationalId.length !== 11 || isNaN(nationalId)) {
        alert("الرقم الوطني يجب أن يتكون من 11 رقماً");
        return false;
    }
    
    var provinceCode = nationalId.substring(0, 2);
    var validProvinces = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14"];
    if (!validProvinces.includes(provinceCode)) {
        alert("رمز المحافظة في الرقم الوطني غير صحيح (يجب أن يبدأ من 01 إلى 14)");
        return false;
    }

    // --- 2. التحقق من الاسم (اختياري - إذا مُلئ يجب أن يكون عربي فقط) ---
    if (name !== "") {
        var arabicOnly = /^[\u0600-\u06FF\s]+$/;
        if (!arabicOnly.test(name)) {
            alert("الاسم يجب أن يحتوي على أحرف عربية فقط (بدون أرقام أو رموز)");
            return false;
        }
    }

    // --- 3. التحقق من تاريخ الميلاد (اختياري - إذا مُلئ يجب أن يكون تاريخ صحيح) ---
    if (date !== "") {
        // التقويم يعطي تنسيق yyyy-mm-dd
        var datePattern = /^\d{4}-\d{2}-\d{2}$/;
        if (!datePattern.test(date)) {
            alert("يرجى إدخال تاريخ ميلاد صحيح");
            return false;
        }
    }

    // --- 4. التحقق من رقم الموبايل (اختياري - إذا مُلئ يجب أن يكون 10 أرقام - سيرياتيل و MTN) ---
    if (phone !== "") {
        var phonePattern = /^(093|098|099|094|095|096)\d{7}$/;
        if (!phonePattern.test(phone)) {
            alert("رقم الموبايل يجب أن يكون 10 أرقام ويطابق شبكات Syriatel أو MTN");
            return false;
        }
    }

    // --- 5. التحقق من الإيميل (اختياري - إذا مُلئ يجب أن يكون صحيح) ---
    if (email !== "") {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert("يرجى إدخال إيميل بصيغة صحيحة");
            return false;
        }
    }

    // --- 5. حساب الفاتورة النهائية + ضريبة 5% ---
    var total = 0;
    var orderDetails = "تم التحقق من البيانات!\n\nملخص الفاتورة:\n";
    var checkboxes = document.querySelectorAll('.meal-check:checked');

    checkboxes.forEach(function(checkbox) {
        var price = parseInt(checkbox.getAttribute('data-price'));
        var mealName = checkbox.getAttribute('data-name');
        total += price;
        orderDetails += "- " + mealName + " : " + price + " ل.س\n";
    });

    var tax = total * 0.05;
    var finalAmount = total + tax;

    orderDetails += "\nالمجموع: " + total + " ل.س";
    orderDetails += "\nالضريبة (5%): " + tax + " ل.س";
    orderDetails += "\nالمبلغ المطلوب: " + finalAmount + " ل.س";

    alert(orderDetails);
    return true; 
}