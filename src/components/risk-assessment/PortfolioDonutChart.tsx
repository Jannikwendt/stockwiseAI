
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface PortfolioAllocation {
  name: string;
  value: number;
  color: string;
}

interface PortfolioDonutChartProps {
  allocation: PortfolioAllocation[];
}

const PortfolioDonutChart: React.FC<PortfolioDonutChartProps> = ({ allocation }) => {
  // Use darker colors for the chart
  const darkColorMapping: Record<string, string> = {
    "#9EA1FF": "#5D61B0", // Darker purple for Bonds
    "#98E4FF": "#3A7A9A", // Darker blue for Large Cap Stocks
    "#FDE1D3": "#C28B67", // Darker beige for Cash
    "#FFA69E": "#B0524A", // Darker salmon for International
    "#B8E0D2": "#6D9A8A", // Darker teal for Mid Cap Stocks
    "#C7F9CC": "#78A87D"  // Darker green for Small Cap Stocks
  };

  // Map the original allocation to use darker colors
  const darkerAllocation = allocation.map(item => ({
    ...item,
    color: darkColorMapping[item.color] || item.color
  }));

  return (
    <div className="pt-16 pb-2 relative z-20">
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 10, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={darkerAllocation}
              cx="50%"
              cy="50%"
              innerRadius={35}
              outerRadius={60}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              labelLine={false}
            >
              {darkerAllocation.map((entry, index) => (
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
