import { Badge } from "@/src/components/ui/badge";

type RecentOrder = {
  id: string;
  title?: string;
  description?: string;
  priority?: string;
};

export function RecentActivity({ orders }: { orders?: RecentOrder[] }) {
  const recentOrders = orders?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      {recentOrders.length === 0 ? (
        <p className="text-sm text-slate-500 italic text-center py-10">No recent activity found.</p>
      ) : (
        recentOrders.map((order) => (
          <div key={order.id} className="flex items-center justify-between border-b border-slate-50 pb-4 last:border-0 last:pb-0">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-black">{order.title || "Untitled Request"}</p>
              <p className="text-xs text-slate-500">{order.description || "No description"}</p>
            </div>
            <Badge className="text-[10px] uppercase">
              {order.priority || "Normal"}
            </Badge>
          </div>
        ))
      )}
    </div>
  );
}