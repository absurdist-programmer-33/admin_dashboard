// src/App.jsx — CHUNK 1
import React, { useEffect, useState, useMemo } from "react";
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
  PlusCircle,
  Edit3,
  Trash2,
  Send
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

/* ========== Fonts & Base CSS ========== */
function useInjectFontsAndBase() {
  useEffect(() => {
    if (document.getElementById("jec-fonts")) return;
    const link = document.createElement("link");
    link.id = "jec-fonts";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Roboto:wght@400;500&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.innerHTML = `
      :root{
        --brand-dark:#2C3E50;
        --green:#22C55E;
        --light-green:#86efac;
        --orange:#F59E0B;
        --red:#F87171;
        --bg:#F7F9FB;
        --card:#FFFFFF;
        --divider:#D0D5DD;
        --muted:#98A0A6;
      }
      body { margin:0; font-family: Roboto, sans-serif; background: var(--bg); color: var(--brand-dark); }
      h1,h2 { font-family: Poppins, sans-serif; color: var(--brand-dark); margin:0; }
      .kpi { font-weight:800; font-size:28px; }
      .label-sm { font-size:12px; color:var(--muted); }
    `;
    document.head.appendChild(style);
  }, []);
}

/* ========== UI helpers ========== */
const Container = ({ children }) => <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>{children}</div>;
const Card = ({ title, children, style = {} }) => (
  <div style={{ background: "var(--card)", border: "1px solid var(--divider)", borderRadius: 8, padding: 16, marginBottom: 16, boxShadow: "0 1px 6px rgba(12,18,28,0.04)", ...style }}>
    {title && <div style={{ marginBottom: 12, fontSize: 16, fontWeight: 600 }}>{title}</div>}
    {children}
  </div>
);
const Pill = ({ color = "var(--brand-dark)", children }) => <span style={{ background: `${color}20`, color, padding: "4px 8px", borderRadius: 8, fontWeight:700, fontSize:12 }}>{children}</span>;

const uid = (p = "") => p + Math.floor(1000 + Math.random() * 9000);

/* ========== initial in-memory DB ========== */
/* mood scale: -2 very sad, -1 sad, 0 neutral, +1 happy, +2 very happy */
const initialDB = {
  students: [
    { id: "STU001", alias: "ShadowTiger", gender: "Male", semester: 4, mood7: [-2,-1,0,1,0,-1,-2], moodMonth: [-1.6,-1.8,-1.4,-1.9], phq:21, gad:17 },
    { id: "STU002", alias: "SilentWolf", gender: "Male", semester: 6, mood7: [-1,-1,0,0,1,1,0], moodMonth: [-0.9,-1.0,-0.6,-0.8], phq:12, gad:9 },
    { id: "STU003", alias: "CalmSea", gender: "Female", semester: 2, mood7: [1,1,2,1,1,2,1], moodMonth: [1.0,1.2,1.1,1.3], phq:2, gad:1 },
    // add more as needed
  ],
  counsellors: [
    { id: "CNS1001", name: "Asha Verma", gender: "Female", status:"Active", appointments:5 },
    { id: "CNS1002", name: "Rohan Sen", gender: "Male", status:"Active", appointments:3 },
  ],
  anonymousPosts: [
    { id: 1, alias: "Anon1", text: "Exams are heavy.", hashtags:["#examStress"], time:"2h", reported:false },
    { id: 2, alias: "Anon2", text: "Sleepless nights.", hashtags:["#sleep"], time:"8h", reported:true },
  ],
  trends: [
    { tag:"#examStress", sentiment:-0.5 },
    { tag:"#sleep", sentiment:-0.2 },
  ],
  appointments: [
    { counsellor:"Asha Verma", alias:"ShadowTiger", severity:"Critical", date:"2025-11-22", time:"15:30", mode:"Call", status:"Completed" },
  ],
  notifications: [
    // { id, title, desc, date, time, audience, status: "Sent" | "Scheduled" }
  ],
};
// src/App.jsx — CHUNK 2

function Sidebar({ open }) {
  return (
    <aside style={{ position:"fixed", left:0, top:0, bottom:0, width: open ? 260 : 80, background:"var(--green)", color:"#fff", padding:20, transition:"width .2s", boxShadow:"0 6px 20px rgba(0,0,0,0.08)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
        <div style={{ width:46, height:46, background:"#fff", color:"var(--green)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800 }}>JEC</div>
        {open && <div style={{ fontWeight:800, fontSize:18 }}>ALL IZZ WELL</div>}
      </div>

      <nav style={{ display:"flex", flexDirection:"column", gap:10 }}>
        <Link to="/" style={navStyle}><LayoutDashboard size={18}/> {open && "Dashboard"}</Link>
        <Link to="/critical" style={navStyle}><ShieldAlert size={18}/> {open && "Critical Students"}</Link>
        <Link to="/analytics" style={navStyle}><Calendar size={18}/> {open && "Analytics"}</Link>
        <Link to="/posts" style={navStyle}><MessageSquare size={18}/> {open && "Anonymous Posts"}</Link>
        <Link to="/hashtags" style={navStyle}><Hash size={18}/> {open && "Trending"}</Link>
        <Link to="/appointments" style={navStyle}><Calendar size={18}/> {open && "Appointments"}</Link>
        <Link to="/counsellors" style={navStyle}><UserCog size={18}/> {open && "Counsellors"}</Link>
        <Link to="/notifications" style={navStyle}><Bell size={18}/> {open && "Notifications"}</Link>
      </nav>

      <div style={{ marginTop:"auto", fontSize:13, opacity:0.9 }}>
        IQAC Officer
      </div>
    </aside>
  );
}
const navStyle = { display:"flex", alignItems:"center", gap:12, padding:"10px 12px", borderRadius:8, color:"#fff", textDecoration:"none" };

function Header({ open, setOpen, db }) {
  const healthy = db.students.filter(s=>s.phq < 10 && s.gad < 8).length;
  const moderate = db.students.filter(s=> (s.phq>=10 && s.phq<20) || (s.gad>=8 && s.gad<15)).length;
  const critical = db.students.filter(s=> s.phq>=20 || s.gad>=15).length;

  return (
    <header style={{ padding:12, background:"var(--card)", borderBottom:"1px solid var(--divider)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={()=>setOpen(v=>!v)} style={{ padding:"6px 12px", borderRadius:8, background:"var(--green)", color:"#fff", border:"none", fontWeight:700 }}>{open ? "← Collapse" : "→ Open"}</button>

        <div style={{ fontWeight:700, fontSize:18 }}>JEC — ALL IZZ WELL Dashboard</div>

        <div style={{ display:"flex", gap:12, marginLeft:16 }}>
          <Card style={{ padding:"8px 12px" }}>
            <div className="label-sm">HEALTHY</div>
            <div className="kpi" style={{ color:"var(--green)" }}>{healthy}</div>
          </Card>

          <Card style={{ padding:"8px 12px" }}>
            <div className="label-sm">MODERATE</div>
            <div className="kpi" style={{ color:"var(--orange)" }}>{moderate}</div>
          </Card>

          <Card style={{ padding:"8px 12px" }}>
            <div className="label-sm">CRITICAL</div>
            <div className="kpi" style={{ color:"var(--red)" }}>{critical}</div>
          </Card>
        </div>
      </div>

      <div style={{ display:"flex", gap:12, alignItems:"center" }}>
        <Bell />
        <Search />
      </div>
    </header>
  );
}

/* ========== App root ========== */
export default function App() {
  useInjectFontsAndBase();
  const [db, setDb] = useState(() => JSON.parse(JSON.stringify(initialDB)));
  const [open, setOpen] = useState(true);
  const left = open ? 260 : 80;

  return (
    <Router>
      <Sidebar open={open} />
      <div style={{ marginLeft:left, transition:"margin-left .2s", minHeight:"100vh" }}>
        <Header open={open} setOpen={setOpen} db={db} />
        <main style={{ padding:20 }}>
          <Routes>
            <Route path="/" element={<MoodAnalyticsPage db={db} />} />
            <Route path="/analytics" element={<MoodAnalyticsPage db={db} />} />
            <Route path="/critical" element={<CriticalStudentsPage db={db} />} />
            <Route path="/posts" element={<AnonymousPostsPage db={db} setDb={setDb} />} />
            <Route path="/hashtags" element={<TrendingHashtagsPage db={db} />} />
            <Route path="/appointments" element={<AppointmentLogsPage db={db} />} />
            <Route path="/counsellors" element={<CounsellorListPage db={db} setDb={setDb} />} />
            <Route path="/counsellors/create" element={<CounsellorCreatePage db={db} setDb={setDb} />} />
            <Route path="/counsellors/:id" element={<CounsellorProfilePage db={db} />} />
            <Route path="/notifications" element={<NotificationsPage db={db} setDb={setDb} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
// src/App.jsx — CHUNK 3

/*  COUNSELLOR LIST */
function CounsellorListPage({ db, setDb }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const filtered = db.counsellors.filter(c => filter==="All" ? true : c.status===filter);

  const deactivate = (id) => setDb(prev=>({...prev, counsellors: prev.counsellors.map(c=> c.id===id?{...c,status:"Inactive"}:c)}));
  const activate = (id) => setDb(prev=>({...prev, counsellors: prev.counsellors.map(c=> c.id===id?{...c,status:"Active"}:c)}));

  return (
    <Container>
      <h1>Counsellors</h1>
      <div style={{ display:"flex", gap:12, margin:"12px 0" }}>
        <button onClick={()=>setFilter("All")} style={filterBtn}>All</button>
        <button onClick={()=>setFilter("Active")} style={filterBtn}>Active</button>
        <button onClick={()=>setFilter("Inactive")} style={filterBtn}>Inactive</button>
        <button onClick={()=>navigate("/counsellors/create")} style={{ marginLeft:"auto", background:"var(--green)", color:"#fff", padding:"8px 14px", borderRadius:8, border:"none" }}>
          + Add Counsellor
        </button>
      </div>

      <Card>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ borderBottom:"1px solid var(--divider)" }}>
              <th style={th}>ID</th><th style={th}>Name</th><th style={th}>Gender</th><th style={th}>Status</th><th style={th}>Appts</th><th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c=>(
              <tr key={c.id} style={{ borderBottom:"1px solid #f3f3f3" }}>
                <td style={td}>{c.id}</td>
                <td style={td}>{c.name}</td>
                <td style={td}>{c.gender}</td>
                <td style={td}><Pill color={c.status==="Active"?"var(--green)":"var(--muted)"}>{c.status}</Pill></td>
                <td style={td}>{c.appointments}</td>
                <td style={{...td, display:"flex", gap:8}}>
                  <button onClick={()=>navigate(`/counsellors/${c.id}`)} style={btn}><Edit3 size={14}/> View</button>
                  {c.status==="Active" ? <button onClick={()=>deactivate(c.id)} style={dangerBtn}><Trash2 size={14}/> Deactivate</button> : <button onClick={()=>activate(c.id)} style={greenBtn}>Activate</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Container>
  );
}

/*  COUNSELLOR CREATE */
function CounsellorCreatePage({ db, setDb }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:"", gender:"Male", password:"", confirm:"" });
  const submit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return alert("Passwords must match");
    const newC = { id: uid("CNS"), name: form.name, gender: form.gender, status:"Active", appointments:0 };
    setDb(prev=>({...prev, counsellors: [newC, ...prev.counsellors]}));
    navigate("/counsellors");
  };
  return (
    <Container>
      <h1>Create Counsellor</h1>
      <Card>
        <form onSubmit={submit} style={{ display:"grid", gap:12 }}>
          <div><div style={{fontSize:13, fontWeight:600}}>Name</div><input required onChange={e=>setForm({...form,name:e.target.value})} style={input}/></div>
          <div><div style={{fontSize:13, fontWeight:600}}>Gender</div><select onChange={e=>setForm({...form,gender:e.target.value})} style={input}><option>Male</option><option>Female</option><option>Other</option></select></div>
          <div style={{ display:"flex", gap:12 }}>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>Password</div><input type="password" required onChange={e=>setForm({...form,password:e.target.value})} style={input}/></div>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>Confirm</div><input type="password" required onChange={e=>setForm({...form,confirm:e.target.value})} style={input}/></div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button type="submit" style={submitBtn}>Create</button>
            <button type="button" onClick={()=>navigate("/counsellors")} style={cancelBtn}>Cancel</button>
          </div>
        </form>
      </Card>
    </Container>
  );
}

/*  COUNSELLOR PROFILE */
function CounsellorProfilePage({ db }) {
  const { id } = useParams();
  const c = db.counsellors.find(x=>x.id===id) || {};
  const criticalAssigned = db.appointments.filter(a=> a.counsellor===c.name && a.severity==="Critical").length;
  return (
    <Container>
      <h1>{c.name}</h1>
      <div style={{color:"var(--muted)"}}>ID: {c.id} • Gender: {c.gender}</div>

      <div style={{ marginTop:16 }}>
        <Card title="Activity Summary">
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <div><div className="label-sm">Appointments</div><div style={{fontWeight:700}}>{c.appointments}</div></div>
            <div><div className="label-sm">Critical Students</div><div style={{fontWeight:700,color:"var(--red)"}}>{criticalAssigned}</div></div>
          </div>
        </Card>
      </div>
    </Container>
  );
}

const filterBtn = { padding:"6px 12px", borderRadius:8, border:"1px solid var(--divider)", background:"#fff" };
const th = { padding:10, textAlign:"left" };
const td = { padding:10 };
const btn = { padding:"6px 10px", borderRadius:8, border:"1px solid var(--divider)" };
const dangerBtn = { ...btn, borderColor:"var(--red)", color:"var(--red)" };
const greenBtn = { ...btn, borderColor:"var(--green)", color:"var(--green)" };
const input = { width:"100%", padding:8, borderRadius:8, border:"1px solid var(--divider)" };
const submitBtn = { padding:"8px 14px", background:"var(--green)", color:"#fff", borderRadius:8, border:"none" };
const cancelBtn = { padding:"8px 14px", borderRadius:8, border:"1px solid var(--divider)", background:"#fff" };
// src/App.jsx — CHUNK 4

/*  CRITICAL STUDENTS */
function CriticalStudentsPage({ db }) {
  const critical = db.students.filter(s => s.phq>=20 || s.gad>=15);
  return (
    <Container>
      <h1>Critical Students</h1>
      <div style={{color:"var(--muted)", marginBottom:12}}>Students above severe thresholds</div>
      {critical.map(s=>(
        <Card key={s.id}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <div>
              <div style={{fontWeight:700}}>{s.alias}</div>
              <div style={{display:"flex", gap:20, marginTop:8}}>
                <div><div className="label-sm">PHQ-9</div><div style={{fontWeight:700,color:"var(--red)"}}>{s.phq}</div></div>
                <div><div className="label-sm">GAD-7</div><div style={{fontWeight:700,color:"var(--red)"}}>{s.gad}</div></div>
              </div>
            </div>

            <div style={{width:300}}>
              <ResponsiveContainer width="100%" height={80}>
                <LineChart data={s.mood7.map((v,i)=>({x:i+1,v}))}>
                  <Line dataKey="v" stroke="var(--brand-dark)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      ))}
    </Container>
  );
}

/*  APPOINTMENT LOGS */
function AppointmentLogsPage({ db }) {
  return (
    <Container>
      <h1>Appointment Logs</h1>
      <Card>
        <table style={{width:"100%"}}>
          <thead>
            <tr style={{borderBottom:"1px solid var(--divider)"}}>
              <th style={th}>Counsellor</th><th style={th}>Student Alias</th><th style={th}>Severity</th><th style={th}>Date</th><th style={th}>Time</th><th style={th}>Mode</th><th style={th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {db.appointments.map((a,i)=>(
              <tr key={i} style={{borderBottom:"1px solid #f3f3f3"}}>
                <td style={td}>{a.counsellor}</td>
                <td style={td}>{a.alias}</td>
                <td style={td}><span style={{color: a.severity==="Critical"?"var(--red)":"var(--orange)", fontWeight:700}}>{a.severity}</span></td>
                <td style={td}>{a.date}</td><td style={td}>{a.time}</td><td style={td}>{a.mode}</td><td style={td}>{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Container>
  );
}
// src/App.jsx — CHUNK 5

/*  MOOD ICONS helper */
function MoodIcon({ value }) {
  // value: -2,-1,0,1,2
  const mapping = {
    "-2": { label:"Very Sad", emoji:"😭", color:"var(--red)" },
    "-1": { label:"Sad", emoji:"☹️", color:"var(--orange)" },
    "0": { label:"Neutral", emoji:"😐", color:"#9CA3AF" },
    "1": { label:"Happy", emoji:"🙂", color:"var(--light-green)" },
    "2": { label:"Very Happy", emoji:"😄", color:"var(--green)" },
  };
  const m = mapping[String(value)];
  return <div style={{ display:"flex", alignItems:"center", gap:8 }}><div style={{fontSize:20}}>{m.emoji}</div><div style={{fontWeight:700, color:m.color}}>{m.label}</div></div>;
}

/*  MOOD ANALYTICS PAGE */
function MoodAnalyticsPage({ db }) {
  const [filters, setFilters] = useState({ gender: "All", semester: "All" });

  const genders = ["All", ...Array.from(new Set(db.students.map(s=>s.gender)))];
  const semesters = ["All", ...Array.from(new Set(db.students.map(s=>s.semester)))];

  const filtered = db.students.filter(s=>{
    if (filters.gender !== "All" && s.gender !== filters.gender) return false;
    if (filters.semester !== "All" && String(s.semester) !== String(filters.semester)) return false;
    return true;
  });

  // counts by mood value
  const moodCounts = useMemo(()=>{
    const map = { "-2":0, "-1":0, "0":0, "1":0, "2":0 };
    filtered.forEach(s=>{
      // assume student's latest day mood is last of mood7
      const latest = s.mood7 && s.mood7.length ? s.mood7[s.mood7.length-1] : 0;
      map[String(latest)] = (map[String(latest)]||0) + 1;
    });
    return map;
  }, [filtered]);

  // weekly trend (avg across filtered)
  const weekly = useMemo(()=>{
    const days = 7;
    const daysLabels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    const arr = Array.from({length:days}, (_,i)=> {
      const vals = filtered.map(s => (s.mood7 && (s.mood7[i]!==undefined) ? s.mood7[i] : 0));
      const avg = vals.length ? Number((vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(2)) : 0;
      return { day: daysLabels[i], mood: avg };
    });
    return arr;
  }, [filtered]);

  // monthly (4 week buckets)
  const monthly = useMemo(()=>{
    const weeks = 4;
    const arr = Array.from({length:weeks}, (_,i)=> {
      const vals = filtered.map(s => (s.moodMonth && (s.moodMonth[i]!==undefined) ? s.moodMonth[i] : 0));
      const avg = vals.length ? Number((vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(2)) : 0;
      return { week:`Wk${i+1}`, mood: avg };
    });
    return arr;
  }, [filtered]);

  // monthly stress buckets based on PHQ/GAD (example thresholds)
  const stressCounts = useMemo(()=>{
    let high=0, moderate=0, low=0;
    db.students.forEach(s=>{
      const phq = s.phq || 0, gad = s.gad || 0;
      const max = Math.max(phq, gad);
      if (max >= 20) high++;
      else if (max >= 10) moderate++;
      else low++;
    });
    return { high, moderate, low };
  }, [db.students]);

  // heatmap mock: rows = days (1..7), cols = weeks (1..4) -> compute avg stress value (-2..2)
  const heatmap = useMemo(()=>{
    // compute average absolute stress (using phq/gad) per day-week bucket — here we mock using moodMonth for demo
    const rows = 7; const cols = 4;
    const grid = [];
    for(let r=0;r<rows;r++){
      const row = [];
      for(let c=0;c<cols;c++){
        // average moodMonth[c] across students scaled to stress (invert mood)
        const vals = db.students.map(s => (s.mood7 && s.mood7[r]!==undefined ? -s.mood7[r] : 0)); // higher positive means more stress here (inversion)
        const avg = vals.length ? (vals.reduce((a,b)=>a+b,0)/vals.length) : 0;
        row.push(Number(avg.toFixed(2)));
      }
      grid.push(row);
    }
    return grid;
  }, [db.students]);

  const avgWeeklyMood = weekly.reduce((a,b)=>a+b.mood,0)/7;
  const lineColor = avgWeeklyMood <= -2.5 ? "var(--red)" : (avgWeeklyMood <= -1.5 ? "var(--orange)" : "var(--green)");

  return (
    <Container>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <h1 style={{ fontSize:28, fontWeight:700 }}>Analytics</h1>
          <div style={{ color:"var(--muted)", marginTop:6 }}>Student-entered mood summary & trends</div>
        </div>

        <div style={{ display:"flex", gap:12, alignItems:"center" }}>
          <div>
            <div className="label-sm">Gender</div>
            <select style={{padding:8,borderRadius:8,border:"1px solid var(--divider)"}} value={filters.gender} onChange={e=>setFilters({...filters, gender:e.target.value})}>
              {genders.map(g=> <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <div className="label-sm">Semester</div>
            <select style={{padding:8,borderRadius:8,border:"1px solid var(--divider)"}} value={filters.semester} onChange={e=>setFilters({...filters, semester:e.target.value})}>
              {semesters.map(s=> <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* mood counts */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginTop:16 }}>
        <Card>
          <div className="label-sm">Very Sad (-2)</div>
          <div style={{ fontWeight:800, fontSize:22, color:"var(--red)" }}>{moodCounts["-2"]||0}</div>
          <div style={{ marginTop:8 }}><span style={{fontSize:18}}>😭</span></div>
        </Card>

        <Card>
          <div className="label-sm">Sad (-1)</div>
          <div style={{ fontWeight:800, fontSize:22, color:"var(--orange)" }}>{moodCounts["-1"]||0}</div>
          <div style={{ marginTop:8 }}><span style={{fontSize:18}}>☹️</span></div>
        </Card>

        <Card>
          <div className="label-sm">Neutral (0)</div>
          <div style={{ fontWeight:800, fontSize:22, color:"#9CA3AF" }}>{moodCounts["0"]||0}</div>
          <div style={{ marginTop:8 }}><span style={{fontSize:18}}>😐</span></div>
        </Card>

        <Card>
          <div className="label-sm">Happy (+1)</div>
          <div style={{ fontWeight:800, fontSize:22, color:"var(--light-green)" }}>{moodCounts["1"]||0}</div>
          <div style={{ marginTop:8 }}><span style={{fontSize:18}}>🙂</span></div>
        </Card>

        <Card>
          <div className="label-sm">Very Happy (+2)</div>
          <div style={{ fontWeight:800, fontSize:22, color:"var(--green)" }}>{moodCounts["2"]||0}</div>
          <div style={{ marginTop:8 }}><span style={{fontSize:18}}>😄</span></div>
        </Card>
      </div>

      {/* weekly + monthly graphs */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 420px", gap:16, marginTop:16 }}>
        <Card title="Weekly Mood (avg)">
          <div style={{ width:"100%", height:220 }}>
            <ResponsiveContainer width="100%" height="100%"><LineChart data={weekly}><CartesianGrid stroke="#f3f3f3"/><XAxis dataKey="day"/><YAxis/><Tooltip/><Line dataKey="mood" stroke={lineColor} strokeWidth={3} dot/></LineChart></ResponsiveContainer>
          </div>
        </Card>

        <Card title="Monthly Mood (avg)">
          <div style={{ width:"100%", height:220 }}>
            <ResponsiveContainer width="100%" height="100%"><LineChart data={monthly}><CartesianGrid stroke="#f3f3f3"/><XAxis dataKey="week"/><YAxis/><Tooltip/><Line dataKey="mood" stroke={lineColor} strokeWidth={3} dot/></LineChart></ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* monthly stress section */}
      <div style={{ marginTop:16, display:"grid", gridTemplateColumns:"1fr 420px", gap:16 }}>
        <Card title="Monthly Stress Level (PHQ/GAD)">
          <div style={{ display:"flex", gap:12 }}>
            <div style={{ flex:1 }}>
              <div className="label-sm">High Stress</div>
              <div style={{ fontWeight:800, fontSize:22, color:"var(--red)" }}>{stressCounts.high}</div>
            </div>
            <div style={{ flex:1 }}>
              <div className="label-sm">Moderate Stress</div>
              <div style={{ fontWeight:800, fontSize:22, color:"var(--orange)" }}>{stressCounts.moderate}</div>
            </div>
            <div style={{ flex:1 }}>
              <div className="label-sm">Low Stress</div>
              <div style={{ fontWeight:800, fontSize:22, color:"var(--green)" }}>{stressCounts.low}</div>
            </div>
          </div>

          <div style={{ marginTop:12, color:"var(--muted)" }}>Based on PHQ-9 and GAD-7 inputs submitted by students.</div>
        </Card>

        <Card title="Stress Heatmap (days vs weeks)">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6 }}>
            {heatmap.map((row,rIdx)=>(
              <div key={rIdx} style={{ display:"flex", gap:6 }}>
                {row.map((cell,cIdx)=>{
                  // cell roughly -2..2 -> map to color intensity
                  const v = Math.max(-2, Math.min(2, cell));
                  const intensity = Math.abs(v)/2;
                  const bg = v > 0 ? `rgba(248,113,113,${intensity})` : `rgba(34,197,94,${intensity})`; // red for stress, green for calm (this inverts due to earlier logic)
                  return <div key={cIdx} style={{ width: "100%", height: 28, background:bg, borderRadius:6 }} title={`val ${v}`}></div>;
                })}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Container>
  );
}
// src/App.jsx — CHUNK 6

/*  ANONYMOUS POSTS (remove + reported toggle) */
function AnonymousPostsPage({ db, setDb }) {
  const removePost = (id) => setDb(prev => ({ ...prev, anonymousPosts: prev.anonymousPosts.filter(p=>p.id!==id) }));
  const toggleReported = (id) => setDb(prev => ({ ...prev, anonymousPosts: prev.anonymousPosts.map(p => p.id===id?{...p,reported:!p.reported}:p) }));

  return (
    <Container>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <h1>Anonymous Posts</h1>
        <div style={{ color:"var(--muted)" }}>{db.anonymousPosts.length} posts</div>
      </div>

      <div style={{ marginTop:12, display:"grid", gap:12 }}>
        {db.anonymousPosts.map(p=>(
          <Card key={p.id}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontWeight:700 }}>{p.alias}</div>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                {p.reported && <div title="Reported" style={{ background:"var(--red)", color:"#fff", borderRadius:20, padding:"4px 8px", fontWeight:800 }}>!</div>}
                <button onClick={()=>toggleReported(p.id)} style={{ padding:"6px 8px", borderRadius:8, border:"1px solid var(--divider)", background:"#fff" }}>{p.reported ? "Unmark" : "Report"}</button>
                <button onClick={()=>removePost(p.id)} style={{ padding:"6px 10px", borderRadius:8, border:"1px solid var(--red)", background:"#fff", color:"var(--red)", fontWeight:700 }}>Remove</button>
              </div>
            </div>
            <div style={{ marginTop:8 }}>{p.text}</div>
            <div style={{ marginTop:8, display:"flex", gap:8 }}>{(p.hashtags||[]).map(t=> <div key={t} style={{ background:"var(--green)", color:"#fff", padding:"4px 10px", borderRadius:20 }}>{t}</div>)}</div>
          </Card>
        ))}
        {db.anonymousPosts.length===0 && <Card><div style={{ color:"var(--muted)" }}>No anonymous posts</div></Card>}
      </div>
    </Container>
  );
}

/*  TRENDING TAGS */
function TrendingHashtagsPage({ db }) {
  return (
    <Container>
      <h1>Trending</h1>
      <Card>
        {db.trends.map(t=>(
          <div key={t.tag} style={{ marginBottom:12 }}>
            <strong>{t.tag}</strong>
            <div style={{ height:8, background:"#eee", borderRadius:999, marginTop:6 }}>
              <div style={{ height:"100%", width:`${Math.min(100, Math.abs(t.sentiment)*100)}%`, background: t.sentiment<0 ? "var(--red)" : "var(--green)", borderRadius:999 }} />
            </div>
          </div>
        ))}
      </Card>
    </Container>
  );
}

/*  NOTIFICATIONS (create / send / list) */
function NotificationsPage({ db, setDb }) {
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({ title:"", desc:"", date:"", time:"", audience:"All", gender:"All", semester:"All" });

  const send = (e) => {
    e.preventDefault();
    const id = uid("NTF");
    const payload = { id, title: form.title, desc: form.desc, date: form.date, time: form.time, audience: form.audience, gender: form.gender, semester: form.semester, status: (new Date(form.date + " " + form.time) > new Date()) ? "Scheduled" : "Sent" };
    setDb(prev=>({...prev, notifications: [payload, ...prev.notifications]}));
    setOpenModal(false);
    setForm({ title:"", desc:"", date:"", time:"", audience:"All", gender:"All", semester:"All" });
  };

  return (
    <Container>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <h1>Event Notifications</h1>
        <button onClick={()=>setOpenModal(true)} style={{ background:"var(--green)", color:"#fff", padding:"8px 14px", borderRadius:8, border:"none", display:"flex", gap:8, alignItems:"center" }}><PlusCircle /> Create Notification</button>
      </div>

      <Card>
        <table style={{ width:"100%" }}>
          <thead><tr style={{ borderBottom:"1px solid var(--divider)" }}><th style={th}>Title</th><th style={th}>Audience</th><th style={th}>Date</th><th style={th}>Time</th><th style={th}>Status</th><th style={th}>Actions</th></tr></thead>
          <tbody>
            {db.notifications.map(n=>(
              <tr key={n.id} style={{ borderBottom:"1px solid #f3f3f3" }}>
                <td style={td}>{n.title}</td>
                <td style={td}>{n.audience}</td>
                <td style={td}>{n.date}</td>
                <td style={td}>{n.time}</td>
                <td style={td}>{n.status}</td>
                <td style={td}>
                  <button style={btn} onClick={()=>{ const copy = {...n, id: uid("NTF")}; setDb(prev=>({...prev, notifications: [copy, ...prev.notifications]})); }}>Duplicate</button>
                  <button style={{...btn, marginLeft:8}} onClick={()=> setDb(prev=>({...prev, notifications: prev.notifications.filter(x=>x.id!==n.id)}))}><Trash2 size={14}/> Delete</button>
                </td>
              </tr>
            ))}
            {db.notifications.length===0 && <tr><td style={{padding:12}} colSpan={6}><div style={{color:"var(--muted)"}}>No notifications yet</div></td></tr>}
          </tbody>
        </table>
      </Card>

      {/* modal */}
      {openModal && (
        <div style={{ position:"fixed", left:0, top:0, right:0, bottom:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ width:720, background:"#fff", borderRadius:10, padding:20 }}>
            <h2 style={{ marginBottom:8 }}>Create Notification</h2>
            <form onSubmit={send} style={{ display:"grid", gap:12 }}>
              <div>
                <div style={{ fontSize:13, fontWeight:600 }}>Title</div>
                <input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={input}/>
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:600 }}>Description</div>
                <textarea required value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} style={{...input, height:100}}/>
              </div>

              <div style={{ display:"flex", gap:12 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600 }}>Date</div>
                  <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={input} required />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600 }}>Time</div>
                  <input type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} style={input} required />
                </div>
              </div>

              <div style={{ display:"flex", gap:12 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600 }}>Target Audience</div>
                  <select value={form.audience} onChange={e=>setForm({...form,audience:e.target.value})} style={input}>
                    <option>All Students</option>
                    <option>Filtered</option>
                  </select>
                </div>

                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600 }}>Gender</div>
                  <select value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})} style={input}>
                    <option>All</option><option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>

                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600 }}>Semester</div>
                  <select value={form.semester} onChange={e=>setForm({...form,semester:e.target.value})} style={input}>
                    <option>All</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option>
                  </select>
                </div>
              </div>

              <div style={{ display:"flex", gap:12, justifyContent:"flex-end", marginTop:12 }}>
                <button type="button" onClick={()=>setOpenModal(false)} style={cancelBtn}>Cancel</button>
                <button type="submit" style={{ ...submitBtn, display:"flex", gap:8, alignItems:"center" }}><Send /> Send Notification</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Container>
  );
}
