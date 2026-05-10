"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function BudgetChart({ activities }: { activities: any[] }) {
  // Aggregate costs by category
  const costByCategory = activities.reduce((acc: any, curr: any) => {
    const cost = Number(curr.cost) || 0;
    if (cost === 0) return acc;
    
    if (!acc[curr.category]) {
      acc[curr.category] = 0;
    }
    acc[curr.category] += cost;
    return acc;
  }, {});

  const data = Object.keys(costByCategory).map(category => ({
    name: category,
    value: costByCategory[category]
  }));

  const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#64748b'];

  const totalCost = data.reduce((sum, item) => sum + item.value, 0);

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4">Budget Breakdown</h3>
        <p className="text-slate-500 text-sm">No expenses found for this trip.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <h3 className="font-bold text-slate-800 dark:text-white mb-2">Budget Breakdown</h3>
      <p className="text-3xl font-extrabold text-brand-600 dark:text-brand-400 mb-6">
        ${totalCost.toLocaleString()} <span className="text-sm font-medium text-slate-500">Total Est.</span>
      </p>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => `$${value}`}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
