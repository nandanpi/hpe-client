"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  benign: number;
  phishing: number;
}

export function ConfidenceBarChart({ benign, phishing }: Props) {
  const data = [
    { name: "Benign", value: Math.round(benign * 100) },
    { name: "Phishing", value: Math.round(phishing * 100) },
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis unit="%" domain={[0, 100]} />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}
