"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Sun", requests: 12 },
  { name: "Mon", requests: 18 },
  { name: "Tue", requests: 15 },
  { name: "Wed", requests: 25 },
  { name: "Thu", requests: 32 },
  { name: "Fri", requests: 20 },
  { name: "Sat", requests: 28 },
];

export function AnalyticsChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d97706" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Area 
            type="monotone" 
            dataKey="requests" 
            stroke="#d97706" 
            fillOpacity={1} 
            fill="url(#colorRequests)" 
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// "use client";
// import { AreaChart, Area, ResponsiveContainer } from "recharts";

// export function AnalyticsChart({ orders = [] }: { orders: any[] }) {

//     const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
//   const chartData = days.map(day => {
//     const count = orders.filter((order: any) => {
//       const orderDay = new Date(order.scheduledDate || order.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
//       return orderDay === day;
//     }).length;
    
//     return { name: day, requests: count };
//   });

//   return (
//     <div className="h-[300px] w-full">
//       <ResponsiveContainer width="100%" height="100%">
//         <AreaChart data={chartData}>
//           <Area type="monotone" dataKey="requests" stroke="#d97706" fill="url(#colorRequests)" strokeWidth={3} />
//         </AreaChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }