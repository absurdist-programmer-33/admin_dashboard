// App.jsx — CHUNK 1 / 6

import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  LayoutDashboard,
  UserCog,
  ShieldAlert,
  MessageSquare,
  Hash,
  Calendar,
  Search,
  Bell,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";

/* ====================== */
/*  FONTS + BASE STYLES   */
/* ====================== */
function useInjectFontsAndBase() {
  useEffect(() => {
    if (document.getElementById("jec-fonts")) return;

    const link = document.createElement("link");
    link.id = "jec-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Roboto:wght@400;500&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.innerHTML = `
      :root{
        --brand-dark:#2C3E50;
        --bg:#F7F9FB;
        --card:#FFFFFF;
        --divider:#D0D5DD;
        --muted:#98A0A6;
        --green:#22C55E;
        --orange:#F59E0B;
        --red:#F87171;
        --blue:#3B82F6;
      }

      body { margin:0; background:var(--bg); font-family:Roboto; }
      h1,h2 { font-family:Poppins; color:var(--brand-dark); }
    `;
    document.head.appendChild(style);
  }, []);
}

/* ====================== */
/*     UI HELPER BLOCKS   */
/* ====================== */

const Container = ({ children }) =>
  <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>{children}</div>;

const Card = ({ title, children }) => (
  <div
    style={{
      background: "var(--card)",
      border: "1px solid var(--divider)",
      borderRadius: 8,
      padding: 16,
      marginBottom: 18,
      boxShadow: "0 1px 4px rgba(18,24,33,0.05)",
    }}
  >
    {title && (
      <div style={{ marginBottom: 12, fontSize: 16, fontWeight: 600 }}>{title}</div>
    )}
    {children}
  </div>
);

const Pill = ({ color, children }) => (
  <span
    style={{
      padding: "4px 8px",
      borderRadius: 6,
      fontSize: 12,
      fontWeight: 600,
      background: `${color}20`,
      color,
    }}
  >
    {children}
  </span>
);

/* ====================== */
/*         UTILITIES      */
/* ====================== */

const uid = (prefix = "") => prefix + Math.floor(1000 + Math.random() * 9000);

function moodToColor(avg) {
  if (avg <= -2.5) return "var(--red)";
  if (avg <= -1.5) return "var(--orange)";
  return "var(--green)";
}

/* ====================== */
/*      INITIAL DB        */
/* ====================== */

const initialDB = {
  counsellors: [
    { id: "CNS1001", name: "Asha Verma", gender: "Female", status: "Active", appointments: 12 },
    { id: "CNS1002", name: "Rohan Sen", gender: "Male", status: "Active", appointments: 7 },
  ],

  students: [
    {
      id: "STU001",
      alias: "ShadowTiger",
      gender: "Male",
      department: "CSE",
      semester: 4,
      mood7: [-2, -3, -4, -1, -3, -5, -4],
      moodMonth: [-2, -1.8, -2.3, -2],
      phq: 21,
      gad: 17,
    },
    {
      id: "STU002",
      alias: "SilentWolf",
      gender: "Male",
      department: "ECE",
      semester: 6,
      mood7: [-1, -2, -3, -2, -4, -3, -3],
      moodMonth: [-1.9, -2.1, -1.6, -1.8],
      phq: 19,
      gad: 15,
    },
    {
      id: "STU003",
      alias: "CalmSea",
      gender: "Female",
      department: "ME",
      semester: 2,
      mood7: [1, .8, 1.2, 1, .6, 1.1, .9],
      moodMonth: [.9, 1, .8, 1.1],
      phq: 2,
      gad: 1,
    },
  ],

  anonymousPosts: [
    { id: 1, alias: "ShadowTiger", text: "Exams are stressing me a lot.", hashtags: ["#examStress"], time: "2h" },
    { id: 2, alias: "NightOwl", text: "Can't sleep these days.", hashtags: ["#anxiety"], time: "10h" },
  ],

  trends: [
    { tag: "#examStress", sentiment: -0.5 },
    { tag: "#anxiety", sentiment: -0.4 },
    { tag: "#sleep", sentiment: -0.1 },
  ],

  flagged: [
    { id: 7, alias: "StormMind", text: "It's getting harder to cope…", reason: "AI Negative Sentiment" },
  ],

  reported: [
    { id: 4, alias: "BluePhoenix", text: "Thinking about giving up…", reports: 3 },
  ],

  appointments: [
    {
      counsellor: "Asha Verma",
      alias: "ShadowTiger",
      severity: "Critical",
      date: "2025-11-22",
      time: "15:30",
      mode: "Call",
      status: "Completed",
    },
  ],
};
// App.jsx — CHUNK 2 / 6

const navItem = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "10px 12px",
  borderRadius: 8,
  textDecoration: "none",
  background: "rgba(255,255,255,0.12)",
  color: "#fff",
  transition: "0.15s",
  fontSize: 14,
};

/* ====================== */
/*        SIDEBAR         */
/* ====================== */

function Sidebar({ open }) {
  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        width: open ? 260 : 80,
        background: "var(--green)",
        color: "#fff",
        padding: 20,
        transition: "0.2s",
        boxShadow: "0 4px 18px rgba(0,0,0,0.12)",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
        <div
          style={{
            width: 46,
            height: 46,
            background: "#fff",
            color: "var(--green)",
            fontWeight: 800,
            borderRadius: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 18,
          }}
        >
          JEC
        </div>
        {open && <div style={{ fontWeight: 700, fontSize: 18 }}>ALL IZZ WELL</div>}
      </div>

      {/* NAV ITEMS */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Link to="/" style={navItem}><LayoutDashboard size={18}/> {open && "Dashboard"}</Link>
        <Link to="/critical" style={navItem}><ShieldAlert size={18}/> {open && "Critical Students"}</Link>
        <Link to="/analytics" style={navItem}><Calendar size={18}/> {open && "Analytics"}</Link>
        <Link to="/posts" style={navItem}><MessageSquare size={18}/> {open && "Anonymous Posts"}</Link>
        <Link to="/hashtags" style={navItem}><Hash size={18}/> {open && "Trending"}</Link>
        <Link to="/appointments" style={navItem}><Calendar size={18}/> {open && "Appointments"}</Link>
        <Link to="/counsellors" style={navItem}><UserCog size={18}/> {open && "Counsellors"}</Link>
      </nav>

      <div style={{ marginTop: "auto", fontSize: 13, opacity: 0.85 }}>
        IQAC Officer
      </div>
    </aside>
  );
}

/* ====================== */
/*         HEADER         */
/* ====================== */

function Header({ open, setOpen, db }) {
  const healthy = db.students.filter(s => s.phq < 10 && s.gad < 8).length;
  const moderate = db.students.filter(
    s => (s.phq >= 10 && s.phq < 20) || (s.gad >= 8 && s.gad < 15)
  ).length;
  const critical = db.students.filter(s => s.phq >= 20 || s.gad >= 15).length;

  return (
    <header
      style={{
        padding: 12,
        background: "var(--card)",
        borderBottom: "1px solid var(--divider)",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <button
          onClick={() => setOpen((v) => !v)}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            background: "var(--green)",
            color: "#fff",
            border: "none",
            fontWeight: 600,
          }}
        >
          {open ? "← Collapse" : "→ Open"}
        </button>

        <div style={{ fontWeight: 700, fontSize: 18 }}>
          JEC — ALL IZZ WELL Dashboard
        </div>

        <Card>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Healthy</div>
          <div style={{ fontWeight: 700, color: "var(--green)" }}>{healthy}</div>
        </Card>

        <Card>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Moderate</div>
          <div style={{ fontWeight: 700, color: "var(--orange)" }}>{moderate}</div>
        </Card>

        <Card>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Critical</div>
          <div style={{ fontWeight: 700, color: "var(--red)" }}>{critical}</div>
        </Card>
      </div>

      <div style={{ display: "flex", gap: 14 }}>
        <Bell />
        <Search />
      </div>
    </header>
  );
}

/* ====================== */
/*        APP ROOT        */
/* ====================== */

export default function App() {
  useInjectFontsAndBase();

  const [db, setDb] = useState(JSON.parse(JSON.stringify(initialDB)));
  const [open, setOpen] = useState(true);

  const left = open ? 260 : 80;

  return (
    <Router>
      <Sidebar open={open} />

      <div style={{ marginLeft: left, transition: "0.2s" }}>
        <Header open={open} setOpen={setOpen} db={db} />

        <main style={{ padding: 20 }}>
          <Routes>
            <Route path="/" element={<MoodAnalyticsPage db={db} />} />
            <Route path="/critical" element={<CriticalStudentsPage db={db} />} />
            <Route path="/analytics" element={<MoodAnalyticsPage db={db} />} />

            <Route path="/posts" element={<AnonymousPostsPage db={db} />} />
            <Route path="/hashtags" element={<TrendingHashtagsPage db={db} />} />

            <Route path="/appointments" element={<AppointmentLogsPage db={db} />} />

            <Route path="/counsellors" element={<CounsellorListPage db={db} setDb={setDb} />} />
            <Route path="/counsellors/create" element={<CounsellorCreatePage db={db} setDb={setDb} />} />
            <Route path="/counsellors/:id" element={<CounsellorProfilePage db={db} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
// App.jsx — CHUNK 3 / 6

/* ====================== */
/*    COUNSELLOR LIST     */
/* ====================== */

function CounsellorListPage({ db, setDb }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");

  const filtered = db.counsellors.filter(c =>
    filter === "All" ? true : c.status === filter
  );

  const deactivate = (id) =>
    setDb((prev) => ({
      ...prev,
      counsellors: prev.counsellors.map((c) =>
        c.id === id ? { ...c, status: "Inactive" } : c
      ),
    }));

  const activate = (id) =>
    setDb((prev) => ({
      ...prev,
      counsellors: prev.counsellors.map((c) =>
        c.id === id ? { ...c, status: "Active" } : c
      ),
    }));

  return (
    <Container>
      <h1>Counsellors</h1>

      <div style={{ display: "flex", gap: 12, margin: "12px 0" }}>
        <button style={filterBtn} onClick={() => setFilter("All")}>All</button>
        <button style={filterBtn} onClick={() => setFilter("Active")}>Active</button>
        <button style={filterBtn} onClick={() => setFilter("Inactive")}>Inactive</button>

        <button
          onClick={() => navigate("/counsellors/create")}
          style={{
            marginLeft: "auto",
            background: "var(--green)",
            color: "#fff",
            padding: "8px 14px",
            borderRadius: 6,
            border: "none",
          }}
        >
          + Add Counsellor
        </button>
      </div>

      <Card>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--divider)" }}>
              <th style={th}>ID</th>
              <th style={th}>Name</th>
              <th style={th}>Gender</th>
              <th style={th}>Status</th>
              <th style={th}>Appointments</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={td}>{c.id}</td>
                <td style={td}>{c.name}</td>
                <td style={td}>{c.gender}</td>
                <td style={td}>
                  <Pill color={c.status === "Active" ? "var(--green)" : "var(--muted)"}>
                    {c.status}
                  </Pill>
                </td>
                <td style={td}>{c.appointments}</td>

                <td style={{ ...td, display: "flex", gap: 8 }}>
                  <button onClick={() => navigate(`/counsellors/${c.id}`)} style={btn}>
                    View
                  </button>

                  {c.status === "Active" ? (
                    <button onClick={() => deactivate(c.id)} style={dangerBtn}>
                      Deactivate
                    </button>
                  ) : (
                    <button onClick={() => activate(c.id)} style={greenBtn}>
                      Activate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Container>
  );
}

const filterBtn = {
  padding: "6px 12px",
  borderRadius: 6,
  border: "1px solid var(--divider)",
  background: "#fff",
};
const th = { padding: 10, textAlign: "left" };
const td = { padding: 10 };
const btn = { padding: "6px 10px", borderRadius: 6, border: "1px solid var(--divider)" };
const dangerBtn = { ...btn, borderColor: "var(--red)", color: "var(--red)" };
const greenBtn = { ...btn, borderColor: "var(--green)", color: "var(--green)" };

/* ====================== */
/*    COUNSELLOR CREATE   */
/* ====================== */

function CounsellorCreatePage({ db, setDb }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", gender: "Male", password: "", confirm: "" });

  const submit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return alert("Password mismatch");

    const newC = {
      id: uid("CNS"),
      name: form.name,
      gender: form.gender,
      status: "Active",
      appointments: 0,
    };

    setDb((prev) => ({ ...prev, counsellors: [newC, ...prev.counsellors] }));
    navigate("/counsellors");
  };

  return (
    <Container>
      <h1>Create Counsellor</h1>
      <Card>
        <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
          <div>
            <div>Name</div>
            <input style={input} onChange={(e)=>setForm({...form,name:e.target.value})} required />
          </div>

          <div>
            <div>Gender</div>
            <select style={input} value={form.gender}
              onChange={(e)=>setForm({...form,gender:e.target.value})}>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div>Password</div>
              <input type="password" style={input} required
                onChange={(e)=>setForm({...form,password:e.target.value})}/>
            </div>
            <div style={{ flex: 1 }}>
              <div>Confirm</div>
              <input type="password" style={input} required
                onChange={(e)=>setForm({...form,confirm:e.target.value})}/>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" style={submitBtn}>Create</button>
            <button type="button" style={cancelBtn} onClick={()=>navigate("/counsellors")}>
              Cancel
            </button>
          </div>
        </form>
      </Card>
    </Container>
  );
}

const input = {
  width: "100%", padding: 8, borderRadius: 6, border: "1px solid var(--divider)"
};
const submitBtn = {
  padding: "8px 14px",
  background: "var(--green)",
  borderRadius: 6,
  border: "none",
  color: "#fff",
};
const cancelBtn = {
  padding: "8px 14px",
  borderRadius: 6,
  border: "1px solid var(--divider)",
};
// App.jsx — CHUNK 4 / 6

/* ====================== */
/* COUNSELLOR PROFILE     */
/* ====================== */

function CounsellorProfilePage({ db }) {
  const { id } = useParams();
  const c = db.counsellors.find((x) => x.id === id);

  const critical = db.students.filter(s => s.phq >= 20 || s.gad >= 15).length;

  return (
    <Container>
      <h1>{c?.name}</h1>
      <div style={{ color: "var(--muted)" }}>ID: {c?.id} • Gender: {c?.gender}</div>

      <div style={{ marginTop: 20 }}>
        <Card title="Activity Summary">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 12 }}>Appointments</div>
              <div style={{ fontWeight: 700 }}>{c?.appointments}</div>
            </div>

            <div>
              <div style={{ fontSize: 12 }}>Critical Students</div>
              <div style={{ fontWeight: 700, color: "var(--red)" }}>{critical}</div>
            </div>
          </div>
        </Card>
      </div>
    </Container>
  );
}

/* ====================== */
/*   CRITICAL STUDENTS    */
/* ====================== */

function CriticalStudentsPage({ db }) {
  const critical = db.students.filter(s => s.phq >= 20 || s.gad >= 15);

  return (
    <Container>
      <h1>Critical Students</h1>
      <div style={{ color: "var(--muted)" }}>Students above severe thresholds</div>

      {critical.map((s) => (
        <Card key={s.id}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: 700 }}>{s.alias}</div>

              <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
                <div>
                  <div style={{ fontSize: 12 }}>PHQ-9</div>
                  <div style={{ fontWeight: 700, color: "var(--red)" }}>{s.phq}</div>
                </div>

                <div>
                  <div style={{ fontSize: 12 }}>GAD-7</div>
                  <div style={{ fontWeight: 700, color: "var(--red)" }}>{s.gad}</div>
                </div>
              </div>
            </div>

            <div style={{ width: 300 }}>
              <ResponsiveContainer width="100%" height={80}>
                <LineChart data={s.mood7.map((v,i)=>({day:i+1,v}))}>
                  <Line dataKey="v" stroke="var(--brand-dark)" strokeWidth={2} dot={false}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      ))}
    </Container>
  );
}
// App.jsx — CHUNK 5 / 6

/* ====================== */
/*    MOOD ANALYTICS      */
/* ====================== */

function MoodAnalyticsPage({ db }) {
  const [filters, setFilters] = useState({
    gender: "All", department: "All", semester: "All"
  });

  const genders = ["All", ...new Set(db.students.map(s=>s.gender))];
  const depts = ["All", ...new Set(db.students.map(s=>s.department))];
  const sems = ["All", ...new Set(db.students.map(s=>s.semester))];

  const filtered = db.students.filter(s => {
    if (filters.gender !== "All" && s.gender !== filters.gender) return false;
    if (filters.department !== "All" && s.department !== filters.department) return false;
    if (filters.semester !== "All" && s.semester !== Number(filters.semester)) return false;
    return true;
  });

  const weekly = [...Array(7)].map((_,i)=>{
    const vals = filtered.map(s=>s.mood7[i]||0);
    const avg = vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : 0;
    return { day:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i], mood:avg };
  });

  const monthly = [...Array(4)].map((_,i)=>{
    const vals = filtered.map(s=>s.moodMonth[i]||0);
    const avg = vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : 0;
    return { week:`Wk${i+1}`, mood:avg };
  });

  const avgMood = weekly.reduce((a,b)=>a+b.mood,0)/7;
  const graphColor = moodToColor(avgMood);

  return (
    <Container>
      <h1>Mood Analytics</h1>

      <div style={{ display:"flex", gap:20, margin:"20px 0" }}>
        <div>
          <div style={{ fontSize:12 }}>Gender</div>
          <select style={inputSelect}
            value={filters.gender}
            onChange={(e)=>setFilters({...filters,gender:e.target.value})}>
            {genders.map(g=> <option key={g}>{g}</option>)}
          </select>
        </div>

        <div>
          <div style={{ fontSize:12 }}>Department</div>
          <select style={inputSelect}
            value={filters.department}
            onChange={(e)=>setFilters({...filters,department:e.target.value})}>
            {depts.map(d=> <option key={d}>{d}</option>)}
          </select>
        </div>

        <div>
          <div style={{ fontSize:12 }}>Semester</div>
          <select style={inputSelect}
            value={filters.semester}
            onChange={(e)=>setFilters({...filters,semester:e.target.value})}>
            {sems.map(s=> <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <Card title="Weekly Mood Average">
        <div style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weekly}>
              <CartesianGrid stroke="#eee"/>
              <XAxis dataKey="day"/>
              <YAxis/>
              <Tooltip/>
              <Line dataKey="mood" stroke={graphColor} strokeWidth={3}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Monthly Mood (Wk1-Wk4)">
        <div style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthly}>
              <CartesianGrid stroke="#eee"/>
              <XAxis dataKey="week"/>
              <YAxis/>
              <Tooltip/>
              <Line dataKey="mood" stroke={graphColor} strokeWidth={3}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </Container>
  );
}

const inputSelect = {
  width:"100%", padding:8, borderRadius:6,
  border:"1px solid var(--divider)"
};
// App.jsx — CHUNK 6 / 6

/* ====================== */
/*   ANONYMOUS POSTS      */
/* ====================== */

function AnonymousPostsPage({ db }) {
  return (
    <Container>
      <h1>Anonymous Posts</h1>

      {db.anonymousPosts.map((p)=>(
        <Card key={p.id}>
          <div style={{ fontWeight:700 }}>{p.alias}</div>
          <div style={{ marginTop:10 }}>{p.text}</div>

          <div style={{ display:"flex", gap:8, marginTop:10 }}>
            {p.hashtags.map(tag=>(
              <div key={tag}
                style={{
                  background:"var(--green)",
                  color:"#fff",
                  padding:"4px 10px",
                  borderRadius:20,
                  fontSize:12,
                }}>
                {tag}
              </div>
            ))}
          </div>
        </Card>
      ))}
    </Container>
  );
}

/* ====================== */
/*     TRENDING TAGS      */
/* ====================== */

function TrendingHashtagsPage({ db }) {
  return (
    <Container>
      <h1>Trending</h1>

      <Card>
        {db.trends.map(t=>(
          <div key={t.tag} style={{ marginBottom:12 }}>
            <strong>{t.tag}</strong>
            <div style={{
              height:6, marginTop:6, background:"#eee", borderRadius:999
            }}>
              <div style={{
                height:"100%",
                width:`${Math.min(100,Math.abs(t.sentiment)*100)}%`,
                background: t.sentiment < 0 ? "var(--red)" : "var(--green)",
                borderRadius:999
              }}/>
            </div>
          </div>
        ))}
      </Card>
    </Container>
  );
}

/* ====================== */
/*     APPOINTMENTS       */
/* ====================== */

function AppointmentLogsPage({ db }) {
  return (
    <Container>
      <h1>Appointment Logs</h1>

      <Card>
        <table style={{ width:"100%", fontSize:14 }}>
          <thead>
            <tr>
              <th>Counsellor</th>
              <th>Student Alias</th>
              <th>Severity</th>
              <th>Date</th>
              <th>Time</th>
              <th>Mode</th>
            </tr>
          </thead>

          <tbody>
            {db.appointments.map((a,i)=>(
              <tr key={i}>
                <td>{a.counsellor}</td>
                <td>{a.alias}</td>
                <td style={{ color:a.severity==="Critical"?"var(--red)":"var(--orange)" }}>
                  {a.severity}
                </td>
                <td>{a.date}</td>
                <td>{a.time}</td>
                <td>{a.mode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Container>
  );
}

