import React from 'react';
import { Home, FileText, CalendarCheck, CheckSquare, Bell, LogOut, Camera } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', title: 'الرئيسية', icon: Home },
    { id: 'reports', title: 'التقارير الأسبوعية', icon: FileText },
    { id: 'activities', title: 'توثيق الأنشطة (بالصور)', icon: Camera },
    { id: 'attendance', title: 'الحضور والانصراف', icon: CalendarCheck },
    { id: 'tasks', title: 'الجدول والمهام', icon: CheckSquare },
    { id: 'notifications', title: 'الإشعارات', icon: Bell },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen p-4 fixed right-0 top-0 flex flex-col justify-between z-10">
      <div>
        {/* اللوجو والعنوان */}
        <div className="flex items-center gap-3 px-2 py-4 border-b border-slate-800 mb-6">
          <div className="bg-blue-600 text-white p-2.5 rounded-xl font-bold text-xl shadow-lg shadow-blue-500/20">
            ط
          </div>
          <div>
            <h1 className="font-bold text-white text-lg">بوابة الطالب</h1>
            <p className="text-xs text-slate-400">التدريب التعاوني</p>
          </div>
        </div>

        {/* عناصر القائمة */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon size={20} />
                <span>{item.title}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* تسجيل الخروج */}
      <button className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition text-sm font-medium w-full">
        <LogOut size={20} />
        <span>تسجيل الخروج</span>
      </button>
    </aside>
  );
}