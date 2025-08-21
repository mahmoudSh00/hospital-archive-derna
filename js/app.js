// تطبيق مستشفى الوحدة العلاجي درنة - نظام الأرشيف
// تطوير: محمود شنب - 0920719250

// بيانات التطبيق
let currentUser = null;
let currentLanguage = 'ar';
let patients = [];
let admissions = [];
let deaths = [];
let users = [
    {
        username: 'amod',
        password: '1997200455',
        fullName: 'مدير النظام',
        role: 'admin',
        createdDate: new Date().toISOString(),
        status: 'active'
    }
];

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    loadDataFromStorage();
    initializeEventListeners();
    updateDashboardStats();
    
    // تعيين التاريخ الحالي للحقول
    setCurrentDateTime();
});

// تحميل البيانات من التخزين المحلي
function loadDataFromStorage() {
    const savedPatients = localStorage.getItem('hospital_patients');
    const savedAdmissions = localStorage.getItem('hospital_admissions');
    const savedDeaths = localStorage.getItem('hospital_deaths');
    const savedUsers = localStorage.getItem('hospital_users');
    
    if (savedPatients) patients = JSON.parse(savedPatients);
    if (savedAdmissions) admissions = JSON.parse(savedAdmissions);
    if (savedDeaths) deaths = JSON.parse(savedDeaths);
    
    if (savedUsers) {
        const loadedUsers = JSON.parse(savedUsers);
        // التحقق من وجود المستخدم الجديد، وإذا لم يكن موجوداً، إضافته
        const newAdminExists = loadedUsers.find(u => u.username === 'amod');
        if (!newAdminExists) {
            // إزالة المستخدم القديم إذا كان موجوداً
            const filteredUsers = loadedUsers.filter(u => u.username !== 'mm');
            // إضافة المستخدم الجديد
            filteredUsers.unshift({
                username: 'amod',
                password: '1997200455',
                fullName: 'مدير النظام',
                role: 'admin',
                createdDate: new Date().toISOString(),
                status: 'active'
            });
            users = filteredUsers;
            // حفظ البيانات المحدثة
            saveDataToStorage();
        } else {
            users = loadedUsers;
        }
    }
}

// حفظ البيانات في التخزين المحلي
function saveDataToStorage() {
    localStorage.setItem('hospital_patients', JSON.stringify(patients));
    localStorage.setItem('hospital_admissions', JSON.stringify(admissions));
    localStorage.setItem('hospital_deaths', JSON.stringify(deaths));
    localStorage.setItem('hospital_users', JSON.stringify(users));
}

// تهيئة مستمعي الأحداث
function initializeEventListeners() {
    // تسجيل الدخول
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // البحث في المرضى
    document.getElementById('patientSearch').addEventListener('input', searchPatients);
    document.getElementById('patientFilter').addEventListener('change', filterPatients);
}

// معالجة تسجيل الدخول
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const language = document.getElementById('language').value;
    
    // تشخيص مؤقت
    console.log('محاولة تسجيل الدخول:');
    console.log('اسم المستخدم المدخل:', username);
    console.log('كلمة المرور المدخلة:', password);
    console.log('المستخدمون المتاحون:', users);
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        currentLanguage = language;
        
        document.getElementById('loginPage').classList.add('d-none');
        document.getElementById('mainApp').classList.remove('d-none');
        document.getElementById('currentUser').textContent = user.fullName;
        
        showSuccessMessage('تم تسجيل الدخول بنجاح');
        loadAllData();
    } else {
        // تشخيص إضافي
        console.log('فشل تسجيل الدخول - لم يتم العثور على مطابقة');
        users.forEach((u, index) => {
            console.log(`المستخدم ${index + 1}:`, {
                username: u.username,
                password: u.password,
                usernameMatch: u.username === username,
                passwordMatch: u.password === password
            });
        });
        showErrorMessage('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
}

// تسجيل الخروج
function logout() {
    currentUser = null;
    document.getElementById('loginPage').classList.remove('d-none');
    document.getElementById('mainApp').classList.add('d-none');
    
    // إعادة تعيين النموذج
    document.getElementById('loginForm').reset();
}

// عرض القسم المحدد
function showSection(sectionName) {
    // إخفاء جميع الأقسام
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.add('d-none'));
    
    // إزالة الفئة النشطة من جميع الروابط
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // عرض القسم المحدد
    document.getElementById(sectionName).classList.remove('d-none');
    
    // إضافة الفئة النشطة للرابط المحدد
    event.target.classList.add('active');
    
    // تحديث البيانات حسب القسم
    switch(sectionName) {
        case 'dashboard':
            updateDashboardStats();
            loadRecentActivities();
            loadNotifications();
            break;
        case 'patients':
            loadPatientsTable();
            break;
        case 'admissions':
            loadAdmissionsTable();
            break;
        case 'deaths':
            loadDeathsTable();
            break;
        case 'users':
            loadUsersTable();
            break;
    }
}

// تحديث إحصائيات لوحة التحكم
function updateDashboardStats() {
    document.getElementById('totalPatients').textContent = patients.length;
    
    const today = new Date().toDateString();
    const todayAdmissions = admissions.filter(a => 
        new Date(a.admissionDate).toDateString() === today
    ).length;
    document.getElementById('todayAdmissions').textContent = todayAdmissions;
    
    const todayDischarges = admissions.filter(a => 
        a.dischargeDate && new Date(a.dischargeDate).toDateString() === today
    ).length;
    document.getElementById('todayDischarges').textContent = todayDischarges;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyDeaths = deaths.filter(d => {
        const deathDate = new Date(d.deathDate);
        return deathDate.getMonth() === currentMonth && deathDate.getFullYear() === currentYear;
    }).length;
    document.getElementById('monthlyDeaths').textContent = monthlyDeaths;
}

// تحميل الأنشطة الأخيرة
function loadRecentActivities() {
    const recentActivitiesContainer = document.getElementById('recentActivities');
    let activities = [];
    
    // إضافة أحدث المرضى
    const recentPatients = patients.slice(-5).reverse();
    recentPatients.forEach(patient => {
        activities.push({
            type: 'patient',
            message: `تم إضافة مريض جديد: ${patient.name}`,
            time: patient.createdDate,
            icon: 'fa-user-plus',
            color: 'text-primary'
        });
    });
    
    // إضافة أحدث حالات الدخول
    const recentAdmissions = admissions.slice(-3).reverse();
    recentAdmissions.forEach(admission => {
        const patient = patients.find(p => p.id === admission.patientId);
        activities.push({
            type: 'admission',
            message: `دخول مريض: ${patient ? patient.name : 'غير معروف'}`,
            time: admission.admissionDate,
            icon: 'fa-hospital',
            color: 'text-success'
        });
    });
    
    // ترتيب الأنشطة حسب التاريخ
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    
    // عرض الأنشطة
    recentActivitiesContainer.innerHTML = activities.slice(0, 10).map(activity => `
        <div class="d-flex align-items-center mb-3">
            <div class="flex-shrink-0">
                <i class="fas ${activity.icon} ${activity.color}"></i>
            </div>
            <div class="flex-grow-1 ms-3">
                <div class="small text-gray-500">${formatDateTime(activity.time)}</div>
                <div>${activity.message}</div>
            </div>
        </div>
    `).join('');
}

// تحميل التنبيهات
function loadNotifications() {
    const notificationsContainer = document.getElementById('notifications');
    let notifications = [];
    
    // تنبيهات المرضى الذين لم يخرجوا لفترة طويلة
    const longStayPatients = admissions.filter(a => {
        if (a.dischargeDate) return false;
        const admissionDate = new Date(a.admissionDate);
        const daysDiff = (new Date() - admissionDate) / (1000 * 60 * 60 * 24);
        return daysDiff > 30;
    });
    
    if (longStayPatients.length > 0) {
        notifications.push({
            type: 'warning',
            message: `${longStayPatients.length} مريض في المستشفى لأكثر من 30 يوم`,
            icon: 'fa-exclamation-triangle',
            color: 'text-warning'
        });
    }
    
    // تنبيهات حالات الوفاة الأخيرة
    const recentDeaths = deaths.filter(d => {
        const deathDate = new Date(d.deathDate);
        const daysDiff = (new Date() - deathDate) / (1000 * 60 * 60 * 24);
        return daysDiff <= 7;
    });
    
    if (recentDeaths.length > 0) {
        notifications.push({
            type: 'danger',
            message: `${recentDeaths.length} حالة وفاة في الأسبوع الماضي`,
            icon: 'fa-cross',
            color: 'text-danger'
        });
    }
    
    // عرض التنبيهات
    if (notifications.length === 0) {
        notificationsContainer.innerHTML = '<p class="text-muted">لا توجد تنبيهات جديدة</p>';
    } else {
        notificationsContainer.innerHTML = notifications.map(notification => `
            <div class="alert alert-${notification.type === 'warning' ? 'warning' : 'danger'} alert-dismissible fade show" role="alert">
                <i class="fas ${notification.icon} me-2"></i>
                ${notification.message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `).join('');
    }
}

// إضافة مريض جديد
function addPatient() {
    const form = document.getElementById('addPatientForm');
    const formData = new FormData(form);
    
    const patient = {
        id: generateId(),
        name: document.getElementById('patientName').value,
        birthDate: document.getElementById('patientBirthDate').value,
        gender: document.getElementById('patientGender').value,
        phone: document.getElementById('patientPhone').value,
        address: document.getElementById('patientAddress').value,
        bloodType: document.getElementById('patientBloodType').value,
        emergencyContact: document.getElementById('patientEmergencyContact').value,
        medicalHistory: document.getElementById('patientMedicalHistory').value,
        currentMedications: document.getElementById('patientCurrentMedications').value,
        status: 'active',
        createdDate: new Date().toISOString(),
        createdBy: currentUser.username
    };
    
    patients.push(patient);
    saveDataToStorage();
    
    // إغلاق النافذة المنبثقة
    const modal = bootstrap.Modal.getInstance(document.getElementById('addPatientModal'));
    modal.hide();
    
    // إعادة تعيين النموذج
    form.reset();
    
    // تحديث الجدول
    loadPatientsTable();
    updateDashboardStats();
    
    showSuccessMessage('تم إضافة المريض بنجاح');
}

// تحميل جدول المرضى
function loadPatientsTable() {
    const tableBody = document.getElementById('patientsTable');
    
    if (patients.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center">لا توجد بيانات مرضى</td></tr>';
        return;
    }
    
    tableBody.innerHTML = patients.map(patient => `
        <tr>
            <td>${patient.id}</td>
            <td>${patient.name}</td>
            <td>${formatDate(patient.birthDate)}</td>
            <td>${patient.gender === 'male' ? 'ذكر' : 'أنثى'}</td>
            <td>${patient.phone || '-'}</td>
            <td><span class="status-${patient.status}">${getStatusText(patient.status)}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewPatient('${patient.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning" onclick="editPatient('${patient.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deletePatient('${patient.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// البحث في المرضى
function searchPatients() {
    const searchTerm = document.getElementById('patientSearch').value.toLowerCase();
    const filteredPatients = patients.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm) ||
        patient.id.toLowerCase().includes(searchTerm) ||
        patient.phone.includes(searchTerm)
    );
    
    displayFilteredPatients(filteredPatients);
}

// تصفية المرضى
function filterPatients() {
    const filterValue = document.getElementById('patientFilter').value;
    let filteredPatients = patients;
    
    if (filterValue) {
        filteredPatients = patients.filter(patient => patient.status === filterValue);
    }
    
    displayFilteredPatients(filteredPatients);
}

// عرض المرضى المفلترين
function displayFilteredPatients(filteredPatients) {
    const tableBody = document.getElementById('patientsTable');
    
    if (filteredPatients.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center">لا توجد نتائج</td></tr>';
        return;
    }
    
    tableBody.innerHTML = filteredPatients.map(patient => `
        <tr>
            <td>${patient.id}</td>
            <td>${patient.name}</td>
            <td>${formatDate(patient.birthDate)}</td>
            <td>${patient.gender === 'male' ? 'ذكر' : 'أنثى'}</td>
            <td>${patient.phone || '-'}</td>
            <td><span class="status-${patient.status}">${getStatusText(patient.status)}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewPatient('${patient.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning" onclick="editPatient('${patient.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deletePatient('${patient.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// إضافة حالة دخول
function addAdmission() {
    const patientId = document.getElementById('admissionPatientId').value;
    const patient = patients.find(p => p.id === patientId);
    
    if (!patient) {
        showErrorMessage('رقم ملف المريض غير موجود');
        return;
    }
    
    const admission = {
        id: generateId(),
        patientId: patientId,
        patientName: patient.name,
        admissionDate: document.getElementById('admissionDate').value,
        reason: document.getElementById('admissionReason').value,
        department: document.getElementById('admissionDepartment').value,
        doctor: document.getElementById('admissionDoctor').value,
        status: 'admitted',
        createdDate: new Date().toISOString(),
        createdBy: currentUser.username
    };
    
    admissions.push(admission);
    
    // تحديث حالة المريض
    patient.status = 'admitted';
    
    saveDataToStorage();
    
    // إغلاق النافذة المنبثقة
    const modal = bootstrap.Modal.getInstance(document.getElementById('addAdmissionModal'));
    modal.hide();
    
    // إعادة تعيين النموذج
    document.getElementById('addAdmissionForm').reset();
    
    // تحديث الجداول
    loadAdmissionsTable();
    loadPatientsTable();
    updateDashboardStats();
    
    showSuccessMessage('تم تسجيل دخول المريض بنجاح');
}

// إضافة حالة خروج
function addDischarge() {
    const patientId = document.getElementById('dischargePatientId').value;
    const patient = patients.find(p => p.id === patientId);
    
    if (!patient) {
        showErrorMessage('رقم ملف المريض غير موجود');
        return;
    }
    
    // البحث عن حالة الدخول النشطة
    const activeAdmission = admissions.find(a => 
        a.patientId === patientId && a.status === 'admitted'
    );
    
    if (!activeAdmission) {
        showErrorMessage('لا توجد حالة دخول نشطة لهذا المريض');
        return;
    }
    
    // تحديث حالة الدخول
    activeAdmission.dischargeDate = document.getElementById('dischargeDate').value;
    activeAdmission.dischargeCondition = document.getElementById('dischargeCondition').value;
    activeAdmission.dischargeInstructions = document.getElementById('dischargeInstructions').value;
    activeAdmission.dischargeMedications = document.getElementById('dischargeMedications').value;
    activeAdmission.status = 'discharged';
    
    // تحديث حالة المريض
    patient.status = 'discharged';
    
    saveDataToStorage();
    
    // إغلاق النافذة المنبثقة
    const modal = bootstrap.Modal.getInstance(document.getElementById('addDischargeModal'));
    modal.hide();
    
    // إعادة تعيين النموذج
    document.getElementById('addDischargeForm').reset();
    
    // تحديث الجداول
    loadAdmissionsTable();
    loadPatientsTable();
    updateDashboardStats();
    
    showSuccessMessage('تم تسجيل خروج المريض بنجاح');
}

// تحميل جدول الدخول والخروج
function loadAdmissionsTable() {
    const tableBody = document.getElementById('admissionsTable');
    
    if (admissions.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center">لا توجد بيانات دخول وخروج</td></tr>';
        return;
    }
    
    tableBody.innerHTML = admissions.map(admission => `
        <tr>
            <td>${admission.patientId}</td>
            <td>${admission.patientName}</td>
            <td>${formatDateTime(admission.admissionDate)}</td>
            <td>${admission.dischargeDate ? formatDateTime(admission.dischargeDate) : '-'}</td>
            <td>${admission.reason}</td>
            <td><span class="status-${admission.status}">${getStatusText(admission.status)}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewAdmission('${admission.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                ${admission.status === 'admitted' ? 
                    `<button class="btn btn-sm btn-warning" onclick="dischargePatient('${admission.patientId}')">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>` : ''
                }
            </td>
        </tr>
    `).join('');
}

// إضافة حالة وفاة
function addDeath() {
    const patientId = document.getElementById('deathPatientId').value;
    const patient = patients.find(p => p.id === patientId);
    
    if (!patient) {
        showErrorMessage('رقم ملف المريض غير موجود');
        return;
    }
    
    const death = {
        id: generateId(),
        patientId: patientId,
        patientName: patient.name,
        deathDate: document.getElementById('deathDate').value,
        cause: document.getElementById('deathCause').value,
        doctor: document.getElementById('deathDoctor').value,
        notes: document.getElementById('deathNotes').value,
        age: calculateAge(patient.birthDate),
        createdDate: new Date().toISOString(),
        createdBy: currentUser.username
    };
    
    deaths.push(death);
    
    // تحديث حالة المريض
    patient.status = 'deceased';
    
    // إنهاء أي حالة دخول نشطة
    const activeAdmission = admissions.find(a => 
        a.patientId === patientId && a.status === 'admitted'
    );
    if (activeAdmission) {
        activeAdmission.status = 'deceased';
        activeAdmission.dischargeDate = death.deathDate;
    }
    
    saveDataToStorage();
    
    // إغلاق النافذة المنبثقة
    const modal = bootstrap.Modal.getInstance(document.getElementById('addDeathModal'));
    modal.hide();
    
    // إعادة تعيين النموذج
    document.getElementById('addDeathForm').reset();
    
    // تحديث الجداول
    loadDeathsTable();
    loadPatientsTable();
    loadAdmissionsTable();
    updateDashboardStats();
    
    showSuccessMessage('تم تسجيل حالة الوفاة');
}

// تحميل جدول الوفيات
function loadDeathsTable() {
    const tableBody = document.getElementById('deathsTable');
    
    if (deaths.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">لا توجد بيانات وفيات</td></tr>';
        return;
    }
    
    tableBody.innerHTML = deaths.map(death => `
        <tr>
            <td>${death.patientId}</td>
            <td>${death.patientName}</td>
            <td>${formatDateTime(death.deathDate)}</td>
            <td>${death.cause}</td>
            <td>${death.age} سنة</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewDeath('${death.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-info" onclick="printDeathCertificate('${death.id}')">
                    <i class="fas fa-print"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// إضافة مستخدم جديد
function addUser() {
    const username = document.getElementById('newUsername').value;
    const fullName = document.getElementById('newUserFullName').value;
    const password = document.getElementById('newUserPassword').value;
    const role = document.getElementById('newUserRole').value;
    const email = document.getElementById('newUserEmail').value;
    
    // التحقق من عدم وجود المستخدم
    if (users.find(u => u.username === username)) {
        showErrorMessage('اسم المستخدم موجود بالفعل');
        return;
    }
    
    const user = {
        username: username,
        fullName: fullName,
        password: password,
        role: role,
        email: email,
        status: 'active',
        createdDate: new Date().toISOString(),
        createdBy: currentUser.username
    };
    
    users.push(user);
    saveDataToStorage();
    
    // إغلاق النافذة المنبثقة
    const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
    modal.hide();
    
    // إعادة تعيين النموذج
    document.getElementById('addUserForm').reset();
    
    // تحديث الجدول
    loadUsersTable();
    
    showSuccessMessage('تم إضافة المستخدم بنجاح');
}

// تحميل جدول المستخدمين
function loadUsersTable() {
    const tableBody = document.getElementById('usersTable');
    
    tableBody.innerHTML = users.map(user => `
        <tr>
            <td>${user.username}</td>
            <td>${user.fullName}</td>
            <td>${getRoleText(user.role)}</td>
            <td>${formatDate(user.createdDate)}</td>
            <td><span class="status-${user.status}">${getStatusText(user.status)}</span></td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editUser('${user.username}')">
                    <i class="fas fa-edit"></i>
                </button>
                ${user.username !== 'amod' ? 
                    `<button class="btn btn-sm btn-danger" onclick="deleteUser('${user.username}')">
                        <i class="fas fa-trash"></i>
                    </button>` : ''
                }
            </td>
        </tr>
    `).join('');
}

// إنشاء التقارير
function generateReport(type) {
    let reportData = [];
    let reportTitle = '';
    
    switch(type) {
        case 'patients':
            reportData = patients;
            reportTitle = 'تقرير المرضى';
            break;
        case 'admissions':
            reportData = admissions;
            reportTitle = 'تقرير الدخول والخروج';
            break;
        case 'deaths':
            reportData = deaths;
            reportTitle = 'تقرير الوفيات';
            break;
    }
    
    if (reportData.length === 0) {
        showErrorMessage('لا توجد بيانات لإنشاء التقرير');
        return;
    }
    
    // تصدير إلى CSV
    exportToCSV(reportData, reportTitle);
    showSuccessMessage('تم إنشاء التقرير وتصديره بنجاح');
}

// تصدير البيانات إلى CSV
function exportToCSV(data, filename) {
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename + '.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// تحويل البيانات إلى تنسيق CSV
function convertToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    
    const csvRows = data.map(row => {
        return headers.map(header => {
            const value = row[header];
            return typeof value === 'string' ? `"${value}"` : value;
        }).join(',');
    });
    
    return [csvHeaders, ...csvRows].join('\n');
}

// تغيير اللغة
function changeLanguage() {
    currentLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
    
    if (currentLanguage === 'en') {
        document.documentElement.setAttribute('lang', 'en');
        document.documentElement.setAttribute('dir', 'ltr');
    } else {
        document.documentElement.setAttribute('lang', 'ar');
        document.documentElement.setAttribute('dir', 'rtl');
    }
    
    // هنا يمكن إضافة المزيد من منطق تغيير اللغة
    showSuccessMessage('تم تغيير اللغة');
}

// تحميل جميع البيانات
function loadAllData() {
    loadPatientsTable();
    loadAdmissionsTable();
    loadDeathsTable();
    loadUsersTable();
    updateDashboardStats();
    loadRecentActivities();
    loadNotifications();
}

// تعيين التاريخ والوقت الحالي
function setCurrentDateTime() {
    const now = new Date();
    const currentDateTime = now.toISOString().slice(0, 16);
    
    // تعيين التاريخ الحالي لحقول التاريخ
    const dateTimeInputs = document.querySelectorAll('input[type="datetime-local"]');
    dateTimeInputs.forEach(input => {
        if (!input.value) {
            input.value = currentDateTime;
        }
    });
}

// الوظائف المساعدة
function generateId() {
    return 'ID' + Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
}

function formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('ar-SA');
}

function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}

function getStatusText(status) {
    const statusMap = {
        'active': 'نشط',
        'admitted': 'في المستشفى',
        'discharged': 'مخرج',
        'deceased': 'متوفى'
    };
    return statusMap[status] || status;
}

function getRoleText(role) {
    const roleMap = {
        'admin': 'مدير',
        'doctor': 'طبيب',
        'nurse': 'ممرض',
        'clerk': 'موظف أرشيف'
    };
    return roleMap[role] || role;
}

function showSuccessMessage(message) {
    document.getElementById('successMessage').textContent = message;
    const toast = new bootstrap.Toast(document.getElementById('successToast'));
    toast.show();
}

function showErrorMessage(message) {
    document.getElementById('errorMessage').textContent = message;
    const toast = new bootstrap.Toast(document.getElementById('errorToast'));
    toast.show();
}

// وظائف إضافية للعرض والتحرير والحذف
function viewPatient(patientId) {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
        // يمكن إضافة نافذة منبثقة لعرض تفاصيل المريض
        alert(`تفاصيل المريض:\nالاسم: ${patient.name}\nتاريخ الميلاد: ${formatDate(patient.birthDate)}\nالهاتف: ${patient.phone}`);
    }
}

function editPatient(patientId) {
    // يمكن إضافة نافذة منبثقة لتحرير بيانات المريض
    showSuccessMessage('ميزة التحرير قيد التطوير');
}

function deletePatient(patientId) {
    if (confirm('هل أنت متأكد من حذف هذا المريض؟')) {
        const index = patients.findIndex(p => p.id === patientId);
        if (index > -1) {
            patients.splice(index, 1);
            saveDataToStorage();
            loadPatientsTable();
            updateDashboardStats();
            showSuccessMessage('تم حذف المريض بنجاح');
        }
    }
}

function viewAdmission(admissionId) {
    const admission = admissions.find(a => a.id === admissionId);
    if (admission) {
        alert(`تفاصيل الدخول:\nالمريض: ${admission.patientName}\nتاريخ الدخول: ${formatDateTime(admission.admissionDate)}\nالسبب: ${admission.reason}`);
    }
}

function dischargePatient(patientId) {
    document.getElementById('dischargePatientId').value = patientId;
    const modal = new bootstrap.Modal(document.getElementById('addDischargeModal'));
    modal.show();
}

function viewDeath(deathId) {
    const death = deaths.find(d => d.id === deathId);
    if (death) {
        alert(`تفاصيل الوفاة:\nالمتوفى: ${death.patientName}\nتاريخ الوفاة: ${formatDateTime(death.deathDate)}\nالسبب: ${death.cause}`);
    }
}

function printDeathCertificate(deathId) {
    const death = deaths.find(d => d.id === deathId);
    if (death) {
        // يمكن إضافة منطق طباعة شهادة الوفاة
        showSuccessMessage('ميزة طباعة شهادة الوفاة قيد التطوير');
    }
}

function editUser(username) {
    showSuccessMessage('ميزة تحرير المستخدم قيد التطوير');
}

function deleteUser(username) {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
        const index = users.findIndex(u => u.username === username);
        if (index > -1) {
            users.splice(index, 1);
            saveDataToStorage();
            loadUsersTable();
            showSuccessMessage('تم حذف المستخدم بنجاح');
        }
    }
}

// إعادة تعيين بيانات المستخدم
function resetUserData() {
    if (confirm('هل أنت متأكد من إعادة تعيين بيانات المستخدم؟ سيتم حذف جميع البيانات المحفوظة.')) {
        // مسح جميع البيانات من التخزين المحلي
        localStorage.removeItem('hospital_patients');
        localStorage.removeItem('hospital_admissions');
        localStorage.removeItem('hospital_deaths');
        localStorage.removeItem('hospital_users');
        localStorage.removeItem('hospital_session');
        
        // إعادة تعيين المتغيرات
        patients = [];
        admissions = [];
        deaths = [];
        users = [
            {
                username: 'amod',
                password: '1997200455',
                fullName: 'مدير النظام',
                role: 'admin',
                createdDate: new Date().toISOString(),
                status: 'active'
            }
        ];
        
        // حفظ البيانات الجديدة
        saveDataToStorage();
        
        showSuccessMessage('تم إعادة تعيين البيانات بنجاح. يمكنك الآن تسجيل الدخول بالبيانات الجديدة.');
    }
}

// دوال عرض الرسائل
function showSuccessMessage(message) {
    showMessage(message, 'success');
}

function showErrorMessage(message) {
    showMessage(message, 'error');
}

function showWarningMessage(message) {
    showMessage(message, 'warning');
}

function showInfoMessage(message) {
    showMessage(message, 'info');
}

function showMessage(message, type = 'info') {
    // إنشاء عنصر التنبيه
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${getBootstrapAlertClass(type)} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        max-width: 500px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    
    alertDiv.innerHTML = `
        <i class="fas ${getMessageIcon(type)} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // إضافة التنبيه إلى الصفحة
    document.body.appendChild(alertDiv);
    
    // إزالة التنبيه تلقائياً بعد 5 ثوان
    setTimeout(() => {
        if (alertDiv && alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

function getBootstrapAlertClass(type) {
    const classes = {
        'success': 'success',
        'error': 'danger',
        'warning': 'warning',
        'info': 'info'
    };
    return classes[type] || 'info';
}

function getMessageIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || 'fa-info-circle';
}

// دوال مساعدة مفقودة
function loadAllData() {
    loadPatientsTable();
    loadAdmissionsTable();
    loadDeathsTable();
    loadUsersTable();
    updateDashboardStats();
}

function formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('ar-EG', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

function calculateAge(birthDate) {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}

function generateId() {
    return 'P' + Date.now().toString() + Math.random().toString(36).substr(2, 5);
}

function getStatusText(status) {
    const statusTexts = {
        'active': 'نشط',
        'admitted': 'في المستشفى',
        'discharged': 'مخرج',
        'deceased': 'متوفى'
    };
    return statusTexts[status] || status;
}

function setCurrentDateTime() {
    const now = new Date();
    const dateTimeString = now.toISOString().slice(0, 16);
    
    // تعيين التاريخ والوقت الحالي للحقول المناسبة
    const dateTimeFields = document.querySelectorAll('input[type="datetime-local"]');
    dateTimeFields.forEach(field => {
        if (!field.value) {
            field.value = dateTimeString;
        }
    });
    
    const dateFields = document.querySelectorAll('input[type="date"]');
    dateFields.forEach(field => {
        if (!field.value) {
            field.value = now.toISOString().slice(0, 10);
        }
    });
}

// دوال تحميل الجداول المفقودة
function loadAdmissionsTable() {
    const tableBody = document.getElementById('admissionsTable');
    if (!tableBody) return;
    
    if (admissions.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center">لا توجد بيانات دخول</td></tr>';
        return;
    }
    
    tableBody.innerHTML = admissions.map(admission => `
        <tr>
            <td>${admission.id || '-'}</td>
            <td>${admission.patientName || '-'}</td>
            <td>${formatDateTime(admission.admissionDate)}</td>
            <td>${admission.dischargeDate ? formatDateTime(admission.dischargeDate) : 'لم يخرج بعد'}</td>
            <td>${admission.department || '-'}</td>
            <td><span class="status-${admission.status}">${getStatusText(admission.status)}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewAdmission('${admission.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning" onclick="editAdmission('${admission.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteAdmission('${admission.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function loadDeathsTable() {
    const tableBody = document.getElementById('deathsTable');
    if (!tableBody) return;
    
    if (deaths.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">لا توجد بيانات وفيات</td></tr>';
        return;
    }
    
    tableBody.innerHTML = deaths.map(death => `
        <tr>
            <td>${death.id || '-'}</td>
            <td>${death.patientName || '-'}</td>
            <td>${formatDateTime(death.deathDate)}</td>
            <td>${death.cause || '-'}</td>
            <td>${death.doctor || '-'}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewDeath('${death.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-info" onclick="printDeathCertificate('${death.id}')">
                    <i class="fas fa-print"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function loadUsersTable() {
    const tableBody = document.getElementById('usersTable');
    if (!tableBody) return;
    
    if (users.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">لا توجد بيانات مستخدمين</td></tr>';
        return;
    }
    
    tableBody.innerHTML = users.map(user => `
        <tr>
            <td>${user.username}</td>
            <td>${user.fullName}</td>
            <td>${user.role === 'admin' ? 'مدير' : user.role}</td>
            <td><span class="status-${user.status}">${getStatusText(user.status)}</span></td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editUser('${user.username}')">
                    <i class="fas fa-edit"></i>
                </button>
                ${user.username !== 'amod' ? `
                    <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.username}')">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

// دوال العرض والتحرير المفقودة
function viewPatient(patientId) {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
        alert(`تفاصيل المريض:\nالاسم: ${patient.name}\nالعمر: ${calculateAge(patient.birthDate)} سنة\nالهاتف: ${patient.phone || 'غير محدد'}`);
    }
}

function editPatient(patientId) {
    showInfoMessage('ميزة تحرير المريض قيد التطوير');
}

function deletePatient(patientId) {
    if (confirm('هل أنت متأكد من حذف هذا المريض؟')) {
        const index = patients.findIndex(p => p.id === patientId);
        if (index > -1) {
            patients.splice(index, 1);
            saveDataToStorage();
            loadPatientsTable();
            updateDashboardStats();
            showSuccessMessage('تم حذف المريض بنجاح');
        }
    }
}

function viewAdmission(admissionId) {
    const admission = admissions.find(a => a.id === admissionId);
    if (admission) {
        alert(`تفاصيل الدخول:\nالمريض: ${admission.patientName}\nتاريخ الدخول: ${formatDateTime(admission.admissionDate)}\nالسبب: ${admission.reason}`);
    }
}

function editAdmission(admissionId) {
    showInfoMessage('ميزة تحرير الدخول قيد التطوير');
}

function deleteAdmission(admissionId) {
    if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
        const index = admissions.findIndex(a => a.id === admissionId);
        if (index > -1) {
            admissions.splice(index, 1);
            saveDataToStorage();
            loadAdmissionsTable();
            updateDashboardStats();
            showSuccessMessage('تم حذف السجل بنجاح');
        }
    }
}

// دالة تغيير اللغة
function changeLanguage() {
    const newLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
    currentLanguage = newLanguage;
    
    // تحديث اتجاه الصفحة
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLanguage;
    
    showInfoMessage('تم تغيير اللغة. ميزة الترجمة الكاملة قيد التطوير.');
}

// دوال البحث والتصفية المفقودة
function displayFilteredPatients(filteredPatients) {
    const tableBody = document.getElementById('patientsTable');
    if (!tableBody) return;
    
    if (filteredPatients.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center">لا توجد نتائج مطابقة</td></tr>';
        return;
    }
    
    tableBody.innerHTML = filteredPatients.map(patient => `
        <tr>
            <td>${patient.id}</td>
            <td>${patient.name}</td>
            <td>${formatDate(patient.birthDate)}</td>
            <td>${patient.gender === 'male' ? 'ذكر' : 'أنثى'}</td>
            <td>${patient.phone || '-'}</td>
            <td><span class="status-${patient.status}">${getStatusText(patient.status)}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewPatient('${patient.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning" onclick="editPatient('${patient.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deletePatient('${patient.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}