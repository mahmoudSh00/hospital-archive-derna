// ملف التكوين والإعدادات - مستشفى الوحدة العلاجي درنة
// تطوير: محمود شنب - 0920719250

// إعدادات النظام الأساسية
const SYSTEM_CONFIG = {
    // معلومات المستشفى
    hospital: {
        name: 'مستشفى الوحدة العلاجي درنة',
        nameEn: 'Al-Wahda Therapeutic Hospital Derna',
        address: 'درنة، ليبيا',
        phone: '+218-XX-XXXXXXX',
        email: 'info@alwahda-hospital.ly',
        website: 'www.alwahda-hospital.ly'
    },
    
    // معلومات المطور
    developer: {
        name: 'محمود شنب',
        phone: '0920719250',
        email: 'mahmoud.shanab@example.com'
    },
    
    // إعدادات النظام
    system: {
        version: '1.0.0',
        buildDate: '2024-01-01',
        defaultLanguage: 'ar',
        supportedLanguages: ['ar', 'en'],
        sessionTimeout: 30, // بالدقائق
        autoSaveInterval: 5, // بالدقائق
        maxFileSize: 5, // بالميجابايت
        dateFormat: 'YYYY-MM-DD',
        timeFormat: '24h'
    },
    
    // إعدادات قاعدة البيانات المحلية
    storage: {
        prefix: 'hospital_',
        keys: {
            patients: 'hospital_patients',
            admissions: 'hospital_admissions',
            deaths: 'hospital_deaths',
            users: 'hospital_users',
            settings: 'hospital_settings',
            session: 'hospital_session'
        }
    },
    
    // إعدادات الأمان
    security: {
        minPasswordLength: 8,
        maxLoginAttempts: 3,
        lockoutDuration: 15, // بالدقائق
        requireStrongPassword: false,
        enableTwoFactor: false
    },
    
    // إعدادات الواجهة
    ui: {
        theme: 'light',
        primaryColor: '#007bff',
        secondaryColor: '#6c757d',
        successColor: '#28a745',
        dangerColor: '#dc3545',
        warningColor: '#ffc107',
        infoColor: '#17a2b8',
        animationDuration: 300,
        toastDuration: 5000
    },
    
    // إعدادات التقارير
    reports: {
        defaultFormat: 'csv',
        supportedFormats: ['csv', 'json', 'pdf'],
        maxRecords: 10000,
        includeHeaders: true,
        dateRange: 'all' // all, month, year, custom
    },
    
    // إعدادات النسخ الاحتياطي
    backup: {
        autoBackup: false,
        backupInterval: 7, // بالأيام
        maxBackups: 10,
        includeUsers: false,
        compressionLevel: 'medium'
    },
    
    // إعدادات التنبيهات
    notifications: {
        enabled: true,
        types: {
            newPatient: true,
            admission: true,
            discharge: true,
            death: true,
            longStay: true,
            systemAlert: true
        },
        sound: false,
        duration: 5000
    },
    
    // إعدادات البحث
    search: {
        minSearchLength: 2,
        maxResults: 100,
        highlightResults: true,
        caseSensitive: false,
        fuzzySearch: true
    },
    
    // إعدادات الطباعة
    print: {
        paperSize: 'A4',
        orientation: 'portrait',
        margins: '1cm',
        includeHeader: true,
        includeFooter: true,
        includeDate: true,
        includePageNumbers: true
    }
};

// قوائم البيانات المرجعية
const REFERENCE_DATA = {
    // الأقسام الطبية
    departments: [
        { id: 'emergency', name: 'الطوارئ', nameEn: 'Emergency' },
        { id: 'internal', name: 'الباطنة', nameEn: 'Internal Medicine' },
        { id: 'surgery', name: 'الجراحة', nameEn: 'Surgery' },
        { id: 'pediatrics', name: 'الأطفال', nameEn: 'Pediatrics' },
        { id: 'obstetrics', name: 'النساء والولادة', nameEn: 'Obstetrics & Gynecology' },
        { id: 'icu', name: 'العناية المركزة', nameEn: 'ICU' },
        { id: 'cardiology', name: 'القلب', nameEn: 'Cardiology' },
        { id: 'orthopedics', name: 'العظام', nameEn: 'Orthopedics' },
        { id: 'neurology', name: 'الأعصاب', nameEn: 'Neurology' },
        { id: 'oncology', name: 'الأورام', nameEn: 'Oncology' }
    ],
    
    // فصائل الدم
    bloodTypes: [
        'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
    ],
    
    // الأجناس
    genders: [
        { id: 'male', name: 'ذكر', nameEn: 'Male' },
        { id: 'female', name: 'أنثى', nameEn: 'Female' }
    ],
    
    // حالات المرضى
    patientStatuses: [
        { id: 'active', name: 'نشط', nameEn: 'Active', color: 'success' },
        { id: 'admitted', name: 'في المستشفى', nameEn: 'Admitted', color: 'info' },
        { id: 'discharged', name: 'مخرج', nameEn: 'Discharged', color: 'warning' },
        { id: 'deceased', name: 'متوفى', nameEn: 'Deceased', color: 'danger' }
    ],
    
    // حالات الدخول
    admissionStatuses: [
        { id: 'admitted', name: 'في المستشفى', nameEn: 'Admitted', color: 'info' },
        { id: 'discharged', name: 'مخرج', nameEn: 'Discharged', color: 'success' },
        { id: 'transferred', name: 'محول', nameEn: 'Transferred', color: 'warning' },
        { id: 'deceased', name: 'متوفى', nameEn: 'Deceased', color: 'danger' }
    ],
    
    // حالات الخروج
    dischargeConditions: [
        { id: 'recovered', name: 'شفاء تام', nameEn: 'Fully Recovered' },
        { id: 'improved', name: 'تحسن', nameEn: 'Improved' },
        { id: 'stable', name: 'حالة مستقرة', nameEn: 'Stable' },
        { id: 'transferred', name: 'تحويل لمستشفى آخر', nameEn: 'Transferred' },
        { id: 'against_advice', name: 'خروج ضد المشورة الطبية', nameEn: 'Against Medical Advice' }
    ],
    
    // أدوار المستخدمين
    userRoles: [
        { 
            id: 'admin', 
            name: 'مدير', 
            nameEn: 'Administrator',
            permissions: ['all']
        },
        { 
            id: 'doctor', 
            name: 'طبيب', 
            nameEn: 'Doctor',
            permissions: ['patients', 'admissions', 'deaths', 'reports']
        },
        { 
            id: 'nurse', 
            name: 'ممرض', 
            nameEn: 'Nurse',
            permissions: ['patients', 'admissions', 'basic_reports']
        },
        { 
            id: 'clerk', 
            name: 'موظف أرشيف', 
            nameEn: 'Archive Clerk',
            permissions: ['patients', 'basic_reports']
        }
    ],
    
    // أسباب الوفاة الشائعة
    commonDeathCauses: [
        'فشل في القلب',
        'فشل كلوي',
        'فشل تنفسي',
        'سكتة دماغية',
        'نوبة قلبية',
        'سرطان',
        'حادث مروري',
        'مضاعفات جراحية',
        'عدوى شديدة',
        'أسباب طبيعية'
    ],
    
    // الفئات العمرية
    ageGroups: [
        { id: '0-1', name: 'رضع (0-1 سنة)', min: 0, max: 1 },
        { id: '2-12', name: 'أطفال (2-12 سنة)', min: 2, max: 12 },
        { id: '13-17', name: 'مراهقون (13-17 سنة)', min: 13, max: 17 },
        { id: '18-35', name: 'شباب (18-35 سنة)', min: 18, max: 35 },
        { id: '36-50', name: 'متوسط العمر (36-50 سنة)', min: 36, max: 50 },
        { id: '51-65', name: 'كبار السن (51-65 سنة)', min: 51, max: 65 },
        { id: '65+', name: 'المسنون (65+ سنة)', min: 65, max: 150 }
    ]
};

// رسائل النظام
const SYSTEM_MESSAGES = {
    ar: {
        // رسائل النجاح
        success: {
            login: 'تم تسجيل الدخول بنجاح',
            logout: 'تم تسجيل الخروج بنجاح',
            patientAdded: 'تم إضافة المريض بنجاح',
            patientUpdated: 'تم تحديث بيانات المريض بنجاح',
            patientDeleted: 'تم حذف المريض بنجاح',
            admissionAdded: 'تم تسجيل دخول المريض بنجاح',
            dischargeAdded: 'تم تسجيل خروج المريض بنجاح',
            deathAdded: 'تم تسجيل حالة الوفاة',
            userAdded: 'تم إضافة المستخدم بنجاح',
            backupCreated: 'تم إنشاء النسخة الاحتياطية بنجاح',
            dataRestored: 'تم استعادة البيانات بنجاح',
            reportGenerated: 'تم إنشاء التقرير بنجاح'
        },
        
        // رسائل الخطأ
        error: {
            loginFailed: 'اسم المستخدم أو كلمة المرور غير صحيحة',
            patientNotFound: 'لم يتم العثور على المريض',
            patientExists: 'المريض موجود بالفعل',
            userExists: 'اسم المستخدم موجود بالفعل',
            invalidData: 'البيانات المدخلة غير صحيحة',
            networkError: 'خطأ في الاتصال',
            fileError: 'خطأ في قراءة الملف',
            permissionDenied: 'ليس لديك صلاحية للقيام بهذا الإجراء',
            sessionExpired: 'انتهت صلاحية الجلسة',
            systemError: 'حدث خطأ في النظام'
        },
        
        // رسائل التحذير
        warning: {
            unsavedChanges: 'لديك تغييرات غير محفوظة',
            deleteConfirm: 'هل أنت متأكد من الحذف؟',
            dataLoss: 'قد تفقد البيانات غير المحفوظة',
            longStay: 'مريض في المستشفى لفترة طويلة',
            duplicateEntry: 'قد يكون هناك تكرار في البيانات'
        },
        
        // رسائل المعلومات
        info: {
            noData: 'لا توجد بيانات للعرض',
            loading: 'جاري التحميل...',
            saving: 'جاري الحفظ...',
            searching: 'جاري البحث...',
            processing: 'جاري المعالجة...',
            backupRecommended: 'يُنصح بعمل نسخة احتياطية'
        }
    },
    
    en: {
        // Success messages
        success: {
            login: 'Login successful',
            logout: 'Logout successful',
            patientAdded: 'Patient added successfully',
            patientUpdated: 'Patient updated successfully',
            patientDeleted: 'Patient deleted successfully',
            admissionAdded: 'Patient admission recorded successfully',
            dischargeAdded: 'Patient discharge recorded successfully',
            deathAdded: 'Death case recorded',
            userAdded: 'User added successfully',
            backupCreated: 'Backup created successfully',
            dataRestored: 'Data restored successfully',
            reportGenerated: 'Report generated successfully'
        },
        
        // Error messages
        error: {
            loginFailed: 'Invalid username or password',
            patientNotFound: 'Patient not found',
            patientExists: 'Patient already exists',
            userExists: 'Username already exists',
            invalidData: 'Invalid data entered',
            networkError: 'Network error',
            fileError: 'File reading error',
            permissionDenied: 'Permission denied',
            sessionExpired: 'Session expired',
            systemError: 'System error occurred'
        },
        
        // Warning messages
        warning: {
            unsavedChanges: 'You have unsaved changes',
            deleteConfirm: 'Are you sure you want to delete?',
            dataLoss: 'You may lose unsaved data',
            longStay: 'Patient has been in hospital for a long time',
            duplicateEntry: 'There may be duplicate data'
        },
        
        // Info messages
        info: {
            noData: 'No data to display',
            loading: 'Loading...',
            saving: 'Saving...',
            searching: 'Searching...',
            processing: 'Processing...',
            backupRecommended: 'Backup recommended'
        }
    }
};

// قواعد التحقق من صحة البيانات
const VALIDATION_RULES = {
    patient: {
        name: {
            required: true,
            minLength: 2,
            maxLength: 100,
            pattern: /^[\u0600-\u06FFa-zA-Z\s]+$/
        },
        birthDate: {
            required: true,
            maxAge: 150,
            minAge: 0
        },
        phone: {
            required: false,
            pattern: /^[0-9+\-\s()]+$/,
            minLength: 10,
            maxLength: 15
        },
        email: {
            required: false,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        }
    },
    
    admission: {
        patientId: {
            required: true
        },
        admissionDate: {
            required: true,
            maxDate: 'today'
        },
        reason: {
            required: true,
            minLength: 5,
            maxLength: 500
        },
        department: {
            required: true
        },
        doctor: {
            required: true,
            minLength: 2,
            maxLength: 100
        }
    },
    
    death: {
        patientId: {
            required: true
        },
        deathDate: {
            required: true,
            maxDate: 'today'
        },
        cause: {
            required: true,
            minLength: 5,
            maxLength: 500
        },
        doctor: {
            required: true,
            minLength: 2,
            maxLength: 100
        }
    },
    
    user: {
        username: {
            required: true,
            minLength: 3,
            maxLength: 20,
            pattern: /^[a-zA-Z0-9_]+$/
        },
        password: {
            required: true,
            minLength: 8,
            maxLength: 50
        },
        fullName: {
            required: true,
            minLength: 2,
            maxLength: 100
        },
        role: {
            required: true
        }
    }
};

// تصدير التكوينات للاستخدام العام
window.SYSTEM_CONFIG = SYSTEM_CONFIG;
window.REFERENCE_DATA = REFERENCE_DATA;
window.SYSTEM_MESSAGES = SYSTEM_MESSAGES;
window.VALIDATION_RULES = VALIDATION_RULES;

// وظائف مساعدة للتكوين
window.ConfigHelper = {
    // الحصول على رسالة حسب اللغة الحالية
    getMessage: function(category, key) {
        const lang = currentLanguage || SYSTEM_CONFIG.system.defaultLanguage;
        return SYSTEM_MESSAGES[lang]?.[category]?.[key] || key;
    },
    
    // الحصول على قائمة الأقسام
    getDepartments: function() {
        return REFERENCE_DATA.departments;
    },
    
    // الحصول على قائمة فصائل الدم
    getBloodTypes: function() {
        return REFERENCE_DATA.bloodTypes;
    },
    
    // الحصول على قائمة الأدوار
    getUserRoles: function() {
        return REFERENCE_DATA.userRoles;
    },
    
    // التحقق من الصلاحيات
    hasPermission: function(userRole, permission) {
        const role = REFERENCE_DATA.userRoles.find(r => r.id === userRole);
        return role && (role.permissions.includes('all') || role.permissions.includes(permission));
    },
    
    // تطبيق قواعد التحقق
    validateField: function(fieldName, value, rules) {
        const errors = [];
        
        if (rules.required && (!value || value.toString().trim() === '')) {
            errors.push('هذا الحقل مطلوب');
        }
        
        if (value && rules.minLength && value.toString().length < rules.minLength) {
            errors.push(`الحد الأدنى ${rules.minLength} أحرف`);
        }
        
        if (value && rules.maxLength && value.toString().length > rules.maxLength) {
            errors.push(`الحد الأقصى ${rules.maxLength} حرف`);
        }
        
        if (value && rules.pattern && !rules.pattern.test(value.toString())) {
            errors.push('تنسيق غير صحيح');
        }
        
        return errors;
    },
    
    // تحديث الإعدادات
    updateSettings: function(newSettings) {
        Object.assign(SYSTEM_CONFIG, newSettings);
        localStorage.setItem(SYSTEM_CONFIG.storage.keys.settings, JSON.stringify(SYSTEM_CONFIG));
    },
    
    // تحميل الإعدادات المحفوظة
    loadSettings: function() {
        const savedSettings = localStorage.getItem(SYSTEM_CONFIG.storage.keys.settings);
        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings);
                Object.assign(SYSTEM_CONFIG, settings);
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        }
    }
};