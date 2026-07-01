interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description: string;
}

export function StatCard({ title, value, icon: Icon, description }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-amber-50 rounded-lg">
          <Icon className="h-6 w-6 text-amber-600" />
        </div>
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-black">{value}</h3>
        <p className="text-xs text-slate-400 mt-1">{description}</p>
      </div>
    </div>
  );
}