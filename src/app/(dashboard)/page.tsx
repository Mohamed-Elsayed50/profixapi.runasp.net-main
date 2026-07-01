"use client";

import { useCustomers } from "@/src/hooks/use-customers";
import { useTechnicians } from "@/src/hooks/use-technicians";
import { useOrders } from "@/src/hooks/use-orders";
import { useComplaints } from "@/src/hooks/use-complaints";
import { Users, Wrench, ClipboardList, AlertCircle, Loader2 } from "lucide-react";
import { StatCard } from "./stat-card";
import { RecentActivity } from "./recent-activity";
import { AnalyticsChart } from "./analytics-chart";


export default function DashboardPage() {
  // Fetching real-time data from hooks
  const { data: customers, isLoading: loadCust } = useCustomers();
  const { data: technicians, isLoading: loadTech } = useTechnicians();
  const { data: orders, isLoading: loadOrders } = useOrders();
  const { data: complaints, isLoading: loadComp } = useComplaints();

  // Unified loading state
  const isLoading = loadCust || loadTech || loadOrders || loadComp;

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-2">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-black">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back! Here is a real-time summary of your system.</p>
      </div>

      {/* Statistics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Customers"
          value={customers?.length || 0}
          icon={Users}
          description="Registered clients in database"
        />
        <StatCard
          title="Active Technicians"
          value={technicians?.length || 0}
          icon={Wrench}
          description="Total technical staff members"
        />
        <StatCard
          title="Service Requests"
          value={orders?.length || 0}
          icon={ClipboardList}
          description="Total orders placed by users"
        />
        <StatCard
          title="Pending Complaints"
          value={
            complaints?.filter((c: { status?: string }) => c.status === "pending").length || 0
          }
          icon={AlertCircle}
          description="Issues requiring your attention"
        />
      </div>

      {/* Analytics and Activity Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">

        {/* System Analytics Chart - Takes 4 columns on large screens */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-black">Service Analytics</h3>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Weekly Requests</span>
          </div>
          <AnalyticsChart />
        </div>

        {/* Recent Activity List - Takes 3 columns on large screens */}
        <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-black">Recent Activity</h3>
            {/* <button className="text-xs text-amber-700 font-semibold hover:underline">View All</button> */}
          </div>
          <RecentActivity orders={orders} />
        </div>

      </div>
    </div>
  );
}