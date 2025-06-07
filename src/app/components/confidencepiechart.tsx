"use client";

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface Props {
  benign: number;
  phishing: number;
}

const COLORS = ["#4ade80", "#f87171"];

export function ConfidencePieChart({ benign, phishing }: Props) {
  const safeBenign = Number(benign) || 0;
  const safePhishing = Number(phishing) || 0;
  const total = safeBenign + safePhishing;

  const data =
    total > 0
      ? [
          { name: "Benign", value: safeBenign },
          { name: "Phishing", value: safePhishing },
        ]
      : [];

  if (data.length === 0) {
    return <p>No data to display</p>;
  }

  return (
    <div className="flex justify-center">
      <PieChart width={300} height={300}>
        <Pie
          dataKey="value"
          isAnimationActive
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
