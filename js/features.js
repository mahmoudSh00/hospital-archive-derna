// ميزات إضافية لنظام مستشفى الوحدة العلاجي درنة
// تطوير: محمود شنب - 0920719250

// ميزة النسخ الاحتياطي والاستعادة
class BackupManager {
    static createBackup() {
        const backupData = {
            patients: patients,
            admissions: admissions,
            deaths: deaths,
            users: users.filter(u => u.username !== 'amod'), // استثناء المدير الرئيسي
            timestamp: new Date().toISOString(),
            version: '1.0'
        };
        
        const dataStr = JSON.stringify(backupData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `hospital_backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        showSuccessMessage('تم إنشاء النسخة الاحتياطية بنجاح');
    }
    
    static restoreBackup(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const backupData = JSON.parse(e.target.result);
                
                if (confirm('هل أنت متأكد من استعادة النسخة الاحتياطية؟ سيتم استبدال جميع البيانات الحالية.')) {
                    patients = backupData.patients || [];
                    admissions = backupData.admissions || [];
                    deaths = backupData.deaths || [];
                    
                    // دمج المستخدمين مع الحفاظ على المدير الرئيسي
                    const adminUser = users.find(u => u.username === 'amod');
                    users = backupData.users || [];
                    if (adminUser && !users.find(u => u.username === 'amod')) {
                        users.unshift(adminUser);
                    }
                    
                    saveDataToStorage();
                    loadAllData();
                    showSuccessMessage('تم استعادة النسخة الاحتياطية بنجاح');
                }
            } catch (error) {
                showErrorMessage('خطأ في قراءة ملف النسخة الاحتياطية');
            }
        };
        reader.readAsText(file);
    }
}

// ميزة الإحصائيات المتقدمة
class AdvancedStats {
    static getMonthlyStats() {
        const currentYear = new Date().getFullYear();
        const monthlyData = [];
        
        for (let month = 0; month < 12; month++) {
            const monthPatients = patients.filter(p => {
                const createdDate = new Date(p.createdDate);
                return createdDate.getFullYear() === currentYear && createdDate.getMonth() === month;
            }).length;
            
            const monthAdmissions = admissions.filter(a => {
                const admissionDate = new Date(a.admissionDate);
                return admissionDate.getFullYear() === currentYear && admissionDate.getMonth() === month;
            }).length;
            
            const monthDeaths = deaths.filter(d => {
                const deathDate = new Date(d.deathDate);
                return deathDate.getFullYear() === currentYear && deathDate.getMonth() === month;
            }).length;
            
            monthlyData.push({
                month: month + 1,
                patients: monthPatients,
                admissions: monthAdmissions,
                deaths: monthDeaths
            });
        }
        
        return monthlyData;
    }
    
    static getDepartmentStats() {
        const departmentStats = {};
        
        admissions.forEach(admission => {
            const dept = admission.department || 'غير محدد';
            if (!departmentStats[dept]) {
                departmentStats[dept] = {
                    total: 0,
                    active: 0,
                    discharged: 0
                };
            }
            
            departmentStats[dept].total++;
            if (admission.status === 'admitted') {
                departmentStats[dept].active++;
            } else if (admission.status === 'discharged') {
                departmentStats[dept].discharged++;
            }
        });
        
        return departmentStats;
    }
    
    static getAgeGroupStats() {
        const ageGroups = {
            '0-18': 0,
            '19-35': 0,
            '36-50': 0,
            '51-65': 0,
            '65+': 0
        };
        
        patients.forEach(patient => {
            const age = calculateAge(patient.birthDate);
            
            if (age <= 18) ageGroups['0-18']++;
            else if (age <= 35) ageGroups['19-35']++;
            else if (age <= 50) ageGroups['36-50']++;
            else if (age <= 65) ageGroups['51-65']++;
            else ageGroups['65+']++;
        });
        
        return ageGroups;
    }
}

// ميزة البحث المتقدم
class AdvancedSearch {
    static searchPatients(criteria) {
        return patients.filter(patient => {
            let matches = true;
            
            if (criteria.name && !patient.name.toLowerCase().includes(criteria.name.toLowerCase())) {
                matches = false;
            }
            
            if (criteria.id && !patient.id.toLowerCase().includes(criteria.id.toLowerCase())) {
                matches = false;
            }
            
            if (criteria.phone && !patient.phone.includes(criteria.phone)) {
                matches = false;
            }
            
            if (criteria.gender && patient.gender !== criteria.gender) {
                matches = false;
            }
            
            if (criteria.bloodType && patient.bloodType !== criteria.bloodType) {
                matches = false;
            }
            
            if (criteria.status && patient.status !== criteria.status) {
                matches = false;
            }
            
            if (criteria.ageFrom || criteria.ageTo) {
                const age = calculateAge(patient.birthDate);
                if (criteria.ageFrom && age < criteria.ageFrom) matches = false;
                if (criteria.ageTo && age > criteria.ageTo) matches = false;
            }
            
            if (criteria.dateFrom || criteria.dateTo) {
                const createdDate = new Date(patient.createdDate);
                if (criteria.dateFrom && createdDate < new Date(criteria.dateFrom)) matches = false;
                if (criteria.dateTo && createdDate > new Date(criteria.dateTo)) matches = false;
            }
            
            return matches;
        });
    }
    
    static searchAdmissions(criteria) {
        return admissions.filter(admission => {
            let matches = true;
            
            if (criteria.patientName && !admission.patientName.toLowerCase().includes(criteria.patientName.toLowerCase())) {
                matches = false;
            }
            
            if (criteria.department && admission.department !== criteria.department) {
                matches = false;
            }
            
            if (criteria.doctor && !admission.doctor.toLowerCase().includes(criteria.doctor.toLowerCase())) {
                matches = false;
            }
            
            if (criteria.status && admission.status !== criteria.status) {
                matches = false;
            }
            
            if (criteria.dateFrom || criteria.dateTo) {
                const admissionDate = new Date(admission.admissionDate);
                if (criteria.dateFrom && admissionDate < new Date(criteria.dateFrom)) matches = false;
                if (criteria.dateTo && admissionDate > new Date(criteria.dateTo)) matches = false;
            }
            
            return matches;
        });
    }
}

// ميزة التنبيهات الذكية
class SmartNotifications {
    static checkCriticalAlerts() {
        const alerts = [];
        
        // تنبيه المرضى الذين لم يخرجوا لفترة طويلة
        const longStayPatients = admissions.filter(a => {
            if (a.dischargeDate) return false;
            const admissionDate = new Date(a.admissionDate);
            const daysDiff = (new Date() - admissionDate) / (1000 * 60 * 60 * 24);
            return daysDiff > 30;
        });
        
        if (longStayPatients.length > 0) {
            alerts.push({
                type: 'warning',
                title: 'إقامة طويلة',
                message: `${longStayPatients.length} مريض في المستشفى لأكثر من 30 يوم`,
                priority: 'medium',
                patients: longStayPatients
            });
        }
        
        // تنبيه الوفيات الأخيرة
        const recentDeaths = deaths.filter(d => {
            const deathDate = new Date(d.deathDate);
            const daysDiff = (new Date() - deathDate) / (1000 * 60 * 60 * 24);
            return daysDiff <= 3;
        });
        
        if (recentDeaths.length > 0) {
            alerts.push({
                type: 'danger',
                title: 'وفيات حديثة',
                message: `${recentDeaths.length} حالة وفاة في آخر 3 أيام`,
                priority: 'high',
                deaths: recentDeaths
            });
        }
        
        // تنبيه الأقسام المزدحمة
        const departmentStats = AdvancedStats.getDepartmentStats();
        Object.keys(departmentStats).forEach(dept => {
            if (departmentStats[dept].active > 10) {
                alerts.push({
                    type: 'info',
                    title: 'قسم مزدحم',
                    message: `قسم ${dept} يحتوي على ${departmentStats[dept].active} مريض نشط`,
                    priority: 'low',
                    department: dept
                });
            }
        });
        
        return alerts;
    }
    
    static displayAlerts(alerts) {
        const alertsContainer = document.getElementById('notifications');
        
        if (alerts.length === 0) {
            alertsContainer.innerHTML = '<p class="text-muted">لا توجد تنبيهات</p>';
            return;
        }
        
        alertsContainer.innerHTML = alerts.map(alert => `
            <div class="alert alert-${alert.type} alert-dismissible fade show" role="alert">
                <strong>${alert.title}:</strong> ${alert.message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `).join('');
    }
}

// ميزة طباعة التقارير المتقدمة
class ReportGenerator {
    static generateDetailedPatientReport(patientId) {
        const patient = patients.find(p => p.id === patientId);
        if (!patient) return null;
        
        const patientAdmissions = admissions.filter(a => a.patientId === patientId);
        const patientDeath = deaths.find(d => d.patientId === patientId);
        
        const reportHTML = `
            <div class="report-container">
                <div class="report-header">
                    <h2>مستشفى الوحدة العلاجي درنة</h2>
                    <h3>تقرير مفصل عن المريض</h3>
                    <p>تاريخ التقرير: ${formatDateTime(new Date().toISOString())}</p>
                </div>
                
                <div class="patient-info">
                    <h4>بيانات المريض</h4>
                    <table class="table table-bordered">
                        <tr><td><strong>رقم الملف:</strong></td><td>${patient.id}</td></tr>
                        <tr><td><strong>الاسم:</strong></td><td>${patient.name}</td></tr>
                        <tr><td><strong>تاريخ الميلاد:</strong></td><td>${formatDate(patient.birthDate)}</td></tr>
                        <tr><td><strong>العمر:</strong></td><td>${calculateAge(patient.birthDate)} سنة</td></tr>
                        <tr><td><strong>الجنس:</strong></td><td>${patient.gender === 'male' ? 'ذكر' : 'أنثى'}</td></tr>
                        <tr><td><strong>فصيلة الدم:</strong></td><td>${patient.bloodType || '-'}</td></tr>
                        <tr><td><strong>الهاتف:</strong></td><td>${patient.phone || '-'}</td></tr>
                        <tr><td><strong>العنوان:</strong></td><td>${patient.address || '-'}</td></tr>
                    </table>
                </div>
                
                <div class="medical-history">
                    <h4>التاريخ المرضي</h4>
                    <p>${patient.medicalHistory || 'لا يوجد تاريخ مرضي مسجل'}</p>
                </div>
                
                <div class="admissions-history">
                    <h4>تاريخ الدخول والخروج</h4>
                    ${patientAdmissions.length > 0 ? `
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>تاريخ الدخول</th>
                                    <th>تاريخ الخروج</th>
                                    <th>السبب</th>
                                    <th>القسم</th>
                                    <th>الطبيب</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${patientAdmissions.map(admission => `
                                    <tr>
                                        <td>${formatDateTime(admission.admissionDate)}</td>
                                        <td>${admission.dischargeDate ? formatDateTime(admission.dischargeDate) : 'لم يخرج بعد'}</td>
                                        <td>${admission.reason}</td>
                                        <td>${admission.department}</td>
                                        <td>${admission.doctor}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : '<p>لا توجد سجلات دخول وخروج</p>'}
                </div>
                
                ${patientDeath ? `
                    <div class="death-info">
                        <h4>معلومات الوفاة</h4>
                        <table class="table table-bordered">
                            <tr><td><strong>تاريخ الوفاة:</strong></td><td>${formatDateTime(patientDeath.deathDate)}</td></tr>
                            <tr><td><strong>سبب الوفاة:</strong></td><td>${patientDeath.cause}</td></tr>
                            <tr><td><strong>الطبيب المسؤول:</strong></td><td>${patientDeath.doctor}</td></tr>
                            <tr><td><strong>ملاحظات:</strong></td><td>${patientDeath.notes || '-'}</td></tr>
                        </table>
                    </div>
                ` : ''}
                
                <div class="report-footer">
                    <p>تم إنشاء هذا التقرير بواسطة: ${currentUser.fullName}</p>
                    <p>نظام الأرشيف الطبي - مستشفى الوحدة العلاجي درنة</p>
                    <p>تطوير: محمود شنب - 0920719250</p>
                </div>
            </div>
        `;
        
        return reportHTML;
    }
    
    static printReport(reportHTML) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>تقرير طبي</title>
                    <style>
                        body { font-family: 'Cairo', Arial, sans-serif; direction: rtl; }
                        .report-container { max-width: 800px; margin: 0 auto; padding: 20px; }
                        .report-header { text-align: center; margin-bottom: 30px; }
                        .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                        .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: right; }
                        .table th { background-color: #f8f9fa; }
                        .report-footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
                        @media print { .no-print { display: none; } }
                    </style>
                </head>
                <body>
                    ${reportHTML}
                    <script>window.print();</script>
                </body>
            </html>
        `);
        printWindow.document.close();
    }
}

// ميزة التحقق من صحة البيانات
class DataValidator {
    static validatePatient(patientData) {
        const errors = [];
        
        if (!patientData.name || patientData.name.trim().length < 2) {
            errors.push('اسم المريض مطلوب ويجب أن يكون أكثر من حرفين');
        }
        
        if (!patientData.birthDate) {
            errors.push('تاريخ الميلاد مطلوب');
        } else {
            const birthDate = new Date(patientData.birthDate);
            const today = new Date();
            if (birthDate > today) {
                errors.push('تاريخ الميلاد لا يمكن أن يكون في المستقبل');
            }
            
            const age = calculateAge(patientData.birthDate);
            if (age > 150) {
                errors.push('العمر غير منطقي');
            }
        }
        
        if (!patientData.gender) {
            errors.push('الجنس مطلوب');
        }
        
        if (patientData.phone && !/^[0-9+\-\s()]+$/.test(patientData.phone)) {
            errors.push('رقم الهاتف غير صحيح');
        }
        
        return errors;
    }
    
    static validateAdmission(admissionData) {
        const errors = [];
        
        if (!admissionData.patientId) {
            errors.push('رقم ملف المريض مطلوب');
        }
        
        if (!admissionData.admissionDate) {
            errors.push('تاريخ الدخول مطلوب');
        } else {
            const admissionDate = new Date(admissionData.admissionDate);
            const today = new Date();
            if (admissionDate > today) {
                errors.push('تاريخ الدخول لا يمكن أن يكون في المستقبل');
            }
        }
        
        if (!admissionData.reason || admissionData.reason.trim().length < 5) {
            errors.push('سبب الدخول مطلوب ويجب أن يكون وصفياً');
        }
        
        if (!admissionData.department) {
            errors.push('القسم مطلوب');
        }
        
        if (!admissionData.doctor || admissionData.doctor.trim().length < 2) {
            errors.push('اسم الطبيب مطلوب');
        }
        
        return errors;
    }
    
    static validateDeath(deathData) {
        const errors = [];
        
        if (!deathData.patientId) {
            errors.push('رقم ملف المريض مطلوب');
        }
        
        if (!deathData.deathDate) {
            errors.push('تاريخ الوفاة مطلوب');
        } else {
            const deathDate = new Date(deathData.deathDate);
            const today = new Date();
            if (deathDate > today) {
                errors.push('تاريخ الوفاة لا يمكن أن يكون في المستقبل');
            }
        }
        
        if (!deathData.cause || deathData.cause.trim().length < 5) {
            errors.push('سبب الوفاة مطلوب ويجب أن يكون وصفياً');
        }
        
        if (!deathData.doctor || deathData.doctor.trim().length < 2) {
            errors.push('اسم الطبيب مطلوب');
        }
        
        return errors;
    }
}

// ميزة إدارة الجلسات
class SessionManager {
    static startSession() {
        const sessionData = {
            user: currentUser,
            loginTime: new Date().toISOString(),
            lastActivity: new Date().toISOString()
        };
        
        sessionStorage.setItem('hospital_session', JSON.stringify(sessionData));
        
        // تحديث آخر نشاط كل دقيقة
        setInterval(() => {
            this.updateLastActivity();
        }, 60000);
        
        // فحص انتهاء الجلسة كل 5 دقائق
        setInterval(() => {
            this.checkSessionExpiry();
        }, 300000);
    }
    
    static updateLastActivity() {
        const sessionData = JSON.parse(sessionStorage.getItem('hospital_session'));
        if (sessionData) {
            sessionData.lastActivity = new Date().toISOString();
            sessionStorage.setItem('hospital_session', JSON.stringify(sessionData));
        }
    }
    
    static checkSessionExpiry() {
        const sessionData = JSON.parse(sessionStorage.getItem('hospital_session'));
        if (sessionData) {
            const lastActivity = new Date(sessionData.lastActivity);
            const now = new Date();
            const timeDiff = (now - lastActivity) / (1000 * 60); // بالدقائق
            
            // انتهاء الجلسة بعد 30 دقيقة من عدم النشاط
            if (timeDiff > 30) {
                this.expireSession();
            }
        }
    }
    
    static expireSession() {
        sessionStorage.removeItem('hospital_session');
        showErrorMessage('انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.');
        setTimeout(() => {
            logout();
        }, 2000);
    }
}

// تصدير الوظائف للاستخدام العام
window.BackupManager = BackupManager;
window.AdvancedStats = AdvancedStats;
window.AdvancedSearch = AdvancedSearch;
window.SmartNotifications = SmartNotifications;
window.ReportGenerator = ReportGenerator;
window.DataValidator = DataValidator;
window.SessionManager = SessionManager;