import React, { useState, useEffect } from "react";

export default function App() {
  const [page, setPage] = useState("dashboard");

  /* ---------- State (with LocalStorage) ---------- */
  const [subjects, setSubjects] = useState(() =>
    JSON.parse(localStorage.getItem("subjects")) || []
  );

  const [courses, setCourses] = useState(() =>
    JSON.parse(localStorage.getItem("courses")) || []
  );

  const [batches, setBatches] = useState(() =>
    JSON.parse(localStorage.getItem("batches")) || []
  );

  const [students, setStudents] = useState(() =>
    JSON.parse(localStorage.getItem("students")) || []
  );

  /* ---------- Persist Data ---------- */
  useEffect(() => {
    localStorage.setItem("subjects", JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem("batches", JSON.stringify(batches));
  }, [batches]);

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex justify-center">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-10 py-6">

        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-5 tracking-wide">
            Training Management System
          </h1>

          <div className="flex flex-wrap justify-center gap-4">
            <NavBtn label="Dashboard" active={page === "dashboard"} onClick={() => setPage("dashboard")} />
            <NavBtn label="Subjects" active={page === "subjects"} onClick={() => setPage("subjects")} />
            <NavBtn label="Courses" active={page === "courses"} onClick={() => setPage("courses")} />
            <NavBtn label="Batches" active={page === "batches"} onClick={() => setPage("batches")} />
            <NavBtn label="Students" active={page === "students"} onClick={() => setPage("students")} />
          </div>
        </header>

        {/* Main Content */}
        <main className="bg-gray-800 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl w-full">
          {page === "dashboard" && (
            <Dashboard
              subjects={subjects}
              courses={courses}
              batches={batches}
              students={students}
            />
          )}

          {page === "subjects" && (
            <Subjects subjects={subjects} setSubjects={setSubjects} />
          )}

          {page === "courses" && (
            <Courses
              subjects={subjects}
              courses={courses}
              setCourses={setCourses}
            />
          )}

          {page === "batches" && (
            <Batches
              courses={courses}
              batches={batches}
              setBatches={setBatches}
            />
          )}

          {page === "students" && (
            <Students
              courses={courses}
              batches={batches}
              students={students}
              setStudents={setStudents}
            />
          )}
        </main>
      </div>
    </div>
  );
}

/* ---------------- Navigation Button ---------------- */
function NavBtn({ label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-full text-base sm:text-lg font-semibold transition-all duration-200 ${
        active
          ? "bg-blue-600 text-white scale-105"
          : "bg-gray-700 hover:bg-gray-600"
      }`}
    >
      {label}
    </button>
  );
}

/* ---------------- Dashboard ---------------- */
function Dashboard({ subjects, courses, batches, students }) {
  const Card = ({ title, count }) => (
    <div className="bg-gray-700 p-6 sm:p-8 rounded-xl shadow text-center">
      <h3 className="text-lg sm:text-xl font-semibold">{title}</h3>
      <p className="text-3xl sm:text-4xl font-bold mt-3 text-blue-400">{count}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      <Card title="Subjects" count={subjects.length} />
      <Card title="Courses" count={courses.length} />
      <Card title="Batches" count={batches.length} />
      <Card title="Students" count={students.length} />
    </div>
  );
}

/* ---------------- Common Card Layout ---------------- */
function CardLayout({ title, children }) {
  return (
    <div className="max-w-3xl mx-auto w-full">
      <h2 className="text-2xl sm:text-3xl font-bold mb-5 text-center">{title}</h2>

      <div className="bg-gray-700 p-6 sm:p-8 rounded-2xl shadow">
        {children}
      </div>
    </div>
  );
}

/* ---------------- Subjects ---------------- */
function Subjects({ subjects, setSubjects }) {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  const addSubject = () => {
    if (!name.trim()) {
      setMsg("Subject name is required");
      return;
    }

    if (subjects.includes(name.trim())) {
      setMsg("Duplicate subject not allowed");
      return;
    }

    setSubjects([...subjects, name.trim()]);
    setName("");
    setMsg("Subject added successfully");
  };

  const deleteSubject = (s) => {
    if (window.confirm("Delete this subject?")) {
      setSubjects(subjects.filter((x) => x !== s));
    }
  };

  return (
    <CardLayout title="Subject Management">

      <div className="flex flex-col sm:flex-row gap-4 mb-5">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Subject"
          className="border p-3 sm:p-4 flex-1 rounded-lg text-lg text-black"
        />

        <button
          onClick={addSubject}
          className="bg-green-600 px-6 py-3 rounded-lg text-lg font-semibold"
        >
          Add Subject
        </button>
      </div>

      {msg && <p className="mb-4 text-center text-red-400 text-lg">{msg}</p>}

      <ul className="space-y-3">
        {subjects.map((s, i) => (
          <li
            key={i}
            className="flex justify-between items-center bg-gray-800 px-4 py-3 rounded-lg text-lg"
          >
            {s}
            <button
              onClick={() => deleteSubject(s)}
              className="text-red-400 font-medium"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </CardLayout>
  );
}

/* ---------------- Courses ---------------- */
function Courses({ subjects, courses, setCourses }) {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState([]);
  const [msg, setMsg] = useState("");

  const toggle = (s) => {
    setSelected(
      selected.includes(s)
        ? selected.filter((x) => x !== s)
        : [...selected, s]
    );
  };

  const addCourse = () => {
    if (!name.trim()) {
      setMsg("Course name required");
      return;
    }

    if (selected.length < 2) {
      setMsg("Select at least 2 subjects");
      return;
    }

    if (courses.some((c) => c.name === name.trim())) {
      setMsg("Duplicate course not allowed");
      return;
    }

    setCourses([...courses, { name: name.trim(), subjects: selected }]);
    setName("");
    setSelected([]);
    setMsg("Course added successfully");
  };

  return (
    <CardLayout title="Course Management">

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Course Name"
        className="border p-3 sm:p-4 w-full mb-4 rounded-lg text-lg text-black"
      />

      <p className="font-semibold mb-3 text-lg">Select Subjects</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {subjects.map((s, i) => (
          <label key={i} className="flex items-center gap-3 text-lg">
            <input
              type="checkbox"
              checked={selected.includes(s)}
              onChange={() => toggle(s)}
              className="scale-125"
            />
            {s}
          </label>
        ))}
      </div>

      <button
        onClick={addCourse}
        className="bg-green-600 px-6 py-3 rounded-lg w-full text-lg font-semibold"
      >
        Add Course
      </button>

      {msg && <p className="text-red-400 mt-3 text-center text-lg">{msg}</p>}

      <ul className="mt-5 space-y-3">
        {courses.map((c, i) => (
          <li key={i} className="bg-gray-800 p-3 rounded-lg text-lg">
            <b>{c.name}</b> → {c.subjects.join(", ")}
          </li>
        ))}
      </ul>
    </CardLayout>
  );
}

/* ---------------- Batches ---------------- */
function Batches({ courses, batches, setBatches }) {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [msg, setMsg] = useState("");

  const addBatch = () => {
    if (!name || !course || !start || !end) {
      setMsg("All fields required");
      return;
    }

    if (start >= end) {
      setMsg("Start time must be before end time");
      return;
    }

    setBatches([...batches, { name, course, start, end }]);

    setName("");
    setCourse("");
    setStart("");
    setEnd("");
    setMsg("Batch added successfully");
  };

  return (
    <CardLayout title="Batch Management">

      <div className="space-y-4">
        <input
          placeholder="Batch Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-3 sm:p-4 w-full rounded-lg text-lg text-black"
        />

        <select
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className="border p-3 sm:p-4 w-full rounded-lg text-lg text-black"
        >
          <option value="">Select Course</option>
          {courses.map((c, i) => (
            <option key={i}>{c.name}</option>
          ))}
        </select>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="time"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="border p-3 sm:p-4 rounded-lg text-lg text-black"
          />

          <input
            type="time"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="border p-3 sm:p-4 rounded-lg text-lg text-black"
          />
        </div>

        <button
          onClick={addBatch}
          className="bg-green-600 px-6 py-3 rounded-lg w-full text-lg font-semibold"
        >
          Add Batch
        </button>

        {msg && <p className="text-red-400 text-center text-lg">{msg}</p>}
      </div>

      <ul className="mt-5 space-y-3">
        {batches.map((b, i) => (
          <li key={i} className="bg-gray-800 p-3 rounded-lg text-lg">
            <b>{b.name}</b> ({b.course}) → {b.start} - {b.end}
          </li>
        ))}
      </ul>
    </CardLayout>
  );
}

/* ---------------- Students ---------------- */
function Students({ courses, batches, students, setStudents }) {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [batch, setBatch] = useState("");
  const [msg, setMsg] = useState("");

  const filteredBatches = batches.filter((b) => b.course === course);

  const addStudent = () => {
    if (!name || !course || !batch) {
      setMsg("All fields required");
      return;
    }

    if (students.some((s) => s.name === name.trim())) {
      setMsg("Duplicate student not allowed");
      return;
    }

    setStudents([...students, { name: name.trim(), course, batch }]);

    setName("");
    setCourse("");
    setBatch("");
    setMsg("Student added successfully");
  };

  return (
    <CardLayout title="Student Management">

      <div className="space-y-4">
        <input
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-3 sm:p-4 w-full rounded-lg text-lg text-black"
        />

        <select
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className="border p-3 sm:p-4 w-full rounded-lg text-lg text-black"
        >
          <option value="">Select Course</option>
          {courses.map((c, i) => (
            <option key={i}>{c.name}</option>
          ))}
        </select>

        <select
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
          className="border p-3 sm:p-4 w-full rounded-lg text-lg text-black"
        >
          <option value="">Select Batch</option>
          {filteredBatches.map((b, i) => (
            <option key={i}>{b.name}</option>
          ))}
        </select>

        <button
          onClick={addStudent}
          className="bg-green-600 px-6 py-3 rounded-lg w-full text-lg font-semibold"
        >
          Add Student
        </button>

        {msg && <p className="text-red-400 text-center text-lg">{msg}</p>}
      </div>

      <ul className="mt-5 space-y-3">
        {students.map((s, i) => (
          <li key={i} className="bg-gray-800 p-3 rounded-lg text-lg">
            {s.name} → {s.course} / {s.batch}
          </li>
        ))}
      </ul>
    </CardLayout>
  );
}
