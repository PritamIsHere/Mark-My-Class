import React, { useState } from "react";
import Sidebar from "../../Sidebar/Sidebar";
import axiosInstance from "../../../api/axiosInstance";
import { useAuth } from "../../../Context/AuthContext";
import toast from "react-hot-toast";
import { CheckCircle2 } from "lucide-react";

const Createuser = () => {
  const [role, setRole] = useState("student");
  const [subjects, setSubjects] = useState([]);
  const [successData, setSuccessData] = useState(null);

  const { authToken } = useAuth();

  const handleAddSubject = () => {
    setSubjects([
      ...subjects,
      { subjectName: "", subjectCode: "", semester: "", department: "" },
    ]);
  };

  const handleRemoveSubject = (index) => {
    const updated = [...subjects];
    updated.splice(index, 1);
    setSubjects(updated);
  };

  const handleSubjectChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = value;
    setSubjects(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);

    const body = {
      name: data.get("name"),
      email: data.get("email"),
      role,
      department: role !== "admin" ? data.get("department") : null,
      semester: role === "student" ? Number(data.get("semester")) : null,
      year: role === "student" ? Number(data.get("year")) : null,
      subjects: role === "teacher" ? subjects : [],
    };

    try {
      const res = await axiosInstance.post("/admin/create-user", body, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      toast.success(
        `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully!`
      );
      setSuccessData({
        role: role,
        email: res.data?.email,
        tempPassword: res.data?.tempPassword,
      });
    } catch (error) {
      toast.error("Failed to create user");
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content with scroll */}
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full bg-gradient-to-br from-orange-100 to-white flex items-center justify-center p-6">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-orange-100 p-8">
            <h1 className="text-2xl font-bold text-orange-600 mb-6 text-center">
              Create New User
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-orange-600">
                  Name
                </label>
                <input
                  name="name"
                  required
                  className="mt-1 w-full border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-orange-600">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="mt-1 w-full border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter email address"
                />
              </div>

              {/* Role Toggle */}
              <div>
                <label className="block text-sm font-semibold text-orange-600 mb-2">
                  Role
                </label>
                <div className="flex gap-3">
                  {["admin", "teacher", "student"].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`px-4 py-2 rounded-lg border transition ${
                        role === r
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white text-orange-600 border-orange-300 hover:bg-orange-50"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Department (not for admin) */}
              {role !== "admin" && (
                <div>
                  <label className="block text-sm font-semibold text-orange-600">
                    Department
                  </label>
                  <input
                    name="department"
                    required
                    className="mt-1 w-full border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g. BCA, BSc CS"
                  />
                </div>
              )}

              {/* Semester (only for student) */}
              {role === "student" && (
                <div>
                  <label className="block text-sm font-semibold text-orange-600">
                    Semester
                  </label>
                  <input
                    type="number"
                    name="semester"
                    min="1"
                    max="8"
                    required
                    className="mt-1 w-full border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter semester"
                  />
                </div>
              )}

              {/* Year (only for student) */}
              {role === "student" && (
                <div>
                  <label className="block text-sm font-semibold text-orange-600">
                    Year
                  </label>
                  <input
                    type="number"
                    name="year"
                    min="1"
                    required
                    className="mt-1 w-full border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter year"
                  />
                </div>
              )}

              {/* Subjects (only for teacher) */}
              {role === "teacher" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-orange-600">
                      Subjects
                    </label>
                    <button
                      type="button"
                      onClick={handleAddSubject}
                      className="px-3 py-1 border border-orange-400 text-orange-600 rounded-lg hover:bg-orange-50"
                    >
                      + Add Subject
                    </button>
                  </div>

                  {subjects.map((subj, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 md:grid-cols-4 gap-3 border border-orange-200 p-3 rounded-xl bg-orange-50"
                    >
                      <input
                        placeholder="Subject Name"
                        name="subjectName"
                        value={subj.subjectName}
                        onChange={(e) =>
                          handleSubjectChange(
                            idx,
                            "subjectName",
                            e.target.value
                          )
                        }
                        className="border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <input
                        placeholder="Code"
                        name="subjectCode"
                        value={subj.subjectCode}
                        onChange={(e) =>
                          handleSubjectChange(
                            idx,
                            "subjectCode",
                            e.target.value
                          )
                        }
                        className="border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <input
                        type="number"
                        placeholder="Semester"
                        name="semester"
                        value={subj.semester}
                        onChange={(e) =>
                          handleSubjectChange(idx, "semester", e.target.value)
                        }
                        className="border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <input
                        placeholder="Department"
                        value={subj.department}
                        name="department"
                        onChange={(e) =>
                          handleSubjectChange(idx, "department", e.target.value)
                        }
                        className="border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(idx)}
                        className="col-span-1 md:col-span-4 bg-red-500 text-white rounded-lg py-2 hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold py-2 rounded-xl shadow-md"
              >
                Create User
              </button>
            </form>
          </div>
        </div>
      </div>
      {successData && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md">
            <CheckCircle2 className="text-green-500 w-16 h-16 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {role.charAt(0).toUpperCase() + role.slice(1)} Created
              Successfully!
            </h2>
            <p className="text-gray-600 mb-4">
              The {role.charAt(0).toUpperCase() + role.slice(1)} has been
              created. Share the credentials below
            </p>
            <div className="bg-gray-100 rounded-lg p-4 text-left mb-4">
              <p>
                <span className="font-semibold text-gray-800">Email:</span>{" "}
                {successData.email}
              </p>
              <p>
                <span className="font-semibold text-gray-800">
                  Temp Password:
                </span>{" "}
                {successData.tempPassword}
              </p>
            </div>
            <button
              onClick={() => setSuccessData(null)}
              className="mt-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Createuser;
