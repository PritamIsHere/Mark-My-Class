import React, { useState } from "react";
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

const bcaData = [
  { month: "Jan", students: 120, teachers: 20 },
  { month: "Feb", students: 80, teachers: 21 },
  { month: "Mar", students: 180, teachers: 12 },
  { month: "Apr", students: 150, teachers: 22 },
  { month: "May", students: 122, teachers: 23 },
  { month: "Jun", students: 200, teachers: 25 },
];

const bbaData = [
  { month: "Jan", students: 140, teachers: 10 },
  { month: "Feb", students: 70, teachers: 15 },
  { month: "Mar", students: 94, teachers: 25 },
  { month: "Apr", students: 193, teachers: 12 },
  { month: "May", students: 150, teachers: 20 },
  { month: "Jun", students: 150, teachers: 19 },
];

const TeacherLinechart = () => {
  const [program, setProgram] = useState("BCA");

  const chartData = program === "BCA" ? bcaData : bbaData;

  return (
    <div className="w-full h-full">
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setProgram("BCA")}
          className={`px-4 py-2 rounded-lg font-medium ${
            program === "BCA"
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          DSC
        </button>
        <button
          onClick={() => setProgram("BBA")}
          className={`px-4 py-2 rounded-lg font-medium ${
            program === "BBA"
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Python
        </button>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[0, 220]} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="students"
            // stroke="#f97316"
            stroke="#60a5fa"
            name="Students"
            strokeWidth={2}
          />
          {/* <Line
            type="monotone"
            dataKey="teachers"
            stroke="#60a5fa"
            name="Teachers"
            strokeWidth={2}
          /> */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TeacherLinechart;
