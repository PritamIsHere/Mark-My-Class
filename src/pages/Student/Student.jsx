import { useAuth } from "../../Context/AuthContext";
import Sidebar from "../../components/Sidebar/Sidebar";
import LoadingScreen from "../../components/Apploading/Loading";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import axiosInstance from "../../api/axiosInstance";
import { Search, User, Bell } from "lucide-react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_dataviz from "@amcharts/amcharts4/themes/dataviz";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

// -- Custom Counter hook for animated numbers --
function useAnimatedNumber(value, duration = 900) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    let raf;
    let start;
    const from = animatedValue;
    const to = value;

    if (from === to) return;

    function animate(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const next =
        from +
        (to - from) * (progress < 1 ? 1 - Math.pow(1 - progress, 2.1) : 1);
      setAnimatedValue(progress < 1 ? next : to);

      if (progress < 1) raf = requestAnimationFrame(animate);
    }

    raf = requestAnimationFrame(animate);
    return () => raf && cancelAnimationFrame(raf);
    // eslint-disable-next-line
  }, [value]);
  return animatedValue;
}

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

  // High-level KPIs
  const overallStats = useMemo(() => {
    const totalClasses = attendanceData.reduce(
      (sum, row) => sum + (row.totalClasses ?? row.totalLectures ?? 0),
      0
    );
    const totalPresents = attendanceData.reduce(
      (sum, row) =>
        sum + (row.totalPresents ?? row.presents ?? row.present ?? 0),
      0
    );
    const percentage = totalClasses
      ? Number(((totalPresents / totalClasses) * 100).toFixed(2))
      : 0;
    return { totalClasses, totalPresents, percentage };
  }, [attendanceData]);

  // Animated numbers for the KPI
  const animatedPercentage = useAnimatedNumber(overallStats.percentage);
  const animatedTotalPresents = useAnimatedNumber(overallStats.totalPresents);
  const animatedTotalClasses = useAnimatedNumber(overallStats.totalClasses);

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
    if (apiLoading) {
      // Return placeholder data while loading
      return [
        { category: "Present", value: 0 },
        { category: "Absent", value: 0 },
      ];
    }

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
  }, [attendanceData, selectedSubject, apiLoading]);

  // Chart refs
  const chartRef = useRef(null);
  const chartDivRef = useRef(null);

  // Create chart
  // useEffect(() => {
  //   if (!chartDivRef.current) return;

  //   // Apply themes
  //   am4core.useTheme(am4themes_animated);
  //   am4core.useTheme(am4themes_dataviz);

  //   // Create chart
  //   const chart = am4core.create(chartDivRef.current, am4charts.PieChart3D);
  //   chart.hiddenState.properties.opacity = 0;
  //   chart.responsive.enabled = true;
  //   chart.innerRadius = am4core.percent(10);
  //   chart.depth = 40;
  //   chart.angle = 25;
  //   chart.padding(10, 10, 10, 10);

  //   // Chart title
  //   const title = chart.titles.create();
  //   title.text =
  //     selectedSubject === "Overall"
  //       ? "Overall Attendance Distribution"
  //       : `${selectedSubject} Attendance Distribution`;
  //   title.fontSize = 18;
  //   title.fontWeight = "700";
  //   title.fill = am4core.color("#333333");
  //   title.marginBottom = 15;

  //   // Series
  //   const series = chart.series.push(new am4charts.PieSeries3D());
  //   series.dataFields.value = "value";
  //   series.dataFields.category = "category";
  //   series.colors.list = [
  //     am4core.color("#16a34a"), // Present - Green
  //     am4core.color("#ef4444"), // Absent - Red
  //   ];
  //   series.alignLabels = true;
  //   series.slices.template.tooltipText =
  //     "{category}: {value.value.formatNumber('#,###')} ({value.percent.formatNumber('#.0')}%)";

  //   const slice = series.slices.template;
  //   slice.filters.clear(); // Remove shadow

  //   // Smooth "fill" animation on load
  //   series.hiddenState.properties.opacity = 1;
  //   series.hiddenState.properties.startAngle = -90;
  //   series.hiddenState.properties.endAngle = -90;

  //   // Labels
  //   series.labels.template.text =
  //     "{category}: {value.percent.formatNumber('#.0')}%";
  //   series.labels.template.fontSize = 12;
  //   series.labels.template.fontWeight = "600";
  //   series.labels.template.fill = am4core.color("#555555");
  //   series.labels.template.maxWidth = 150;
  //   series.labels.template.truncate = true;
  //   series.labels.template.wrap = true;

  //   // Ticks
  //   series.ticks.template.strokeOpacity = 0.5;
  //   series.ticks.template.strokeWidth = 1;
  //   series.ticks.template.length = 10;

  //   // Legend
  //   chart.legend = new am4charts.Legend();
  //   chart.legend.position = "right";
  //   chart.legend.labels.template.fontSize = 13;
  //   chart.legend.valueLabels.template.fontSize = 13;
  //   chart.legend.itemContainers.template.clickable = false;
  //   chart.legend.itemContainers.template.focusable = false;
  //   chart.legend.itemContainers.template.cursorOverStyle =
  //     am4core.MouseCursorStyle.default;
  //   chart.legend.itemContainers.template.events.disableType("hit");

  // Responsive behavior
  // chart.responsive.rules.push({
  //   relevant: function (target) {
  //     return target.pixelWidth <= 768;
  //   },
  //   state: function (target, state) {
  //     if (target instanceof am4charts.Legend) {
  //       state.properties.position = "bottom";
  //     }
  //     if (target instanceof am4charts.PieSeries) {
  //       target.labels.template.fontSize = 11;
  //     }
  //     if (target instanceof am4charts.Chart) {
  //       const titleItem =
  //         target.titles && target.titles.values && target.titles.values[0];
  //       if (titleItem) titleItem.fontSize = 16;
  //     }
  //     return state;
  //   },
  // });

  // chart.responsive.rules.push({
  //   relevant: function (target) {
  //     return target.pixelWidth <= 480;
  //   },
  //   state: function (target, state) {
  //     if (target instanceof am4charts.Legend) {
  //       state.properties.position = "bottom";
  //     }
  //     if (target instanceof am4charts.PieSeries) {
  //       target.labels.template.disabled = true;
  //       target.ticks.template.disabled = true;
  //     }
  //     if (target instanceof am4charts.Chart) {
  //       const titleItem =
  //         target.titles && target.titles.values && target.titles.values[0];
  //       if (titleItem) titleItem.fontSize = 14;
  //     }
  //     return state;
  //   },
  // });

  //   chartRef.current = chart;

  //   return () => {
  //     chart.dispose();
  //     chartRef.current = null;
  //   };
  //   // eslint-disable-next-line
  // }, [selectedSubject]);

  useEffect(() => {
    if (!chartDivRef.current) return;

    am4core.useTheme(am4themes_animated);
    am4core.useTheme(am4themes_dataviz);

    const chart = am4core.create(chartDivRef.current, am4charts.PieChart3D);
    chart.hiddenState.properties.opacity = 0;
    chart.responsive.enabled = true;
    chart.innerRadius = am4core.percent(10);
    chart.depth = 40;
    chart.angle = 25;
    chart.padding(10, 10, 10, 10);

    const title = chart.titles.create();
    title.text =
      selectedSubject === "Overall"
        ? "Overall Attendance Distribution"
        : `${selectedSubject} Attendance Distribution`;
    title.fontSize = 18;
    title.fontWeight = "700";
    title.fill = am4core.color("#333333");
    title.marginBottom = 15;

    const series = chart.series.push(new am4charts.PieSeries3D());
    series.dataFields.value = "value";
    series.dataFields.category = "category";
    series.colors.list = [
      am4core.color("#16a34a"), // Present
      am4core.color("#ef4444"), // Absent
    ];
    series.alignLabels = true;
    series.slices.template.tooltipText =
      "{category}: {value.value.formatNumber('#,###')} ({value.percent.formatNumber('#.0')}%)";

    const slice = series.slices.template;
    slice.filters.clear();

    // Slice click event
    slice.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    if (selectedSubject !== "Overall") {
      slice.events.on("hit", (ev) => {
        const category = ev.target.dataItem.category;
        setModalSubject({ subjectName: selectedSubject, filter: category });
      });
    }

    // Smooth fill animation
    series.hiddenState.properties.opacity = 1;
    series.hiddenState.properties.startAngle = -90;
    series.hiddenState.properties.endAngle = -90;

    // Labels & Legend
    series.labels.template.text =
      "{category}: {value.percent.formatNumber('#.0')}%";
    series.labels.template.fontSize = 12;
    series.labels.template.fontWeight = "600";
    series.labels.template.fill = am4core.color("#555555");

    chart.legend = new am4charts.Legend();
    chart.legend.position = "right";

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

  // Animated Counter for table cell (for each value in attendance table)
  function AnimatedTableNumber({ value, duration = 900, digits = 0 }) {
    const animated = useAnimatedNumber(value, duration);
    return (
      <span>
        {digits > 0
          ? animated.toLocaleString(undefined, {
              maximumFractionDigits: digits,
              minimumFractionDigits: digits,
            })
          : Math.round(animated)}
      </span>
    );
  }

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

    // Filter details by clicked slice

    const filteredDetails = useMemo(() => {
      if (!details) return [];
      if (!subject.subjectName || subject.subjectName === "Overall") return []; // Prevent table for overall
      if (!subject.filter) return details;
      return details.filter(
        (entry) => entry.status?.toLowerCase() === subject.filter.toLowerCase()
      );
    }, [details, subject]);

    const tableContent = useMemo(() => {
      if (subject.subjectName === "Overall") {
        return (
          <div className="text-center py-6 text-gray-600 font-medium">
            No detailed records available for Overall summary.
          </div>
        );
      }
      if (loading) {
        return (
          <div className="flex justify-center items-center bg-white py-10">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 border-orange-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-neutral-200 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
          </div>
        );
      }

      if (error) {
        return (
          <div className="text-center py-6 text-red-600 font-semibold">
            {error}
          </div>
        );
      }

      return (
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
            {filteredDetails.length > 0 ? (
              filteredDetails.map((entry, idx) => (
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
                  No attendance records found for{" "}
                  {subject.filter || "this category"}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      );
    }, [loading, error, details]);

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
            {subject.filter || "Overall"} Attendance Details
          </h4>
          <div className="overflow-y-auto max-h-72 sm:max-h-80">
            {tableContent}
          </div>
        </div>
      </div>
    );
  };

  const Header = ({ CurrentUser }) => {
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const UserDropdown = () => (
      <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg border border-gray-200 rounded-lg p-4 z-50">
        <h3 className="text-2xl font-semibold text-orange-600 border-b pb-2">
          Profile
        </h3>
        <div className="mt-3 space-y-2">
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Name: </span>
            {CurrentUser?.existuser?.name}
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Email: </span>
            {CurrentUser?.existuser?.email}
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Role: </span>
            {CurrentUser?.existuser?.role}
          </p>
        </div>
      </div>
    );

    return (
      <header className="flex flex-wrap items-center justify-between bg-white p-4 shadow border-b border-neutral-300 gap-4 sticky top-0 z-50">
        {/* Search Box */}
        <div className="flex items-center gap-3 flex-1 sm:flex-none w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg flex-1 sm:w-80">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search students, classes..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="bg-transparent focus:outline-none text-sm flex-1"
            />
          </div>
        </div>

        {/* Right Side Icons & User */}
        <div className="flex items-center gap-4 relative">
          {/* Bell Icon */}
          {/* <button
            aria-label="Notifications"
            className="relative inline-flex items-center justify-center h-10 w-10 rounded-full border border-orange-200 bg-white text-orange-600 hover:bg-orange-50 transition-colors"
          >
            <Bell size={18} />
          </button> */}

          {/* User Dropdown */}
          <div className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setOpen((prev) => !prev)}
            >
              <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                <User size={18} />
              </div>
              <span className="font-medium text-gray-700 hidden sm:block">
                {CurrentUser?.existuser?.name}
              </span>
            </div>

            {open && <UserDropdown />}
          </div>
        </div>
      </header>
    );
  };

  // --- UI ---
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center justify-start overflow-y-auto">
        {/* Advanced header */}
        <div className="w-full bg-gradient-to-r from-orange-50 via-white to-orange-50 border-b border-orange-100/60">
          <Header CurrentUser={CurrentUser} />
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-5 sm:py-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-orange-600 tracking-tight">
                Welcome
                {CurrentUser?.existuser?.name
                  ? `, ${CurrentUser.existuser.name}`
                  : ""}{" "}
                👋
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Your attendance overview and insights at a glance.
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                aria-label="Notifications"
                className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-orange-200 bg-white text-orange-600 hover:bg-orange-50 transition-colors"
              >
                <Bell size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="w-full max-w-6xl px-4 sm:px-6 mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-orange-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-xs font-semibold text-gray-500">
              Overall Attendance
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <div
                className={`text-2xl font-extrabold ${
                  overallStats.percentage >= 75
                    ? "text-green-600"
                    : overallStats.percentage >= 50
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                <span>
                  {`${useMemo(
                    () => Math.round(animatedPercentage * 100) / 100,
                    [animatedPercentage]
                  )}%`}
                </span>
              </div>
              <div className="text-xs text-gray-500">of classes</div>
            </div>
          </div>
          <div className="rounded-xl border border-orange-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-xs font-semibold text-gray-500">
              Total Presents
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <div className="text-2xl font-extrabold text-orange-600">
                <span>
                  {useMemo(
                    () => Math.round(animatedTotalPresents),
                    [animatedTotalPresents]
                  )}
                </span>
              </div>
              <div className="text-xs text-gray-500">sessions</div>
            </div>
          </div>
          <div className="rounded-xl border border-orange-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-xs font-semibold text-gray-500">
              Total Classes
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <div className="text-2xl font-extrabold text-slate-800">
                <span>
                  {useMemo(
                    () => Math.round(animatedTotalClasses),
                    [animatedTotalClasses]
                  )}
                </span>
              </div>
              <div className="text-xs text-gray-500">sessions</div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-6xl bg-white rounded-xl shadow-sm border border-orange-100 px-4 sm:px-6 py-5 mt-6">
          <h3 className="text-base sm:text-lg font-semibold mb-4 text-orange-600 flex items-center justify-between">
            Attendance Summary
            <span className="text-xs text-gray-500 font-normal">
              by subject
            </span>
          </h3>
          {useMemo(() => {
            if (apiLoading)
              return (
                <SkeletonTheme baseColor="#fed7aa" highlightColor="#ffedd5">
                  <div className="space-y-3">
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                      <table className="min-w-full text-xs sm:text-sm bg-white">
                        <thead>
                          <tr>
                            {["Subject", "Total", "Presents", "Attendance"].map(
                              (header) => (
                                <th
                                  key={header}
                                  className="px-3 sm:px-6 py-3 bg-orange-50 text-left font-bold text-orange-600 uppercase"
                                >
                                  {header}
                                </th>
                              )
                            )}
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                          {[...Array(5)].map((_, i) => (
                            <tr
                              key={i}
                              className={
                                i % 2 === 0 ? "bg-gray-50" : "bg-white"
                              }
                            >
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                <Skeleton
                                  width={120}
                                  height={18}
                                  borderRadius={6}
                                />
                              </td>
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                <Skeleton
                                  width={60}
                                  height={18}
                                  borderRadius={6}
                                />
                              </td>
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                <Skeleton
                                  width={60}
                                  height={18}
                                  borderRadius={6}
                                />
                              </td>
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                <Skeleton
                                  width={70}
                                  height={22}
                                  borderRadius={9999}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </SkeletonTheme>
              );

            if (apiError)
              return (
                <div className="text-red-600 text-center py-4">{apiError}</div>
              );
            return (
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-full text-xs sm:text-sm bg-white">
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
                            className={
                              idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                            }
                          >
                            <td className="px-3 sm:px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                              {subjectName}
                            </td>
                            <td className="px-3 sm:px-6 py-4 text-gray-700 whitespace-nowrap">
                              <AnimatedTableNumber value={totalClasses} />
                            </td>
                            <td className="px-3 sm:px-6 py-4 text-gray-700 whitespace-nowrap">
                              <AnimatedTableNumber value={presents} />
                            </td>
                            <td className="px-3 sm:px-6 py-4 font-semibold whitespace-nowrap">
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                                  parseFloat(percentage) >= 75
                                    ? "bg-green-100 text-green-700"
                                    : parseFloat(percentage) >= 50
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                <AnimatedTableNumber
                                  value={parseFloat(percentage)}
                                  digits={2}
                                />
                                %
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            );
          }, [attendanceData, apiLoading, apiError])}
        </div>

        {/* Subject Dropdown above pie chart */}
        <div className="w-full max-w-6xl mx-auto my-8 bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-0 text-orange-600">
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
              width: "100%",
              maxWidth: 560,
              aspectRatio: "1 / 1",
            }}
          >
            <div ref={chartDivRef} style={{ width: "100%", height: "100%" }} />
            {apiLoading && (
              <div className="flex justify-center items-center bg-white py-10">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 border-4 border-orange-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-neutral-200 border-t-orange-500 rounded-full animate-spin"></div>
                </div>
              </div>
            )}
            {pieData.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                No data to display
              </div>
            )}
          </div>
          {/* View Button */}
          {/* {selectedSubject !== "Overall" && (
            <div className="flex justify-center mt-4">
              <button
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded shadow-sm border border-orange-700/30"
                onClick={() =>
                  setModalSubject({ subjectName: selectedSubject })
                }
              >
                View
              </button>
            </div>
          )} */}
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
