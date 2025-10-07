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

// Raw per-semester data for BCA and BBA
const semesterData = {
  "Sem 1": {
    bca: [
      { month: "Jan", students: 120 },
      { month: "Feb", students: 60 },
      { month: "Mar", students: 180 },
      { month: "Apr", students: 90 },
      { month: "May", students: 122 },
      { month: "Jun", students: 200 },
    ],
    bba: [
      { month: "Jan", students: 80 },
      { month: "Feb", students: 130 },
      { month: "Mar", students: 60 },
      { month: "Apr", students: 170 },
      { month: "May", students: 190 },
      { month: "Jun", students: 110 },
    ],
  },
  "Sem 2": {
    bca: [
      { month: "Jan", students: 100 },
      { month: "Feb", students: 150 },
      { month: "Mar", students: 90 },
      { month: "Apr", students: 140 },
      { month: "May", students: 80 },
      { month: "Jun", students: 185 },
    ],
    bba: [
      { month: "Jan", students: 180 },
      { month: "Feb", students: 60 },
      { month: "Mar", students: 130 },
      { month: "Apr", students: 120 },
      { month: "May", students: 170 },
      { month: "Jun", students: 100 },
    ],
  },
  "Sem 3": {
    bca: [
      { month: "Jan", students: 60 },
      { month: "Feb", students: 170 },
      { month: "Mar", students: 110 },
      { month: "Apr", students: 195 },
      { month: "May", students: 70 },
      { month: "Jun", students: 180 },
    ],
    bba: [
      { month: "Jan", students: 190 },
      { month: "Feb", students: 80 },
      { month: "Mar", students: 170 },
      { month: "Apr", students: 100 },
      { month: "May", students: 120 },
      { month: "Jun", students: 60 },
    ],
  },
  "Sem 4": {
    bca: [
      { month: "Jan", students: 200 },
      { month: "Feb", students: 100 },
      { month: "Mar", students: 60 },
      { month: "Apr", students: 180 },
      { month: "May", students: 130 },
      { month: "Jun", students: 90 },
    ],
    bba: [
      { month: "Jan", students: 70 },
      { month: "Feb", students: 190 },
      { month: "Mar", students: 120 },
      { month: "Apr", students: 60 },
      { month: "May", students: 180 },
      { month: "Jun", students: 170 },
    ],
  },
  "Sem 5": {
    bca: [
      { month: "Jan", students: 80 },
      { month: "Feb", students: 200 },
      { month: "Mar", students: 70 },
      { month: "Apr", students: 120 },
      { month: "May", students: 190 },
      { month: "Jun", students: 100 },
    ],
    bba: [
      { month: "Jan", students: 200 },
      { month: "Feb", students: 60 },
      { month: "Mar", students: 180 },
      { month: "Apr", students: 90 },
      { month: "May", students: 110 },
      { month: "Jun", students: 170 },
    ],
  },
  "Sem 6": {
    bca: [
      { month: "Jan", students: 110 },
      { month: "Feb", students: 80 },
      { month: "Mar", students: 200 },
      { month: "Apr", students: 60 },
      { month: "May", students: 170 },
      { month: "Jun", students: 130 },
    ],
    bba: [
      { month: "Jan", students: 60 },
      { month: "Feb", students: 200 },
      { month: "Mar", students: 90 },
      { month: "Apr", students: 180 },
      { month: "May", students: 100 },
      { month: "Jun", students: 190 },
    ],
  },
};

const MyChart = () => {
  const [showBCA, setShowBCA] = useState(true);
  const [showBBA, setShowBBA] = useState(true);
  const [semester, setSemester] = useState("Sem 1");

  // Build a combined dataset by month so we can compare selected programs side-by-side
  const combinedData = useMemo(() => {
    const dataForSemester = semesterData[semester] || { bca: [], bba: [] };
    const byMonth = new Map();
    for (const item of dataForSemester.bca) {
      byMonth.set(item.month, { month: item.month, bcaStudents: item.students });
    }
    for (const item of dataForSemester.bba) {
      const existing = byMonth.get(item.month) || { month: item.month };
      byMonth.set(item.month, { ...existing, bbaStudents: item.students });
    }
    return Array.from(byMonth.values());
  }, [semester]);

  return (
    <div className="w-full h-full">
      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-600 mb-1">Semester</label>
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 outline-0"
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
