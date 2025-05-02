
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

interface PortfolioAllocation {
  name: string;
  value: number;
  color: string;
}

interface PortfolioDonutChartProps {
  allocation: PortfolioAllocation[];
}

const PortfolioDonutChart: React.FC<PortfolioDonutChartProps> = ({ allocation }) => {
  return (
    <div className="pt-10 pb-2">
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <PieChartIcon className="h-5 w-5 text-primary" />
        Recommended Portfolio Allocation
      </h3>
      <div className="h-[160px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={allocation}
              cx="50%"
              cy="50%"
              innerRadius={35}
              outerRadius={60}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              labelLine={false}
            >
              {allocation.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  stroke="var(--background)" 
                  strokeWidth={2} 
                />
              ))}
            </Pie>
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-card p-2 border rounded-md shadow-sm">
                      <p className="font-medium">{data.name}</p>
                      <p>{`${data.value}%`}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ paddingTop: 30, paddingBottom: 10 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PortfolioDonutChart;
