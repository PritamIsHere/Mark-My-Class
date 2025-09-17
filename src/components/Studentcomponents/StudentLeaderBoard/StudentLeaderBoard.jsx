import React from "react";
import Sidebar from "../../../components/Sidebar/Sidebar";

const StudentLeaderBoard = () => {
  return (
    <div className="flex h-screen w-full bg-gray-50">
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center mt-6 sm:mt-10 px-2 sm:px-6 overflow-y-auto">
        <h2 className="text-lg sm:text-2xl font-bold mb-4 text-center text-orange-500">
          Student Leader Board
        </h2>

        {/* Leaderboard Table */}
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-3 sm:p-6 mt-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
              <thead>
                <tr>
                  <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Roll No
                  </th>
                  <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Attendance (%)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {[
                  { name: "Aman Sharma", roll: "21CS001", attendance: 72 },
                  { name: "Priya Singh", roll: "21CS002", attendance: 88 },
                  { name: "Rahul Verma", roll: "21CS003", attendance: 65 },
                  { name: "Sneha Patel", roll: "21CS004", attendance: 94 },
                  { name: "Vikas Kumar", roll: "21CS005", attendance: 81 },
                  { name: "Ritu Yadav", roll: "21CS006", attendance: 100 },
                  { name: "Sahil Khan", roll: "21CS007", attendance: 90 },
                  { name: "Neha Gupta", roll: "21CS008", attendance: 69 },
                  { name: "Deepak Joshi", roll: "21CS009", attendance: 85 },
                  { name: "Simran Kaur", roll: "21CS010", attendance: 79 },
                ]
                  .sort((a, b) => b.attendance - a.attendance)
                  .map((student, idx) => (
                    <tr
                      key={student.roll}
                      className={`transition-colors duration-200 ${
                        idx === 0
                          ? "bg-orange-500 text-white font-bold"
                          : "hover:bg-orange-100"
                      }`}
                    >
                      <td className="px-2 sm:px-4 py-2">{idx + 1}</td>
                      <td className="px-2 sm:px-4 py-2">{student.name}</td>
                      <td className="px-2 sm:px-4 py-2">{student.roll}</td>
                      <td className="px-2 sm:px-4 py-2">
                        {student.attendance}%
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center sm:text-left">
            * Top 10 students with highest attendance are shown.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentLeaderBoard;
