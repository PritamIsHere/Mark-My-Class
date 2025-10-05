import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const bcaData = [
  { month: "Jan", students: 120 },
  { month: "Feb", students: 80 },
  { month: "Mar", students: 180 },
  { month: "Apr", students: 150 },
  { month: "May", students: 122 },
  { month: "Jun", students: 200 },
];

const bbaData = [
  { month: "Jan", students: 140 },
  { month: "Feb", students: 70 },
  { month: "Mar", students: 94 },
  { month: "Apr", students: 193 },
  { month: "May", students: 150 },
  { month: "Jun", students: 150 },
];

const MyChart = () => {
  const [showBCA, setShowBCA] = useState(true);
  const [showBBA, setShowBBA] = useState(true);
  const [semester, setSemester] = useState("Sem 1");

  // Build a combined dataset by month so we can compare selected programs side-by-side
  const combinedData = useMemo(() => {
    const byMonth = new Map();
    for (const item of bcaData) {
      byMonth.set(item.month, { month: item.month, bcaStudents: item.students });
    }
    for (const item of bbaData) {
      const existing = byMonth.get(item.month) || { month: item.month };
      byMonth.set(item.month, { ...existing, bbaStudents: item.students });
    }
    return Array.from(byMonth.values());
  }, []);

  return (
    <div className="w-full h-full">
      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-600 mb-1">Semester</label>
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          <option value="Sem 1">Sem 1</option>
          <option value="Sem 2">Sem 2</option>
          <option value="Sem 3">Sem 3</option>
          <option value="Sem 4">Sem 4</option>
          <option value="Sem 5">Sem 5</option>
          <option value="Sem 6">Sem 6</option>
        </select>
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          onClick={() => setShowBCA(!showBCA)}
          className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
            showBCA
              ? "bg-orange-500 border-orange-500 text-white"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
          aria-pressed={showBCA}
        >
          BCA
        </button>
        <button
          type="button"
          onClick={() => setShowBBA(!showBBA)}
          className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
            showBBA
              ? "bg-blue-500 border-blue-500 text-white"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
          aria-pressed={showBBA}
        >
          BBA
        </button>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={combinedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[0, 200]} />
          <Tooltip />
          <Legend />
          {showBCA && (
            <Bar dataKey="bcaStudents" fill="#f97316" name="BCA Students" />
          )}
          {showBBA && (
            <Bar dataKey="bbaStudents" fill="#60a5fa" name="BBA Students" />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MyChart;
