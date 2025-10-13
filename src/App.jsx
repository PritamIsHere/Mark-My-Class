import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  AdminRoute,
  TeacherRoute,
  StudentRoute,
  PublicRoute,
  PrivateRoute,
} from "./auth/Auth";
import { ResetProvider } from "./Context/ResetContext";
import { AuthProvider } from "./Context/AuthContext";
import { ResponsiveProvider } from "./Context/ResponsiveContext";
import "./App.css";
import Home from "./pages/Home/Home";
import LoginPage from "./pages/Login/Login";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard/Dashboard";

// Admin Components Area

import Createuser from "./components/Admincomponents/Createuser/Createuser";
import Resetpassword from "./components/Admincomponents/Resetpassword/Resetpassword";
import Collegeconfig from "./components/Admincomponents/Collegeconfig/Collegeconfig";

// Teachers Components Area

import CreateQr from "./components/Teachercomponents/CreateQrCode/CreateQr";
import TeacherAttendence from "./components/Teachercomponents/TeachersAttendance/TeacherAttendence";
import MarkAttendance from "./components/Teachercomponents/MarkAttendance/MarkAttendance";

// Student Components Area

import ScanQr from "./components/Studentcomponents/ScanQr/ScanQr";
import StudentLeaderBoard from "./components/Studentcomponents/StudentLeaderBoard/StudentLeaderBoard";
import Error from "./pages/Error/Error";

const App = () => {
  return (
    <BrowserRouter>
      <ResponsiveProvider>
        <ResetProvider>
          <AuthProvider>
            <Toaster />
            <Routes>
              {/*                                             Private Route */}

              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              {/*                                             Public Route */}

              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />

              {/*                                             Admin Routes area */}

              <Route
                path="/admin/create-user"
                element={
                  <PrivateRoute>
                    <AdminRoute>
                      <Createuser />
                    </AdminRoute>
                  </PrivateRoute>
                }
              />

              <Route
                path="/admin/reset-password"
                element={
                  <PrivateRoute>
                    <AdminRoute>
                      <Resetpassword />
                    </AdminRoute>
                  </PrivateRoute>
                }
              />

              <Route
                path="/admin/college-config"
                element={
                  <PrivateRoute>
                    <AdminRoute>
                      <Collegeconfig />
                    </AdminRoute>
                  </PrivateRoute>
                }
              />

              {/*                                             Teacher Routes area */}

              <Route
                path="/teacher/create-qr-code"
                element={
                  <PrivateRoute>
                    <TeacherRoute>
                      <CreateQr />
                    </TeacherRoute>
                  </PrivateRoute>
                }
              />

              <Route
                path="/teacher/attendance"
                element={
                  <PrivateRoute>
                    <TeacherRoute>
                      <TeacherAttendence />
                    </TeacherRoute>
                  </PrivateRoute>
                }
              />

              <Route
                path="/teacher/mark-attendance"
                element={
                  <PrivateRoute>
                    <TeacherRoute>
                      <MarkAttendance />
                    </TeacherRoute>
                  </PrivateRoute>
                }
              />

              {/*                                   Student Route Area */}

              <Route
                path="/student/scan-qr-code"
                element={
                  <PrivateRoute>
                    <StudentRoute>
                      <ScanQr />
                    </StudentRoute>
                  </PrivateRoute>
                }
              />

              <Route
                path="/student/leaderboard"
                element={
                  <PrivateRoute>
                    <StudentRoute>
                      <StudentLeaderBoard />
                    </StudentRoute>
                  </PrivateRoute>
                }
              />

              <Route path="/home" element={<Home />} />
              <Route path="*" element={<Error />} />
            </Routes>
          </AuthProvider>
        </ResetProvider>
      </ResponsiveProvider>
    </BrowserRouter>
  );
};

export default App;
