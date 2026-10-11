import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import { 
  Clock, CheckCircle2, FileText, Building2, Calendar, 
  AlertCircle, Upload, Image as ImageIcon, Plus, Trash2,
  LogIn, LogOut, CheckSquare, Send
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

  // معالجة اختيار صورة من جهاز الكمبيوتر
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  // حفظ النشاط بالصورة الحقيقية
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

  // --- 2. حالة سجل الحضور والانصراف ---
  const [attendanceLog, setAttendanceLog] = useState([
    { id: 1, date: '2026-10-08', checkIn: '08:00 ص', checkOut: '02:00 م', hours: '6 ساعات', status: 'حاضر' },
    { id: 2, date: '2026-10-07', checkIn: '08:05 ص', checkOut: '02:00 م', hours: '6 ساعات', status: 'حاضر' }
  ]);
  const [todayCheckedIn, setTodayCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);

  const handleCheckIn = () => {
    const now = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    setCheckInTime(now);
    setTodayCheckedIn(true);
  };

  const handleCheckOut = () => {
    if (!todayCheckedIn) return;
    const nowOut = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    const todayDate = new Date().toISOString().split('T')[0];
    const newRecord = {
      id: Date.now(),
      date: todayDate,
      checkIn: checkInTime,
      checkOut: nowOut,
      hours: '6 ساعات',
      status: 'حاضر'
    };
    setAttendanceLog([newRecord, ...attendanceLog]);
    setTodayCheckedIn(false);
    setCheckInTime(null);
  };

  // --- 3. حالة التقارير الأسبوعية ---
  const [reports, setReports] = useState([
    { id: 1, week: 'الأسبوع الأول', date: '2026-09-15', status: 'مقبول', notes: 'ممتاز، استمر بالالتزام.' },
    { id: 2, week: 'الأسبوع الثاني', date: '2026-09-22', status: 'مقبول', notes: 'تقرير مكتمل بشكل جيد.' }
  ]);
  const [repWeek, setRepWeek] = useState('');
  const [repContent, setRepContent] = useState('');

  const handleAddReport = (e) => {
    e.preventDefault();
    if (!repWeek || !repContent) return;
    const newRep = {
      id: Date.now(),
      week: repWeek,
      date: new Date().toISOString().split('T')[0],
      status: 'قيد المراجعة',
      notes: 'تم التسليم وفي انتظار مراجعة المشرف.'
    };
    setReports([newRep, ...reports]);
    setRepWeek('');
    setRepContent('');
  };

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
            <span>الفصل الدراسي الثاني - 2026</span>
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

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-500 text-sm font-medium">التقارير المرفوعة</span>
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><FileText size={22} /></div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-800">{reports.length}</span>
                  <span className="text-slate-400 text-sm">تقارير أسبوعية</span>
                </div>
                <p className="text-emerald-600 text-xs mt-4 flex items-center gap-1">
                  <CheckCircle2 size={14} /> محدثة باستمرار
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-500 text-sm font-medium">الأنشطة الموثقة بالصور</span>
                  <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl"><ImageIcon size={22} /></div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-800">{activities.length}</span>
                  <span className="text-slate-400 text-sm">إثباتات مصورة</span>
                </div>
                <p className="text-slate-400 text-xs mt-4">يمكن للمشرف الاطلاع عليها</p>
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

        {/* 2. توثيق الأنشطة (بالصور الفعلية) */}
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
                    <img src={act.imageUrl} alt={act.title} className="w-full h-48 object-cover" />
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
          </div>
        )}

        {/* 3. الحضور والانصراف */}
        {activeTab === 'attendance' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">تسجيل الحضور اليومي M-CheckIn</h2>
                <p className="text-xs text-slate-500 mt-1">سجل حضورك وانصرافك اليومي ليتم احتساب الساعات تلقائياً.</p>
              </div>

              <div className="flex items-center gap-3">
                {!todayCheckedIn ? (
                  <button 
                    onClick={handleCheckIn}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-xl text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                  >
                    <LogIn size={18} /> تسجيل حضور الآن
                  </button>
                ) : (
                  <button 
                    onClick={handleCheckOut}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-xl text-sm transition flex items-center gap-2 shadow-lg shadow-red-600/20"
                  >
                    <LogOut size={18} /> تسجيل انصراف (تم الدخول: {checkInTime})
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-base">سجل الحضور والانصراف الساسي</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-400 text-xs uppercase border-b border-slate-100">
                    <tr>
                      <th className="p-4">التاريخ</th>
                      <th className="p-4">وقت الحضور</th>
                      <th className="p-4">وقت الانصراف</th>
                      <th className="p-4">الساعات المنجزة</th>
                      <th className="p-4">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attendanceLog.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="p-4 font-semibold text-slate-800">{log.date}</td>
                        <td className="p-4 text-emerald-600">{log.checkIn}</td>
                        <td className="p-4 text-red-500">{log.checkOut}</td>
                        <td className="p-4">{log.hours}</td>
                        <td className="p-4">
                          <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-xs font-semibold">
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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
              <h3 className="font-bold text-slate-800 text-base mb-4">التقارير المرفوعة سابقاً</h3>
              <div className="space-y-3">
                {reports.map((r) => (
                  <div key={r.id} className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{r.week}</h4>
                      <p className="text-xs text-slate-400 mt-1">تاريخ التسليم: {r.date} — {r.notes}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${r.status === 'مقبول' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. الجدول والمهام */}
        {activeTab === 'tasks' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-800">قائمة المهام التدريبية الموكلة</h2>
                <p className="text-xs text-slate-500 mt-1">تابع مهامك اليومية والأسبوعية المسندة لك من المشرفين.</p>
              </div>
              <span className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-bold">
                إجمالي المهام المنجزة: 2 / 3
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg text-xs font-semibold">مكتملة ✅</span>
                    <span className="text-xs text-slate-400">2026-10-09</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm mb-2">مراجعة كود واجهات المستخدم RTL</h3>
                  <p className="text-slate-500 text-xs">التأكد من دعم اللغة العربية بالكامل والتجاوب مع جميع الشاشات.</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-50 text-xs text-slate-400">
                  المشرف: أ. أسامة القحطاني
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-amber-50 text-amber-600 px-2.5 py-1 rounded-lg text-xs font-semibold">قيد التنفيذ ⏳</span>
                    <span className="text-xs text-slate-400">2026-10-11</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm mb-2">اختبار ربط قاعدة البيانات وقواعد SQL</h3>
                  <p className="text-slate-500 text-xs">تنفيذ الاستعلامات وحساب المتوسطات والنسب للإحصائيات.</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-50 text-xs text-slate-400">
                  المشرف: أ. أسامة القحطاني
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg text-xs font-semibold">مكتملة ✅</span>
                    <span className="text-xs text-slate-400">2026-10-06</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm mb-2">إعداد العرض التقديمي للتقرير النهائي</h3>
                  <p className="text-slate-500 text-xs">تجهيز الشرائح وشرح المخرجات لعرضها على الدكتورة والمشرف.</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-50 text-xs text-slate-400">
                  المشرف: د. عبدالمجيد الغامدي
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. مركز الإشعارات */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 mb-2">مركز الإشعارات والتنبيهات</h2>
            
            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-3">
              <span className="text-blue-600 font-bold text-lg">📌</span>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">تمت الموافقة على التقرير الأسبوعي السادس</h4>
                <p className="text-xs text-slate-500 mt-1">اعتمد المشرف الأكاديمي د. عبدالمجيد الغامدي تقريرك الأسبوعي بنجاح.</p>
                <span className="text-[10px] text-slate-400 mt-2 block">منذ ساعتين</span>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-start gap-3">
              <span className="text-emerald-600 font-bold text-lg">🎯</span>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">إضافة مهمة جديدة لك</h4>
                <p className="text-xs text-slate-500 mt-1">قام المشرف الميداني بإضافة مهمة (اختبار ربط قاعدة البيانات).</p>
                <span className="text-[10px] text-slate-400 mt-2 block">منذ يوم واحد</span>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}