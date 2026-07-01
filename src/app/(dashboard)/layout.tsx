import Sidebar from "@/src/components/style/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-80 bg-black">
        <Sidebar />
      </div>

      <main className="md:pl-64 h-full">
        <header className="h-16 border-b border-slate-200 bg-white flex items-center px-8">
             <span className="text-sm font-medium text-slate-500">Welcome back, Admin</span>
        </header>
        <div className="p-8 bg-slate-50 min-h-[calc(100vh-64px)]">
          {children}
        </div>
      </main>
    </div>
  );
}