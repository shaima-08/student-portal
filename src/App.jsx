import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import { 
  Clock, CheckCircle2, FileText, Building2, Calendar, 
  AlertCircle, Upload, Image as ImageIcon, Plus, Trash2,
  LogIn, LogOut, CheckSquare, Send, X, MapPin, AlertTriangle, FileCheck, Eye
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // --- 1. حالة توثيق الأنشطة والصور الفعلية ---
  const [activities, setActivities] = useState([
    {
      id: 1,
      title: 'إعداد وتجهيز الخوادم ورَبْط الشبكة الداخلية',
      date: '2026-10-08',
      category: 'شبكات وبنية تحتية',
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=60',
      description: 'تم ربط السيرفرات وإعداد العناوين وتجربة الاتصال بنجاح مع الفريق.'
    }
  ]);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleAddActivity = (e) => {
    e.preventDefault();
    if (!newTitle) return;
    const newAct = {
      id: Date.now(),
      title: newTitle,
      date: new Date().toISOString().split('T')[0],
      category: 'توثيق ميداني',
      imageUrl: selectedImage || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=60',
      description: newDesc || 'تم إنجاز هذا النشاط وتوثيقه بنجاح.'
    };
    setActivities([newAct, ...activities]);
    setNewTitle('');
    setNewDesc('');
    setSelectedImage(null);
  };

  // --- 2. حالة سجل الحضور والغياب والانصراف المطور ---
  const [attendanceLog, setAttendanceLog] = useState([
    { id: 1, day: 'الأحد', date: '2026-10-18', checkIn: '08:00 ص', checkOut: 'غير مسجل ⚠️', hours: 'معلق', status: 'نسيان انصراف', note: 'يتطلب تقديم طلب تصحيح للمشرف' },
    { id: 2, day: 'الثلاثاء', date: '2026-10-13', checkIn: '-', checkOut: '-', hours: '0 ساعات', status: 'غائب', note: 'لم يتم تسجيل حضور - متاح تقديم عذر' },
    { id: 3, day: 'الخميس', date: '2026-10-15', checkIn: '08:00 ص', checkOut: '02:00 م', hours: '6 ساعات', status: 'حاضر', note: 'مكتمل - نطاق الجامعة' },
    { id: 4, day: 'الاربعاء', date: '2026-10-14', checkIn: '08:05 ص', checkOut: '02:00 م', hours: '6 ساعات', status: 'حاضر', note: 'مكتمل - نطاق الجامعة' }
  ]);

  const [todayCheckedIn, setTodayCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkInTimestamp, setCheckInTimestamp] = useState(null);
  const [isWithinCampus, setIsWithinCampus] = useState(true);
  
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionReason, setPermissionReason] = useState('');
  
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotOutTime, setForgotOutTime] = useState('02:00 م');
  const [forgotReason, setForgotReason] = useState('');
  const [forgotProof, setForgotProof] = useState(null);

  const daysArabic = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const hasPendingForgotCheckout = attendanceLog.some(item => item.status === 'نسيان انصراف');

  const handleCheckIn = () => {
    if (hasPendingForgotCheckout) {
      alert('⚠️ لديك يوم سابق غير مغلق بالانصراف! يرجى تقديم طلب تصحيح انصراف أولاً.');
      return;
    }
    if (!isWithinCampus) {
      alert('⚠️ يرجى التواجد داخل نطاق الجامعة / مقر التدريب لتسجيل الحضور.');
      return;
    }
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    setCheckInTime(timeStr);
    setCheckInTimestamp(now.getTime());
    setTodayCheckedIn(true);
  };

  const handleCheckOut = () => {
    if (!todayCheckedIn) return;
    const now = new Date();
    const hoursPassed = (now.getTime() - checkInTimestamp) / (1000 * 60 * 60);

    if (hoursPassed < 6) {
      setShowPermissionModal(true);
      return;
    }

    completeCheckOut('02:00 م', '6 ساعات', 'حاضر', 'مكتمل - نطاق الجامعة');
  };

  const completeCheckOut = (outTimeStr, workedHours, statusText, noteText) => {
    const today = new Date();
    const dayName = daysArabic[today.getDay()];
    const dateStr = today.toISOString().split('T')[0];

    const newRecord = {
      id: Date.now(),
      day: dayName,
      date: dateStr,
      checkIn: checkInTime,
      checkOut: outTimeStr,
      hours: workedHours,
      status: statusText,
      note: noteText
    };

    setAttendanceLog([newRecord, ...attendanceLog]);
    setTodayCheckedIn(false);
    setCheckInTime(null);
    setCheckInTimestamp(null);
  };

  const handleSendPermission = (e) => {
    e.preventDefault();
    if (!permissionReason) return;
    setShowPermissionModal(false);
    completeCheckOut('انصراف مبكر', 'أقل من 6 ساعات', 'في انتظار موافقة المشرف', `طلب استئذان: ${permissionReason}`);
    setPermissionReason('');
  };

  const handleSendForgotCorrection = (e) => {
    e.preventDefault();
    if (!forgotReason) return;

    const updatedLog = attendanceLog.map(item => {
      if (item.status === 'نسيان انصراف') {
        return {
          ...item,
          checkOut: forgotOutTime,
          hours: '6 ساعات (مقدرة)',
          status: 'قيد مراجعة المشرف',
          note: `تبرير النسيان: ${forgotReason} (تم إرفاق الإثبات 📄)`
        };
      }
      return item;
    });

    setAttendanceLog(updatedLog);
    setShowForgotModal(false);
    setForgotReason('');
    setForgotProof(null);
    alert('✅ تم إرسال طلب اعتماد الانصراف وإثبات الحضور للمشرف بنجاح!');
  };

  // --- 3. حالة التقارير الأسبوعية ومعاينتها ---
  const [reports, setReports] = useState([
    { 
      id: 1, 
      week: 'الأسبوع الأول', 
      date: '2026-09-15', 
      status: 'مقبول', 
      notes: 'ممتاز، استمر بالالتزام.',
      content: 'خلال هذا الأسبوع تم التعرف على بيئة العمل والبدء في إعداد وإلتقاط المتطلبات الخاصة بنظام التدريب التعاوني وتحديد الهيكلية للواجهات.'
    },
    { 
      id: 2, 
      week: 'الأسبوع الثاني', 
      date: '2026-09-22', 
      status: 'مقبول', 
      notes: 'تقرير مكتمل بشكل جيد.',
      content: 'تم البدء في بناء مكونات React الأساسية وتفعيل الشاشات الرئيسية والقائمة الجانبية وتنسيق الجداول للتقارير والحضور.'
    }
  ]);
  const [repWeek, setRepWeek] = useState('');
  const [repContent, setRepContent] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);

  const handleAddReport = (e) => {
    e.preventDefault();
    if (!repWeek || !repContent) return;
    const newRep = {
      id: Date.now(),
      week: repWeek,
      date: new Date().toISOString().split('T')[0],
      status: 'قيد المراجعة',
      notes: 'تم التسليم وفي انتظار مراجعة المشرف.',
      content: repContent
    };
    setReports([newRep, ...reports]);
    setRepWeek('');
    setRepContent('');
  };

  // --- 4. حالة المهام ومعاينتها ---
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'مراجعة كود واجهات المستخدم RTL',
      date: '2026-10-09',
      status: 'مكتملة ✅',
      supervisor: 'أ. أسامة القحطاني',
      description: 'التأكد من دعم اللغة العربية بالكامل والتجاوب مع جميع الشاشات والهواتف الذكية وتعديل تنسيقات CSS.'
    },
    {
      id: 2,
      title: 'اختبار ربط قاعدة البيانات وقواعد SQL',
      date: '2026-10-11',
      status: 'قيد التنفيذ ⏳',
      supervisor: 'أ. أسامة القحطاني',
      description: 'تنفيذ الاستعلامات وحساب المتوسطات والنسب للإحصائيات والتأكد من سرعة استجابة قاعدة البيانات.'
    },
    {
      id: 3,
      title: 'إعداد العرض التقديمي للتقرير النهائي',
      date: '2026-10-06',
      status: 'مكتملة ✅',
      supervisor: 'د. عبدالمجيد الغامدي',
      description: 'تجهيز الشرائح وشرح المخرجات والنتائج الإحصائية لعرضها في المناقشة الميدانية والأكاديمية.'
    }
  ]);
  const [selectedTask, setSelectedTask] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* القائمة الجانبية */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* المحتوى الرئيسي */}
      <main className="flex-1 mr-64 p-8">
        
        {/* الترويسة */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">مرحباً بك، محمد 👋</h1>
            <p className="text-slate-500 text-sm mt-1">نظام بوابة التدريب التعاوني الميداني التفاعلي.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 text-slate-600 text-sm">
            <Calendar size={18} className="text-blue-600" />
            <span>الفصل الدراسي الأول - 2026</span>
          </div>
        </header>

        {/* 1. الرئيسية (Dashboard) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-500 text-sm font-medium">ساعات التدريب</span>
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Clock size={22} /></div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-800">180</span>
                  <span className="text-slate-400 text-sm">/ 280 ساعة</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '64%' }}></div>
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('reports')} 
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:border-emerald-300 hover:shadow-md transition duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-500 text-sm font-medium">التقارير المرفوعة</span>
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><FileText size={22} /></div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-800">{reports.length}</span>
                  <span className="text-slate-400 text-sm">تقارير أسبوعية</span>
                </div>
                <p className="text-emerald-600 text-xs mt-4 flex items-center gap-1">
                  <CheckCircle2 size={14} /> اضغطي للانتقال للتقارير ←
                </p>
              </div>

              <div 
                onClick={() => setActiveTab('activities')} 
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:border-purple-300 hover:shadow-md transition duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-500 text-sm font-medium">الأنشطة الموثقة بالصور</span>
                  <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl"><ImageIcon size={22} /></div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-800">{activities.length}</span>
                  <span className="text-slate-400 text-sm">إثباتات مصورة</span>
                </div>
                <p className="text-purple-600 text-xs mt-4 flex items-center gap-1">
                  اضغطي للانتقال لصفحة الأنشطة ←
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Building2 className="text-blue-600" size={20} />
                  معلومات جهة التدريب
                </h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-4 bg-slate-50 rounded-xl"><span className="text-slate-400 block text-xs mb-1">الجهة</span><span className="font-semibold text-slate-700">شركة تقنية المعلومات والحلول الرقمية</span></div>
                  <div className="p-4 bg-slate-50 rounded-xl"><span className="text-slate-400 block text-xs mb-1">القسم / الإدارة</span><span className="font-semibold text-slate-700">تطوير البرمجيات والأنظمة</span></div>
                  <div className="p-4 bg-slate-50 rounded-xl"><span className="text-slate-400 block text-xs mb-1">المشرف الميداني</span><span className="font-semibold text-slate-700">أ. أسامة القحطاني</span></div>
                  <div className="p-4 bg-slate-50 rounded-xl"><span className="text-slate-400 block text-xs mb-1">المشرف الأكاديمي</span><span className="font-semibold text-slate-700">د. عبدالمجيد الغامدي</span></div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <AlertCircle className="text-amber-500" size={20} />
                  تنبيهات مهمة
                </h2>
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                    <p className="text-xs font-semibold text-amber-800">تذكير تسليم التقرير</p>
                    <p className="text-xs text-amber-600 mt-1">يرجى رفع تقرير الأسبوع الحالي قبل يوم الخميس.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. توثيق الأنشطة */}
        {activeTab === 'activities' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Plus size={20} className="text-blue-600" />
                إضافة نشاط / مهمة موثقة بصلب العمل
              </h2>
              <form onSubmit={handleAddActivity} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">عنوان النشاط / المهمة</label>
                    <input 
                      type="text" 
                      placeholder="مثال: إعداد السيرفر أو برمجة واجهة"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">إرفاق صورة إثبات النشاط من جهازك</label>
                    <label className="flex items-center justify-between px-4 py-2.5 border border-dashed border-slate-300 rounded-xl bg-slate-50 cursor-pointer hover:bg-slate-100 transition">
                      <div className="flex items-center gap-2 text-slate-600 text-xs">
                        <Upload size={18} className="text-blue-600" />
                        <span>{selectedImage ? 'تم اختيار الصورة ✅' : 'اضغط لاختيار صورة من جهازك'}</span>
                      </div>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                </div>

                {selectedImage && (
                  <div className="mt-2">
                    <p className="text-xs text-slate-500 mb-1">معاينة الصورة المرفقة:</p>
                    <img src={selectedImage} alt="Preview" className="h-32 rounded-xl object-cover border border-slate-200" />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">شرح مختصر للنشاط</label>
                  <textarea 
                    rows="2"
                    placeholder="اكتب توضيحاً سريعاً عما قمت به..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition shadow-lg shadow-blue-500/20"
                >
                  حفظ وتوثيق النشاط
                </button>
              </form>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <ImageIcon size={20} className="text-blue-600" />
                معرض الأنشطة والإثباتات المصورة ({activities.length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activities.map((act) => (
                  <div key={act.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition">
                    <div className="cursor-pointer overflow-hidden relative group" onClick={() => setZoomedImage(act.imageUrl)}>
                      <img src={act.imageUrl} alt={act.title} className="w-full h-48 object-cover group-hover:scale-105 transition duration-300" />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-semibold gap-1">
                        <ImageIcon size={16} /> تكبير المعاينة
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">{act.category}</span>
                        <span className="text-xs text-slate-400">{act.date}</span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-base mb-2">{act.title}</h3>
                      <p className="text-slate-500 text-xs leading-relaxed">{act.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {zoomedImage && (
              <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setZoomedImage(null)}>
                <div className="relative max-w-4xl max-h-[90vh] bg-white p-3 rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                  <img src={zoomedImage} alt="Zoomed" className="max-w-full max-h-[80vh] rounded-xl object-contain mx-auto" />
                  <div className="flex justify-between items-center mt-3 px-2">
                    <span className="text-xs text-slate-500">معاينة الإثبات الميداني</span>
                    <button 
                      className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1"
                      onClick={() => setZoomedImage(null)}
                    >
                      <X size={16} /> إغلاق
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. الحضور والانصراف المطور مع حالة الغياب */}
        {activeTab === 'attendance' && (
          <div className="space-y-8">
            {hasPendingForgotCheckout && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-3">
                <div className="flex items-center gap-3 text-amber-800 text-xs">
                  <AlertTriangle size={22} className="text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold block text-sm">تنبيه: لديك تسجيل حضور يوم سابق لم يتم إغلاقه بالانصراف!</span>
                    <span>يرجى تقديم طلب اعتماد انصراف وإرفاق الإثبات للمشرف لتكملة الساعات وينفك تجميد تسجيل اليوم.</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowForgotModal(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-4 py-2 rounded-xl text-xs transition shadow-md shrink-0 flex items-center gap-1"
                >
                  <FileCheck size={16} /> تقديم طلب اعتماد انصراف
                </button>
              </div>
            )}

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <MapPin size={18} className={isWithinCampus ? "text-emerald-600" : "text-rose-500"} />
                <span className="font-semibold text-slate-700">الموقع الجغرافي التلقائي:</span>
                <span className={isWithinCampus ? "text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-lg" : "text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded-lg"}>
                  {isWithinCampus ? "داخل حرم الجامعة / مقر التدريب ✅" : "خارج نطاق الجامعة ❌"}
                </span>
              </div>
              <button 
                onClick={() => setIsWithinCampus(!isWithinCampus)}
                className="text-slate-400 hover:text-slate-600 text-[11px] underline"
              >
                (تجربة الموقع: {isWithinCampus ? "تبديل إلى خارج الجامعة" : "تبديل إلى داخل الجامعة"})
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">تسجيل الحضور والانصراف (M-CheckIn)</h2>
                <p className="text-xs text-slate-500 mt-1">يلزم التواجد داخل نطاق الجامعة وإكمال 6 ساعات عمل يومية.</p>
              </div>

              <div className="flex items-center gap-3">
                {!todayCheckedIn ? (
                  <button 
                    onClick={handleCheckIn}
                    disabled={hasPendingForgotCheckout}
                    className={`font-medium px-6 py-3 rounded-xl text-sm transition flex items-center gap-2 shadow-lg ${
                      hasPendingForgotCheckout 
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' 
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                    }`}
                  >
                    <LogIn size={18} /> {hasPendingForgotCheckout ? "مغلق (عالج النسيان أولاً)" : "تسجيل حضور اليوم"}
                  </button>
                ) : (
                  <button 
                    onClick={handleCheckOut}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-xl text-sm transition flex items-center gap-2 shadow-lg shadow-red-600/20"
                  >
                    <LogOut size={18} /> تسجيل انصراف (تم الحضور: {checkInTime})
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-base">سجل الحضور والغياب والانصراف المعتمد</h3>
                <span className="text-xs text-slate-400">الحد الأدنى المطلوب: 6 ساعات / يوم</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-400 text-xs uppercase border-b border-slate-100">
                    <tr>
                      <th className="p-4">اليوم والتاريخ</th>
                      <th className="p-4">وقت الحضور</th>
                      <th className="p-4">وقت الانصراف</th>
                      <th className="p-4">الساعات المنجزة</th>
                      <th className="p-4">الحالة والتفاصيل</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attendanceLog.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="p-4 font-semibold text-slate-800">{log.day} - {log.date}</td>
                        <td className="p-4 text-emerald-600 font-medium">{log.checkIn}</td>
                        <td className={`p-4 font-medium ${log.checkOut.includes('غير') ? 'text-amber-600' : 'text-red-500'}`}>
                          {log.checkOut}
                        </td>
                        <td className="p-4">{log.hours}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                            log.status === 'حاضر' ? 'bg-emerald-50 text-emerald-600' : 
                            log.status === 'غائب' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                            log.status.includes('عذر') ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                            log.status === 'نسيان انصراف' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-blue-50 text-blue-600'
                          }`}>
                            {log.status}
                          </span>

                          {/* زر تقديم عذر غياب لو الحالة غائب */}
                          {log.status === 'غائب' && (
                            <button 
                              onClick={() => {
                                const reason = prompt('يرجى كتابة سبب/عذر الغياب للمشرف:');
                                if (reason) {
                                  const updated = attendanceLog.map(item => 
                                    item.id === log.id ? {...item, status: 'غائب بعذر (قيد المراجعة)', note: `العذر المرفق: ${reason}`} : item
                                  );
                                  setAttendanceLog(updated);
                                  alert('✅ تم إرسال عذر الغياب للمشرف بنجاح!');
                                }
                              }}
                              className="block text-[11px] text-blue-600 font-bold underline mt-1 hover:text-blue-800"
                            >
                              + تقديم عذر غياب
                            </button>
                          )}

                          <span className="block text-[11px] text-slate-400 mt-1">{log.note}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {showForgotModal && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
                  <div className="flex items-center gap-3 text-amber-600 mb-4">
                    <FileCheck size={24} />
                    <h3 className="font-bold text-slate-800 text-base">تقديم طلب اعتماد انصراف نسياني</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    يرجى تحديد وقت الخروج التقديري وإرفاق سبب عدم التسجيل لرفعه للمشرف للاعتماد.
                  </p>
                  <form onSubmit={handleSendForgotCorrection} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">وقت الانصراف الفعلي/التقديري</label>
                      <input 
                        type="text" 
                        value={forgotOutTime}
                        onChange={(e) => setForgotOutTime(e.target.value)}
                        placeholder="مثال: 02:00 م"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">سبب نسيان الانصراف</label>
                      <textarea 
                        rows="2"
                        required
                        placeholder="اكتب التبرير للمشرف..."
                        value={forgotReason}
                        onChange={(e) => setForgotReason(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">إرفاق إثبات (سجل موقع GPS / صورة مهمة)</label>
                      <input 
                        type="file" 
                        accept="image/*,.pdf"
                        onChange={(e) => setForgotProof(e.target.files[0])}
                        className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setShowForgotModal(false)}
                        className="px-4 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded-xl"
                      >
                        إلغاء
                      </button>
                      <button 
                        type="submit" 
                        className="px-4 py-2 text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md"
                      >
                        إرسال للمشرف للاعتماد
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {showPermissionModal && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
                  <div className="flex items-center gap-3 text-amber-600 mb-4">
                    <AlertTriangle size={24} />
                    <h3 className="font-bold text-slate-800 text-base">استئذان / انصراف مبكر</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    لم تكتمل الـ 6 ساعات المحددة لهذا اليوم. إذا أردت الخروج الآن، يرجى تقديم طلب استئذان يرسل للمشرف للاعتماد.
                  </p>
                  <form onSubmit={handleSendPermission} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">سبب الخروج المبكر / الاستئذان</label>
                      <textarea 
                        rows="3"
                        required
                        placeholder="اكتب سبب الاستئذان..."
                        value={permissionReason}
                        onChange={(e) => setPermissionReason(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                      ></textarea>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setShowPermissionModal(false)}
                        className="px-4 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded-xl"
                      >
                        إلغاء
                      </button>
                      <button 
                        type="submit" 
                        className="px-4 py-2 text-xs font-medium bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-md"
                      >
                        إرسال الاستئذان للمشرف
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 4. التقارير الأسبوعية */}
        {activeTab === 'reports' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Send size={20} className="text-blue-600" />
                تقديم التقرير الأسبوعي
              </h2>
              <form onSubmit={handleAddReport} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">حدد الأسبوع</label>
                  <input 
                    type="text" 
                    placeholder="مثال: الأسبوع السابع"
                    value={repWeek}
                    onChange={(e) => setRepWeek(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">تفاصيل المهام والإنجازات الأسبوعية</label>
                  <textarea 
                    rows="3"
                    placeholder="اكتب بالتفصيل أهم المهام التي قمت بها خلال هذا الأسبوع..."
                    value={repContent}
                    onChange={(e) => setRepContent(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                  ></textarea>
                </div>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition shadow-lg shadow-blue-500/20">
                  إرسال التقرير للمشرف
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-bold text-slate-800 text-base mb-4">التقارير المرفوعة سابقاً (اضغطي لقراءة التفاصيل)</h3>
              <div className="space-y-3">
                {reports.map((r) => (
                  <div 
                    key={r.id} 
                    onClick={() => setSelectedReport(r)}
                    className="p-4 bg-slate-50 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 rounded-xl flex justify-between items-center cursor-pointer transition group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition">{r.week}</h4>
                        <span className="text-[10px] bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Eye size={12} /> معاينة التقرير
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">تاريخ التسليم: {r.date} — {r.notes}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${r.status === 'مقبول' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {selectedReport && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedReport(null)}>
                <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                      <FileText className="text-blue-600" size={20} />
                      تفاصيل {selectedReport.week}
                    </h3>
                    <button onClick={() => setSelectedReport(null)} className="text-slate-400 hover:text-slate-600 p-1">
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="space-y-3 text-xs text-slate-600">
                    <div className="flex justify-between bg-slate-50 p-3 rounded-xl">
                      <span>تاريخ التسليم: <strong className="text-slate-800">{selectedReport.date}</strong></span>
                      <span>حالة التقرير: <strong className="text-emerald-600">{selectedReport.status}</strong></span>
                    </div>

                    <div>
                      <span className="font-bold text-slate-700 block mb-1">تفاصيل ومحتوى التقرير الأسبوعي:</span>
                      <p className="bg-slate-50 p-4 rounded-xl leading-relaxed text-slate-700 font-normal">
                        {selectedReport.content || 'تم رفع إنجازات وتفاصيل هذا الأسبوع بصلب العمل والمهمات الموكلة وفق الخطة التدريبية.'}
                      </p>
                    </div>

                    <div className="border-t border-slate-100 pt-3">
                      <span className="font-bold text-slate-700 block mb-1">ملاحظات واعتماد المشرف:</span>
                      <p className="text-emerald-700 font-medium bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                        {selectedReport.notes}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button 
                      onClick={() => setSelectedReport(null)}
                      className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium px-5 py-2 rounded-xl transition"
                    >
                      إغلاق المعاينة
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 5. الجدول والمهام */}
        {activeTab === 'tasks' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-800">قائمة المهام التدريبية الموكلة</h2>
                <p className="text-xs text-slate-500 mt-1">اضغطي على أي بطاقة لعرض كامل تفاصيل المهمة الموكلة.</p>
              </div>
              <span className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-bold">
                إجمالي المهام: {tasks.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  onClick={() => setSelectedTask(task)}
                  className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-blue-300 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        task.status.includes('مكتملة') ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {task.status}
                      </span>
                      <span className="text-xs text-slate-400">{task.date}</span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm mb-2 group-hover:text-blue-600 transition">{task.title}</h3>
                    <p className="text-slate-500 text-xs line-clamp-2">{task.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-50 text-xs text-slate-400 flex justify-between items-center">
                    <span>المشرف: {task.supervisor}</span>
                    <span className="text-blue-600 text-[11px] font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <Eye size={12} /> فتح التفاصيل
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {selectedTask && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedTask(null)}>
                <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                      <CheckSquare className="text-blue-600" size={20} />
                      تفاصيل المهمة الموكلة
                    </h3>
                    <button onClick={() => setSelectedTask(null)} className="text-slate-400 hover:text-slate-600 p-1">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs text-slate-600">
                    <h4 className="text-sm font-bold text-slate-800">{selectedTask.title}</h4>
                    
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl">
                      <div><span className="text-slate-400 block mb-0.5">تاريخ التسليم:</span><strong>{selectedTask.date}</strong></div>
                      <div><span className="text-slate-400 block mb-0.5">الحالة:</span><strong className="text-blue-600">{selectedTask.status}</strong></div>
                    </div>

                    <div>
                      <span className="font-bold text-slate-700 block mb-1">وصف المهمة والمتطلبات:</span>
                      <p className="bg-slate-50 p-3.5 rounded-xl leading-relaxed text-slate-700">
                        {selectedTask.description}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-0.5">المشرف المسؤول:</span>
                      <span className="font-semibold text-slate-800">{selectedTask.supervisor}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button 
                      onClick={() => setSelectedTask(null)}
                      className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium px-5 py-2 rounded-xl transition"
                    >
                      إغلاق
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 6. مركز الإشعارات المتفاعل */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold text-slate-800">مركز الإشعارات والتنبيهات الواردة</h2>
              <span className="text-xs text-slate-400">تحديث فوري من المشرفين</span>
            </div>
            
            <div 
              onClick={() => setActiveTab('reports')}
              className="p-4 bg-blue-50/50 hover:bg-blue-100/60 border border-blue-100 rounded-xl flex items-start gap-3 cursor-pointer transition group"
            >
              <span className="text-blue-600 font-bold text-lg mt-0.5">📌</span>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition">تمت الموافقة على التقرير الأسبوعي السادس</h4>
                  <span className="text-[11px] text-blue-600 font-semibold underline">عرض التقرير ←</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">اعتمد المشرف الأكاديمي د. عبدالمجيد الغامدي تقريرك الأسبوعي بنجاح.</p>
                <span className="text-[10px] text-slate-400 mt-2 block">منذ ساعتين</span>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('tasks')}
              className="p-4 bg-emerald-50/50 hover:bg-emerald-100/60 border border-emerald-100 rounded-xl flex items-start gap-3 cursor-pointer transition group"
            >
              <span className="text-emerald-600 font-bold text-lg mt-0.5">🎯</span>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800 text-sm group-hover:text-emerald-700 transition">إضافة مهمة جديدة لك من المشرف الميداني</h4>
                  <span className="text-[11px] text-emerald-600 font-semibold underline">فتح المهام لمعاينتها ←</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">قام المشرف الميداني بإضافة مهمة جديدة (اختبار ربط قاعدة البيانات).</p>
                <span className="text-[10px] text-slate-400 mt-2 block">منذ يوم واحد</span>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}