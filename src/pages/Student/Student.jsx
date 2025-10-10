import { useAuth } from "../../Context/AuthContext";
import Sidebar from "../../components/Sidebar/Sidebar";
import LoadingScreen from "../../components/Apploading/Loading";
import React, { useState, useEffect, useRef, useMemo } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Search, User, Bell } from "lucide-react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_dataviz from "@amcharts/amcharts4/themes/dataviz";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

const Student = () => {
  const { userRole, fullLoading, authToken, CurrentUser } = useAuth();
  const [attendanceData, setAttendanceData] = useState([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Subject for dropdown and modal
  const [selectedSubject, setSelectedSubject] = useState("Overall");
  const [modalSubject, setModalSubject] = useState(null);
  const [subjectDetails, setSubjectDetails] = useState([]);
  const [subjectDetailsLoading, setSubjectDetailsLoading] = useState(false);
  const [subjectDetailsError, setSubjectDetailsError] = useState(null);

  const [open, setOpen] = useState(false);

  // Fetch attendance summary
  useEffect(() => {
    const fetchAttendanceSummary = async () => {
      if (!authToken || !CurrentUser) return;
      setApiLoading(true);
      setApiError(null);
      try {
        const studentId = CurrentUser?.existuser?._id;
        if (!studentId) throw new Error("Missing student id");

        const attendanceRes = await axiosInstance.get(
          `/user/student/${studentId}/attendance-summary`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        setAttendanceData(attendanceRes.data?.summary || []);
      } catch (err) {
        setApiError(
          err?.response?.data?.message || err?.message || "Unknown error"
        );
      } finally {
        setApiLoading(false);
      }
    };

    fetchAttendanceSummary();
  }, [authToken, CurrentUser]);

  // Fetch subject details for modal
  useEffect(() => {
    const fetchSubjectDetails = async () => {
      if (!modalSubject || !authToken || !CurrentUser) {
        setSubjectDetails([]);
        setSubjectDetailsError(null);
        setSubjectDetailsLoading(false);
        return;
      }
      setSubjectDetailsLoading(true);
      setSubjectDetailsError(null);
      try {
        const studentId = CurrentUser?.existuser?._id;
        const subjectName = modalSubject.subjectName;
        if (!studentId || !subjectName)
          throw new Error("Missing student id or subject name");

        const res = await axiosInstance.get(
          `/user/student/${studentId}/attendance/${encodeURIComponent(
            subjectName
          )}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );

        const details =
          res.data.details || res.data.attendance || res.data.records || [];
        setSubjectDetails(details);
      } catch (err) {
        setSubjectDetails([]);
        setSubjectDetailsError(
          err?.response?.data?.message || err?.message || "Unknown error"
        );
      } finally {
        setSubjectDetailsLoading(false);
      }
    };

    if (modalSubject) fetchSubjectDetails();
  }, [modalSubject, authToken, CurrentUser]);

  if (fullLoading) return <LoadingScreen />;

  // Pie chart data based on dropdown
  const pieData = useMemo(() => {
    if (selectedSubject === "Overall") {
      const present = attendanceData.reduce(
        (sum, row) => sum + (row.totalPresents || 0),
        0
      );
      const total = attendanceData.reduce(
        (sum, row) => sum + (row.totalClasses || 0),
        0
      );
      const absent = Math.max(total - present, 0);
      return total > 0
        ? [
            { category: "Present", value: present },
            { category: "Absent", value: absent },
          ]
        : [];
    } else {
      const found = attendanceData.find(
        (row) => (row.subjectName || row.subject) === selectedSubject
      );
      if (!found) return [];
      const total = found.totalClasses ?? found.totalLectures ?? 0;
      const present =
        found.totalPresents ?? found.presents ?? found.present ?? 0;
      const absent = Math.max(total - present, 0);
      return total > 0
        ? [
            { category: "Present", value: present },
            { category: "Absent", value: absent },
          ]
        : [];
    }
  }, [attendanceData, selectedSubject]);

  // Chart refs
  const chartRef = useRef(null);
  const chartDivRef = useRef(null);

  // Create chart
  // useEffect(() => {
  //   if (!chartDivRef.current) return;
  //   am4core.useTheme(am4themes_dataviz);

  //   const chart = am4core.create(chartDivRef.current, am4charts.PieChart3D);
  //   chart.hiddenState.properties.opacity = 0;
  //   chart.responsive.enabled = true;
  //   chart.innerRadius = am4core.percent(0);
  //   chart.depth = 50;
  //   chart.angle = 20;

  //   const title = chart.titles.create();
  //   title.text =
  //     selectedSubject === "Overall"
  //       ? "Overall Attendance Distribution"
  //       : `${selectedSubject} Attendance Distribution`;
  //   title.fontSize = 18;
  //   title.fontWeight = "700";
  //   title.marginBottom = 10;

  //   const series = chart.series.push(new am4charts.PieSeries3D());
  //   series.dataFields.value = "value";
  //   series.dataFields.category = "category";
  //   series.colors.list = [
  //     am4core.color("#1E88E5"), // Present (green)
  //     am4core.color("#FB8C00"), // Absent (red)
  //   ];
  //   const slice = series.slices.template;
  //   slice.stroke = am4core.color("#ffffff");
  //   slice.strokeWidth = 2;
  //   slice.strokeOpacity = 1;
  //   slice.cornerRadius = 10;

  //   // Glossy
  //   const fillMod = new am4core.LinearGradientModifier();
  //   fillMod.brightnesses = [-0.25, 0, -0.25];
  //   fillMod.offsets = [0, 0.5, 1];
  //   slice.fillModifier = fillMod;

  //   const dropShadow = new am4core.DropShadowFilter();
  //   dropShadow.blur = 3;
  //   dropShadow.opacity = 0.25;
  //   slice.filters.push(dropShadow);

  //   // --- REMOVE slice interaction code (make chart static) ---
  //   // const hover = slice.states.getKey("hover");
  //   // hover.properties.scale = 1.04;
  //   // const active = slice.states.getKey("active");
  //   // active.properties.shiftRadius = 0.08; // Explode when clicked

  //   series.labels.template.text =
  //     "{category}: {value.percent.formatNumber('#.0')}%";
  //   series.labels.template.fontSize = 12;
  //   series.labels.template.fontWeight = "600";
  //   series.labels.template.fill = am4core.color("#111827");
  //   series.labels.template.maxWidth = 140;
  //   series.labels.template.truncate = true;
  //   series.labels.template.wrap = true;

  //   series.ticks.template.disabled = false;
  //   series.ticks.template.strokeOpacity = 0.6;
  //   series.ticks.template.strokeWidth = 1;
  //   series.ticks.template.length = 10;

  //   chart.legend = new am4charts.Legend();
  //   chart.legend.position = "right";
  //   chart.legend.labels.template.fontSize = 13;
  //   chart.legend.valueLabels.template.fontSize = 13;
  //   // --- MAKE LEGEND STATIC (not clickable) ---
  //   chart.legend.itemContainers.template.clickable = false;
  //   chart.legend.itemContainers.template.focusable = false;
  //   chart.legend.itemContainers.template.cursorOverStyle =
  //     am4core.MouseCursorStyle.default;
  //   chart.legend.itemContainers.template.events.disableType("hit");

  //   chartRef.current = chart;
  //   return () => {
  //     chart.dispose();
  //     chartRef.current = null;
  //   };
  //   // eslint-disable-next-line
  // }, [selectedSubject]);

  useEffect(() => {
    if (!chartDivRef.current) return;

    // Apply themes
    am4core.useTheme(am4themes_animated);
    am4core.useTheme(am4themes_dataviz);

    // Create chart
    const chart = am4core.create(chartDivRef.current, am4charts.PieChart3D);
    chart.hiddenState.properties.opacity = 0;
    chart.responsive.enabled = true;
    chart.innerRadius = am4core.percent(0);
    chart.depth = 30;
    chart.angle = 35;

    // Chart title
    const title = chart.titles.create();
    title.text =
      selectedSubject === "Overall"
        ? "Overall Attendance Distribution"
        : `${selectedSubject} Attendance Distribution`;
    title.fontSize = 20;
    title.fontWeight = "700";
    title.fill = am4core.color("#333333");
    title.marginBottom = 15;

    // Series
    const series = chart.series.push(new am4charts.PieSeries3D());
    series.dataFields.value = "value";
    series.dataFields.category = "category";
    series.colors.list = [
      am4core.color("#1E88E5"), // Present - Blue
      am4core.color("#ff8700"), // Absent - Orange
    ];

    const slice = series.slices.template;
    // slice.stroke = am4core.color("#F28C28");
    // slice.strokeWidth = 1;
    // slice.strokeOpacity = 1;
    // slice.cornerRadius = 10;
    slice.filters.clear(); // Remove shadow

    // Smooth "fill" animation on load
    series.hiddenState.properties.opacity = 1;
    series.hiddenState.properties.startAngle = -90;
    series.hiddenState.properties.endAngle = -90;

    // Labels
    series.labels.template.text =
      "{category}: {value.percent.formatNumber('#.0')}%";
    series.labels.template.fontSize = 13;
    series.labels.template.fontWeight = "600";
    series.labels.template.fill = am4core.color("#555555");
    series.labels.template.maxWidth = 150;
    series.labels.template.truncate = true;
    series.labels.template.wrap = true;

    // Ticks
    series.ticks.template.strokeOpacity = 0.5;
    series.ticks.template.strokeWidth = 1;
    series.ticks.template.length = 10;

    // Legend
    chart.legend = new am4charts.Legend();
    chart.legend.position = "right";
    chart.legend.labels.template.fontSize = 13;
    chart.legend.valueLabels.template.fontSize = 13;
    chart.legend.itemContainers.template.clickable = false;
    chart.legend.itemContainers.template.focusable = false;
    chart.legend.itemContainers.template.cursorOverStyle =
      am4core.MouseCursorStyle.default;
    chart.legend.itemContainers.template.events.disableType("hit");

    chartRef.current = chart;

    return () => {
      chart.dispose();
      chartRef.current = null;
    };
    // eslint-disable-next-line
  }, [selectedSubject]);

  // Update chart data
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.data = pieData;
      // Update title text
      if (chartRef.current.titles.values[0])
        chartRef.current.titles.values[0].text =
          selectedSubject === "Overall"
            ? "Overall Attendance Distribution"
            : `${selectedSubject} Attendance Distribution`;
    }
  }, [pieData, selectedSubject]);

  // --- Subject Modal ---
  const SubjectModal = ({ subject, onClose, details, loading, error }) => {
    if (!subject) return null;
    const getStatusColor = (status) => {
      if (!status) return "bg-gray-100 text-gray-700";
      const normalized = status.toLowerCase();
      if (normalized === "present") return "bg-green-100 text-green-700";
      if (normalized === "absent") return "bg-red-100 text-red-700";
      if (normalized === "leave" || normalized === "on leave")
        return "bg-yellow-100 text-yellow-700";
      return "bg-gray-100 text-gray-700";
    };
    const getOnlyDate = (dateStr) => {
      if (!dateStr) return "";
      const match = dateStr.match(/^\d{4}-\d{2}-\d{2}/);
      return match ? match[0] : dateStr.split(" ")[0];
    };
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-md relative">
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-orange-600 text-xl font-bold"
            onClick={onClose}
          >
            &times;
          </button>
          <h4 className="text-lg sm:text-xl font-bold mb-4 text-orange-600 text-center">
            {subject.subjectName} Attendance Details
          </h4>
          <div className="overflow-y-auto max-h-72 sm:max-h-80">
            {loading ? (
              // <SkeletonTheme baseColor="#fed7aa" highlightColor="#ffedd5">
              //   ...skeleton table code here...
              // </SkeletonTheme>
              <></>
            ) : error ? (
              <div className="text-center py-6 text-red-600 font-semibold">
                {error}
              </div>
            ) : (
              <table className="min-w-full text-sm bg-white border border-gray-200 rounded">
                <thead>
                  <tr>
                    <th className="px-3 sm:px-4 py-2 text-left font-bold text-orange-600 uppercase border-b border-gray-300">
                      Date
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-left font-bold text-orange-600 uppercase border-b border-gray-300">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(details) && details.length > 0 ? (
                    details.map((entry, idx) => (
                      <tr
                        key={entry.date + idx}
                        className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="px-3 sm:px-4 py-2 border-b border-gray-300 text-gray-900">
                          {getOnlyDate(entry.date)}
                        </td>
                        <td className="px-3 sm:px-4 py-2 border-b border-gray-300">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(
                              entry.status
                            )}`}
                          >
                            {entry.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={2}
                        className="px-3 sm:px-4 py-4 text-center text-gray-500"
                      >
                        No attendance records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  };

  // --- UI ---
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />

      <div className="flex-1 flex flex-col items-center justify-start overflow-y-auto">
        {/* header code unchanged ... */}

        <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 text-orange-600 tracking-tight text-center">
          Welcome to your Dashboard 👋
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-6 text-center">
          Glad to see you again! Here's a quick overview of your attendance and
          recent activity.
        </p>

        {/* Attendance Summary Table */}
        <div className="w-full max-w-3xl bg-white rounded-xl shadow p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-4 text-orange-600">
            Attendance Summary
          </h3>
          {apiLoading ? (
            // <SkeletonTheme baseColor="#fed7aa" highlightColor="#ffedd5">
            //   ...skeleton table code here...
            // </SkeletonTheme>
            <></>
          ) : apiError ? (
            <div className="text-red-600 text-center py-4">{apiError}</div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
              {/* <table className="min-w-full text-xs sm:text-sm bg-white">
                <thead>
                  <tr>
                    <th className="px-3 sm:px-6 py-3 bg-orange-50 text-left font-bold text-orange-600 uppercase">
                      Subject
                    </th>
                    <th className="px-3 sm:px-6 py-3 bg-orange-50 text-left font-bold text-orange-600 uppercase">
                      Total
                    </th>
                    <th className="px-3 sm:px-6 py-3 bg-orange-50 text-left font-bold text-orange-600 uppercase">
                      Presents
                    </th>
                    <th className="px-3 sm:px-6 py-3 bg-orange-50 text-left font-bold text-orange-600 uppercase">
                      Attendance
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {attendanceData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-6 text-gray-500"
                      >
                        No attendance data found.
                      </td>
                    </tr>
                  ) : (
                    attendanceData.map((row, idx) => {
                      const subjectName =
                        row.subjectName || row.subject || "Unknown";
                      const totalClasses =
                        row.totalClasses ?? row.totalLectures ?? 0;
                      const presents =
                        row.totalPresents ?? row.presents ?? row.present ?? 0;
                      const percentage =
                        row.percentage !== undefined
                          ? row.percentage
                          : totalClasses
                          ? ((presents / totalClasses) * 100).toFixed(2)
                          : "0.00";
                      return (
                        <tr
                          key={subjectName}
                          className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                        >
                          <td className="px-3 sm:px-6 py-4 font-medium text-gray-900">
                            {subjectName}
                          </td>
                          <td className="px-3 sm:px-6 py-4 text-gray-700">
                            {totalClasses}
                          </td>
                          <td className="px-3 sm:px-6 py-4 text-gray-700">
                            {presents}
                          </td>
                          <td className="px-3 sm:px-6 py-4 font-semibold">
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                                parseFloat(percentage) >= 75
                                  ? "bg-green-100 text-green-700"
                                  : parseFloat(percentage) >= 50
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {percentage}%
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table> */}
            </div>
          )}
        </div>

        {/* Subject Dropdown above pie chart */}
        <div className="w-full max-w-4xl mx-auto my-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-0 text-orange-600 text-center sm:text-left">
              Attendance Distribution
            </h3>
            {/* Dropdown */}
            <select
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="Overall">Overall</option>
              {attendanceData.map((row) => {
                const subjectName = row.subjectName || row.subject || "Unknown";
                return (
                  <option key={subjectName} value={subjectName}>
                    {subjectName}
                  </option>
                );
              })}
            </select>
          </div>
          {/* 3D Pie Chart */}
          <div
            className="relative mx-auto"
            style={{
              width: 360,
              height: 360,
              maxWidth: "100%",
              aspectRatio: "1/1",
            }}
          >
            <div ref={chartDivRef} style={{ width: "100%", height: "100%" }} />
            {pieData.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                No data to display
              </div>
            )}
          </div>
          {/* View Button */}
          {selectedSubject !== "Overall" && (
            <div className="flex justify-center mt-4">
              <button
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded shadow"
                onClick={() =>
                  setModalSubject({ subjectName: selectedSubject })
                }
              >
                View
              </button>
            </div>
          )}
        </div>

        {/* Modal */}
        {modalSubject && (
          <SubjectModal
            subject={modalSubject}
            details={subjectDetails}
            loading={subjectDetailsLoading}
            error={subjectDetailsError}
            onClose={() => setModalSubject(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Student;
