import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


const programMonthlyData = {
  dsc: [
    { month: "Jan", students: 60 },
    { month: "Feb", students: 48 },
    { month: "Mar", students: 72 },
    { month: "Apr", students: 55 },
    { month: "May", students: 68 },
    { month: "Jun", students: 75 },
    { month: "Jul", students: 62 },
    { month: "Aug", students: 70 },
    { month: "Sep", students: 58 },
    { month: "Oct", students: 80 },
    { month: "Nov", students: 77 },
    { month: "Dec", students: 65 },
  ],
  python: [
    { month: "Jan", students: 50 },
    { month: "Feb", students: 68 },
    { month: "Mar", students: 57 },
    { month: "Apr", students: 73 },
    { month: "May", students: 66 },
    { month: "Jun", students: 52 },
    { month: "Jul", students: 61 },
    { month: "Aug", students: 64 },
    { month: "Sep", students: 59 },
    { month: "Oct", students: 78 },
    { month: "Nov", students: 72 },
    { month: "Dec", students: 60 },
  ],
};


const classDaysByMonth = {
  Jan: [2, 5, 9, 12, 16, 20, 23, 27],
  Feb: [1, 4, 8, 11, 15, 19, 22, 26],
  Mar: [3, 6, 10, 13, 17, 21, 24, 28],
  Apr: [2, 6, 9, 13, 16, 20, 23, 27],
  May: [1, 5, 8, 12, 15, 19, 22, 26],
  Jun: [3, 7, 10, 14, 17, 21, 24, 28],
  Jul: [2, 6, 9, 13, 16, 20, 23, 27],
  Aug: [1, 5, 8, 12, 15, 19, 22, 26],
  Sep: [3, 7, 10, 14, 18, 21, 25, 28],
  Oct: [2, 5, 9, 12, 16, 19, 23, 27],
  Nov: [1, 4, 8, 11, 15, 18, 22, 25],
  Dec: [3, 6, 10, 13, 17, 20, 24, 27],
};

const TeacherLinechart = () => {
  const [showDSC, setShowDSC] = useState(true);
  const [showPython, setShowPython] = useState(true);
  const [month, setMonth] = useState("All"); // "All" = monthly view, else specific month

  // Combine selected semester data by month for side-by-side comparison
  const monthlyData = useMemo(() => {
    const dataForPrograms = programMonthlyData || { dsc: [], python: [] };
    const byMonth = new Map();
    for (const item of dataForPrograms.dsc) {
      byMonth.set(item.month, { month: item.month, dscStudents: item.students });
    }
    for (const item of dataForPrograms.python) {
      const existing = byMonth.get(item.month) || { month: item.month };
      byMonth.set(item.month, { ...existing, pythonStudents: item.students });
    }
    return Array.from(byMonth.values());
  }, []);

  // If a specific month is chosen, show a single random day's data for that month
  const dailyRandomData = useMemo(() => {
    if (month === "All") return null;
    const dataForPrograms = programMonthlyData || { dsc: [], python: [] };
    const dscBase = dataForPrograms.dsc.find((d) => d.month === month)?.students ?? 0;
    const pythonBase = dataForPrograms.python.find((d) => d.month === month)?.students ?? 0;

    // Use predefined class-held days per selected month
    const days = (classDaysByMonth[month] || []).slice().sort((a, b) => a - b);
    const jitter = (base) => Math.min(80, Math.max(0, Math.round(base + (Math.random() * 20 - 10))));
    return days.map((d) => ({
      day: d,
      dscStudents: jitter(dscBase),
      pythonStudents: jitter(pythonBase),
    }));
  }, [month]);

  const isMonthlyView = month === "All";
  const chartData = isMonthlyView ? monthlyData : dailyRandomData;

  return (
    <div className="w-full h-full">
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-600 mb-1">Month</label>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 outline-0"
        >
          <option value="All">All</option>
          <option value="Jan">Jan</option>
          <option value="Feb">Feb</option>
          <option value="Mar">Mar</option>
          <option value="Apr">Apr</option>
          <option value="May">May</option>
          <option value="Jun">Jun</option>
          <option value="Jul">Jul</option>
          <option value="Aug">Aug</option>
          <option value="Sep">Sep</option>
          <option value="Oct">Oct</option>
          <option value="Nov">Nov</option>
          <option value="Dec">Dec</option>
        </select>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          onClick={() => setShowDSC(!showDSC)}
          className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${showDSC
              ? "bg-orange-500 border-orange-500 text-white"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          aria-pressed={showDSC}
        >
          DSC
        </button>
        <button
          type="button"
          onClick={() => setShowPython(!showPython)}
          className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${showPython
              ? "bg-blue-500 border-blue-500 text-white"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          aria-pressed={showPython}
        >
          Python
        </button>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={chartData || []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={isMonthlyView ? "month" : "day"}
            tick={{ fontSize: 14, fill: "#6b7280", fontWeight: 500 }}
            label={{
              value: isMonthlyView ? "Month" : "Day",
              position: "insideBottom",
              offset: -2,
              style: { fontSize: 16, fill: "#f97316", fontWeight: 700, letterSpacing: 1 }
            }}
          />
          <YAxis domain={[0, 80]}
            tick={{ fontSize: 14, fill: "#6b7280", fontWeight: 500 }}
            label={{
              value: "Number of Students",
              angle: -90,
              position: "insideLeft",
              offset: 0,
              style: { fontSize: 16, fill: "#f97316", fontWeight: 700, letterSpacing: 1, textAnchor: "middle" }
            }}
            width={60}
          />
          <Tooltip />
          <Legend />
          {showDSC && (
            <Line
              type="monotone"
              dataKey="dscStudents"
              stroke="#f97316"
              name="DSC Students"
              strokeWidth={2}
              dot={!isMonthlyView}
            />
          )}
          {showPython && (
            <Line
              type="monotone"
              dataKey="pythonStudents"
              stroke="#60a5fa"
              name="Python Students"
              strokeWidth={2}
              dot={!isMonthlyView}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TeacherLinechart;
