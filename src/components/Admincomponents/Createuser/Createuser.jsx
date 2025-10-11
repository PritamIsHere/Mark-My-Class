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
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    if (loading) return;
    setLoading(true);

    try {
      const data = new FormData(e.target);

      if (role === "student" && !selectedFile) {
        toast.error("Please select an image under 80KB");
        return;
      }

      const body = new FormData();
      body.append("name", data.get("name"));
      body.append("email", data.get("email"));
      body.append("role", role);

      if (role !== "admin") body.append("department", data.get("department"));

      if (role === "student") {
        body.append("semester", data.get("semester"));
        body.append("year", data.get("year"));
        body.append("avatar", selectedFile);
      }

      if (role === "teacher") {
        body.append("subjects", JSON.stringify(subjects));
      }

      const res = await axiosInstance.post("/admin/create-user", body, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(
        `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully!`
      );

      setSuccessData({
        role: role,
        email: res.data?.email,
        tempPassword: res.data?.tempPassword,
      });

      e.target.reset();
      setSubjects([]);
      setPreview(null);
      setSelectedFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content with scroll */}
      <div className="flex-1 overflow-y-auto mb-15 md:mb-0">
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
                  disabled={loading}
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
                  disabled={loading}
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
                      disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
                    name="year"
                    min="1"
                    required
                    className="mt-1 w-full border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter year"
                  />
                </div>
              )}

              {/* Student Image (only for student) */}
              {role === "student" && (
                <div>
                  <label className="block text-sm font-semibold text-orange-600">
                    Student Image
                  </label>
                  <input
                    type="file"
                    name="avatar"
                    disabled={loading}
                    accept="image/*"
                    required
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        if (file.size > 90 * 1024) {
                          toast.error("Image size must be under 90KB");
                          e.target.value = "";
                          setPreview(null);
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = (ev) => setPreview(ev.target.result);
                        reader.readAsDataURL(file);
                        setSelectedFile(file);
                      }
                    }}
                    className="mt-1 w-full border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />

                  {/* Image Preview */}
                  {preview && (
                    <div className="relative mt-3 w-32 h-32">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-32 h-32 rounded-lg object-cover border border-orange-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(null);
                          setSelectedFile(null);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  )}
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

              {/* Creating user eg: Admin , Teacher , Student */}
              <button
                className="bg-orange-500 font-semibold text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating {role}...
                  </>
                ) : (
                  `Create ${role}`
                )}
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
