// App.jsx — CHUNK 1

import React, { useState, useMemo, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams
} from "react-router-dom";

import {
  LayoutDashboard,
  UserCog,
  ShieldAlert,
  MessageSquare,
  Hash,
  Calendar,
  Bell,
  Search,
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
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

// Inject Fonts + Base CSS
function useInjectFonts() {
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
      :root {
        --brand-dark:#2C3E50;
        --green:#22C55E;
        --light-green:#86EFAC;
        --red:#F87171;
        --orange:#F59E0B;
        --card:#FFFFFF;
        --divider:#D0D5DD;
        --muted:#98A0A6;
        --bg:#F7F9FB;
      }
      body {
        margin: 0;
        background: var(--bg);
        font-family: Roboto, sans-serif;
        color: var(--brand-dark);
      }
      h1,h2 { font-family: Poppins, sans-serif; margin:0; }
      .kpi { font-weight:800; font-size:32px; }
      .label-sm { font-size:12px; color:var(--muted); }
    `;
    document.head.appendChild(style);
  }, []);
}

// UI helpers
const Container = ({ children }) => (
  <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>{children}</div>
);

const Card = ({ title, children, style = {} }) => (
  <div
    style={{
      background: "var(--card)",
      borderRadius: 8,
      padding: 16,
      border: "1px solid var(--divider)",
      marginBottom: 18,
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      ...style
    }}
  >
    {title && <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>{title}</div>}
    {children}
  </div>
);

const uid = (p = "") => p + Math.floor(1000 + Math.random() * 9000);

// Initial DB — simplified + production safe
const initialDB = {
  students: [
    { id: "S1", alias: "ShadowTiger", gender: "Male", semester: 4, mood7: [-2,-1,0,1,0,-1,-2], moodMonth: [-1.4,-1.6,-1.2,-1.7], phq:21, gad:17 },
    { id: "S2", alias: "SilentWolf", gender: "Male", semester: 6, mood7: [-1,-1,0,1,1,0,-1], moodMonth: [-0.8,-0.9,-0.6,-1.0], phq:13, gad:10 },
    { id: "S3", alias: "CalmSea", gender: "Female", semester: 2, mood7: [1,1,2,1,2,1,1], moodMonth: [1.0,1.2,1.1,1.3], phq:2, gad:1 }
  ],
  counsellors: [
    { id:"CNS101", name:"Asha Verma", gender:"Female", status:"Active", appointments:4 },
    { id:"CNS102", name:"Rohan Sen", gender:"Male", status:"Active", appointments:2 }
  ],
  anonymousPosts: [
    { id:1, alias:"Anon1", text:"Exams stressing me out", hashtags:["#examStress"], reported:false },
    { id:2, alias:"Anon2", text:"Not sleeping properly", hashtags:["#sleep"], reported:true }
  ],
  trends: [
    { tag:"#examStress", sentiment:-0.5 },
    { tag:"#sleep", sentiment:-0.2 }
  ],
  appointments: [
    { counsellor:"Asha Verma", alias:"ShadowTiger", severity:"Critical", date:"2025-10-10", time:"15:30", mode:"Call" }
  ],
  notifications:[]
};
// App.jsx — CHUNK 2

const navStyle = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  color: "#fff",
  textDecoration: "none",
  padding: "10px 12px",
  borderRadius: 8
};

function Sidebar({ open }) {
  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        width: open ? 260 : 80,
        background: "var(--green)",
        padding: 20,
        color: "#fff",
        transition: "0.2s"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 30 }}>
        <div
          style={{
            width: 46,
            height: 46,
            background: "#fff",
            color: "var(--green)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800
          }}
        >
          JEC
        </div>
        {open && <div style={{ fontWeight: 800, fontSize: 18 }}>ALL IZZ WELL</div>}
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Link to="/" style={navStyle}><LayoutDashboard size={18}/> {open && "Dashboard"}</Link>
        <Link to="/student-care" style={navStyle}><ShieldAlert size={18}/> {open && "Student Care"}</Link>
        <Link to="/community" style={navStyle}><MessageSquare size={18}/> {open && "Community Insights"}</Link>
        <Link to="/counsellors" style={navStyle}><UserCog size={18}/> {open && "Counsellors"}</Link>
        <Link to="/notifications" style={navStyle}><Bell size={18}/> {open && "Notifications"}</Link>
      </nav>
    </aside>
  );
}

function Header({ open, setOpen, db }) {
  const healthy = db.students.filter(s=>s.phq < 10 && s.gad < 8).length;
  const moderate = db.students.filter(s=> (s.phq>=10 && s.phq<20) || (s.gad>=8 && s.gad<15)).length;
  const critical = db.students.filter(s=> s.phq>=20 || s.gad>=15).length;

  return (
    <header
      style={{
        height: 70,
        background: "var(--card)",
        borderBottom: "1px solid var(--divider)",
        padding: "0 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}
    >
      <div style={{ display:"flex", alignItems:"center", gap:15 }}>
        <button
          onClick={() => setOpen(v=>!v)}
          style={{
            padding: "6px 12px",
            background: "var(--green)",
            color: "#fff",
            borderRadius: 8,
            border: "none",
            fontWeight: 700
          }}
        >
          {open ? "← Collapse" : "→ Open"}
        </button>

        <div style={{ fontWeight: 700, fontSize: 18 }}>JEC – ALL IZZ WELL</div>

        <div style={{ display: "flex", gap: 12 }}>
          <Card><div className="label-sm">HEALTHY</div><div className="kpi" style={{color:"var(--green)"}}>{healthy}</div></Card>
          <Card><div className="label-sm">MODERATE</div><div className="kpi" style={{color:"var(--orange)"}}>{moderate}</div></Card>
          <Card><div className="label-sm">CRITICAL</div><div className="kpi" style={{color:"var(--red)"}}>{critical}</div></Card>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Search />
        <Bell />
      </div>
    </header>
  );
}

export default function App() {
  useInjectFonts();
  const [db, setDb] = useState(JSON.parse(JSON.stringify(initialDB)));
  const [open, setOpen] = useState(true);
  const left = open ? 260 : 80;

  return (
    <Router>
      <Sidebar open={open}/>
      <div style={{ marginLeft: left, transition:"0.2s" }}>
        <Header open={open} setOpen={setOpen} db={db}/>
        <main style={{ padding: 20 }}>
          <Routes>
            <Route path="/" element={<DashboardPage db={db}/>}/>
            <Route path="/student-care" element={<StudentCarePage db={db}/>}/>
            <Route path="/community" element={<CommunityInsightsPage db={db} setDb={setDb}/>}/>
            <Route path="/counsellors" element={<CounsellorListPage db={db} setDb={setDb}/>}/>
            <Route path="/counsellors/create" element={<CounsellorCreatePage db={db} setDb={setDb}/>}/>
            <Route path="/counsellors/:id" element={<CounsellorProfilePage db={db}/>}/>
            <Route path="/notifications" element={<NotificationsPage db={db} setDb={setDb}/>}/>
          </Routes>
        </main>
      </div>
    </Router>
  );
}
// App.jsx — CHUNK 3

function DashboardPage({ db }) {
  const [filters, setFilters] = useState({ gender:"All", semester:"All" });

  const genders = ["All", ...new Set(db.students.map(s=>s.gender))];
  const semesters = ["All", ...new Set(db.students.map(s=>s.semester))];

  const filtered = db.students.filter(s=>{
    if (filters.gender !== "All" && s.gender !== filters.gender) return false;
    if (filters.semester !== "All" && String(s.semester) !== String(filters.semester)) return false;
    return true;
  });

  const moodCounts = useMemo(()=>{
    const map = { "-2":0, "-1":0, "0":0, "1":0, "2":0 };
    filtered.forEach(s=>{
      const latest = s.mood7[s.mood7.length-1] ?? 0;
      map[String(latest)]++;
    });
    return map;
  }, [filtered]);

  const weekly = useMemo(()=>{
    return Array.from({length:7}, (_,i)=>{
      const moods = filtered.map(s => s.mood7[i] ?? 0);
      const avg = moods.length ? +(moods.reduce((a,b)=>a+b,0)/moods.length).toFixed(2) : 0;
      return { day:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i], mood:avg }
    });
  }, [filtered]);

  const monthly = useMemo(()=>{
    return Array.from({length:4}, (_,i)=>{
      const moods = filtered.map(s => s.moodMonth[i] ?? 0);
      const avg = moods.length ? +(moods.reduce((a,b)=>a+b,0)/moods.length).toFixed(2) : 0;
      return { week:`W${i+1}`, mood:avg }
    });
  }, [filtered]);

  return (
    <Container>
      <h1>Mood Analytics</h1>
      <div style={{ display:"flex", gap:14, marginTop:12 }}>
        <div>
          <div className="label-sm">Gender</div>
          <select style={input} value={filters.gender} onChange={e=>setFilters({...filters, gender:e.target.value})}>
            {genders.map(g=><option key={g}>{g}</option>)}
          </select>
        </div>

        <div>
          <div className="label-sm">Semester</div>
          <select style={input} value={filters.semester} onChange={e=>setFilters({...filters, semester:e.target.value})}>
            {semesters.map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Mood counts */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginTop:20 }}>
        <Card><div className="label-sm">Very Sad (-2)</div><div className="kpi" style={{color:"var(--red)"}}>{moodCounts["-2"]}</div><div>😭</div></Card>
        <Card><div className="label-sm">Sad (-1)</div><div className="kpi" style={{color:"var(--orange)"}}>{moodCounts["-1"]}</div><div>☹️</div></Card>
        <Card><div className="label-sm">Neutral (0)</div><div className="kpi" style={{color:"#9CA3AF"}}>{moodCounts["0"]}</div><div>😐</div></Card>
        <Card><div className="label-sm">Happy (+1)</div><div className="kpi" style={{color:"var(--light-green)"}}>{moodCounts["1"]}</div><div>🙂</div></Card>
        <Card><div className="label-sm">Very Happy (+2)</div><div className="kpi" style={{color:"var(--green)"}}>{moodCounts["2"]}</div><div>😄</div></Card>
      </div>

      {/* Weekly + Monthly */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 400px", gap:16, marginTop:20 }}>
        <Card title="Weekly Mood (Avg)">
          <div style={{ width:"100%", height:220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weekly}>
                <CartesianGrid stroke="#eee"/>
                <XAxis dataKey="day"/>
                <YAxis/>
                <Tooltip/>
                <Line dataKey="mood" stroke="var(--green)" strokeWidth={3} dot/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Monthly Mood (Avg)">
          <div style={{ width:"100%", height:220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly}>
                <CartesianGrid stroke="#eee"/>
                <XAxis dataKey="week"/>
                <YAxis/>
                <Tooltip/>
                <Line dataKey="mood" stroke="var(--green)" strokeWidth={3} dot/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </Container>
  );
}

// Reusable input style
const input = { padding:8, borderRadius:8, border:"1px solid var(--divider)", width:140 };
// App.jsx — CHUNK 4

function StudentCarePage({ db }) {
  const critical = db.students.filter(s=>s.phq>=20 || s.gad>=15);

  return (
    <Container>
      <h1>Student Care</h1>
      <div style={{ color:"var(--muted)", marginBottom:16 }}>Critical students + appointments</div>

      {/* Critical Students */}
      <Card title="Critical Students">
        {critical.map(s=>(
          <Card key={s.id}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <strong>{s.alias}</strong>
                <div style={{ display:"flex", gap:20, marginTop:8 }}>
                  <div><div className="label-sm">PHQ-9</div><div style={{fontWeight:700,color:"var(--red)"}}>{s.phq}</div></div>
                  <div><div className="label-sm">GAD-7</div><div style={{fontWeight:700,color:"var(--red)"}}>{s.gad}</div></div>
                </div>
              </div>

              <div style={{ width:260 }}>
                <ResponsiveContainer width="100%" height={70}>
                  <LineChart data={s.mood7.map((v,i)=>({x:i+1,v}))}>
                    <Line dataKey="v" stroke="var(--brand-dark)" strokeWidth={2} dot={false}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        ))}
      </Card>

      {/* Appointments */}
      <Card title="Appointments for Critical Students">
        <table style={{ width:"100%" }}>
          <thead>
            <tr style={{ borderBottom:"1px solid var(--divider)" }}>
              <th style={th}>Counsellor</th>
              <th style={th}>Alias</th>
              <th style={th}>Severity</th>
              <th style={th}>Date</th>
              <th style={th}>Time</th>
              <th style={th}>Mode</th>
            </tr>
          </thead>
          <tbody>
            {db.appointments
              .filter(a=>a.severity==="Critical")
              .map((a,i)=>(
                <tr key={i} style={{ borderBottom:"1px solid #eee" }}>
                  <td style={td}>{a.counsellor}</td>
                  <td style={td}>{a.alias}</td>
                  <td style={{ ...td, color:"var(--red)", fontWeight:700 }}>Critical</td>
                  <td style={td}>{a.date}</td>
                  <td style={td}>{a.time}</td>
                  <td style={td}>{a.mode}</td>
                </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Container>
  );
}

const th = { padding:10, textAlign:"left" };
const td = { padding:10 };
// App.jsx — CHUNK 5

function CommunityInsightsPage({ db, setDb }) {
  const removePost = id =>
    setDb(prev => ({ ...prev, anonymousPosts: prev.anonymousPosts.filter(p=>p.id!==id) }));

  const toggleReported = id =>
    setDb(prev => ({
      ...prev,
      anonymousPosts: prev.anonymousPosts.map(p =>
        p.id===id ? { ...p, reported:!p.reported } : p
      )
    }));

  return (
    <Container>
      <h1>Community Insights</h1>
      <div style={{ color:"var(--muted)", marginBottom:20 }}>Anonymous posts + trending hashtags</div>

      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:16 }}>

        {/* Posts */}
        <Card title="Anonymous Posts">
          {db.anonymousPosts.map(p=>(
            <Card key={p.id}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <strong>{p.alias}</strong>
                <div style={{ display:"flex", gap:8 }}>
                  {p.reported && (
                    <div style={{ background:"var(--red)", color:"#fff", padding:"2px 8px", borderRadius:6 }}>!</div>
                  )}
                  <button onClick={()=>toggleReported(p.id)} style={smallBtn}>
                    {p.reported ? "Unmark" : "Report"}
                  </button>
                  <button onClick={()=>removePost(p.id)} style={dangerBtn}>Remove</button>
                </div>
              </div>

              <div style={{ marginTop:8 }}>{p.text}</div>

              <div style={{ marginTop:8, display:"flex", gap:8 }}>
                {(p.hashtags||[]).map(t=>(
                  <div key={t} style={{ background:"var(--green)", color:"#fff", padding:"4px 10px", borderRadius:20 }}>{t}</div>
                ))}
              </div>
            </Card>
          ))}
        </Card>

        {/* Trending */}
        <Card title="Trending Hashtags">
          {db.trends.map(t=>(
            <div key={t.tag} style={{ marginBottom:14 }}>
              <strong>{t.tag}</strong>
              <div style={{ height:8, background:"#eee", borderRadius:999, marginTop:6 }}>
                <div
                  style={{
                    height:"100%",
                    width:`${Math.abs(t.sentiment)*100}%`,
                    background: t.sentiment<0 ? "var(--red)" : "var(--green)",
                    borderRadius:999
                  }}
                />
              </div>
            </div>
          ))}
        </Card>

      </div>
    </Container>
  );
}

const smallBtn = { padding:"6px 8px", borderRadius:8, border:"1px solid var(--divider)", background:"#fff" };
const dangerBtn = { padding:"6px 10px", borderRadius:8, border:"1px solid var(--red)", color:"var(--red)", background:"#fff" };
// App.jsx — CHUNK 6

function CounsellorListPage({ db, setDb }) {
  const navigate = useNavigate();
  const deactivate = id =>
    setDb(prev => ({
      ...prev,
      counsellors: prev.counsellors.map(c => c.id===id ? {...c, status:"Inactive"} : c)
    }));

  return (
    <Container>
      <h1>Counsellors</h1>

      <button
        style={{ background:"var(--green)", color:"#fff", padding:"8px 14px", borderRadius:8, border:"none", marginBottom:16 }}
        onClick={()=>navigate("/counsellors/create")}
      >
        + Add Counsellor
      </button>

      <Card>
        <table style={{ width:"100%" }}>
          <thead>
            <tr style={{ borderBottom:"1px solid var(--divider)" }}>
              <th style={th}>ID</th>
              <th style={th}>Name</th>
              <th style={th}>Gender</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {db.counsellors.map(c=>(
              <tr key={c.id} style={{ borderBottom:"1px solid #eee" }}>
                <td style={td}>{c.id}</td>
                <td style={td}>{c.name}</td>
                <td style={td}>{c.gender}</td>
                <td style={td}>
                  <span style={{ color: c.status==="Active" ? "var(--green)" : "var(--muted)", fontWeight:700 }}>
                    {c.status}
                  </span>
                </td>
                <td style={{ ...td, display:"flex", gap:10 }}>
                  <button style={smallBtn} onClick={()=>navigate(`/counsellors/${c.id}`)}><Edit3 size={14}/> View</button>
                  {c.status==="Active" && (
                    <button style={dangerBtn} onClick={()=>deactivate(c.id)}><Trash2 size={14}/> Deactivate</button>
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

function CounsellorCreatePage({ db, setDb }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:"", gender:"Male", password:"", confirm:"" });

  const submit = e => {
    e.preventDefault();
    if (form.password !== form.confirm) return alert("Passwords must match");

    const newC = {
      id: uid("CNS"),
      name: form.name,
      gender: form.gender,
      status: "Active"
    };

    setDb(prev => ({ ...prev, counsellors: [newC, ...prev.counsellors] }));
    navigate("/counsellors");
  };

  return (
    <Container>
      <h1>Create Counsellor</h1>
      <Card>
        <form onSubmit={submit} style={{ display:"grid", gap:12 }}>
          <input required placeholder="Name" style={input} onChange={e=>setForm({...form,name:e.target.value})}/>
          <select style={input} onChange={e=>setForm({...form,gender:e.target.value})}>
            <option>Male</option><option>Female</option><option>Other</option>
          </select>

          <input type="password" required placeholder="Password" style={input}
            onChange={e=>setForm({...form,password:e.target.value})}/>

          <input type="password" required placeholder="Confirm" style={input}
            onChange={e=>setForm({...form,confirm:e.target.value})}/>

          <button style={{ background:"var(--green)", color:"#fff", border:"none", padding:10, borderRadius:8 }}>Create</button>
        </form>
      </Card>
    </Container>
  );
}

function CounsellorProfilePage({ db }) {
  const { id } = useParams();
  const c = db.counsellors.find(x=>x.id===id);

  if (!c) return <Container><h1>Not Found</h1></Container>;

  return (
    <Container>
      <h1>{c.name}</h1>
      <div>ID: {c.id} • Gender: {c.gender}</div>

      <Card title="Activity Summary">
        <div className="label-sm">Appointments</div>
        <div className="kpi">{c.appointments}</div>
      </Card>
    </Container>
  );
}

function NotificationsPage({ db, setDb }) {
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({ title:"", desc:"", date:"", time:"", audience:"All" });

  const send = e => {
    e.preventDefault();
    const payload = {
      id: uid("NTF"),
      ...form,
      status: "Sent"
    };
    setDb(prev => ({ ...prev, notifications: [payload, ...prev.notifications] }));
    setOpenModal(false);
    setForm({ title:"", desc:"", date:"", time:"", audience:"All" });
  };

  return (
    <Container>
      <h1>Notifications</h1>

      <button onClick={()=>setOpenModal(true)}
        style={{ background:"var(--green)", color:"#fff", padding:"8px 14px", borderRadius:8, border:"none", marginBottom:16 }}>
        <PlusCircle size={18}/> Create Notification
      </button>

      <Card>
        <table style={{ width:"100%" }}>
          <thead>
            <tr style={{ borderBottom:"1px solid var(--divider)" }}>
              <th style={th}>Title</th>
              <th style={th}>Audience</th>
              <th style={th}>Date</th>
              <th style={th}>Time</th>
            </tr>
          </thead>

          <tbody>
            {db.notifications.map(n=>(
              <tr key={n.id} style={{ borderBottom:"1px solid #eee" }}>
                <td style={td}>{n.title}</td>
                <td style={td}>{n.audience}</td>
                <td style={td}>{n.date}</td>
                <td style={td}>{n.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Modal */}
      {openModal && (
        <div style={{
          position:"fixed", left:0, top:0, right:0, bottom:0,
          background:"rgba(0,0,0,0.35)", display:"flex",
          alignItems:"center", justifyContent:"center"
        }}>
          <div style={{ width:500, background:"#fff", borderRadius:10, padding:20 }}>
            <h2>Create Notification</h2>
            <form onSubmit={send} style={{ display:"grid", gap:12 }}>
              <input required placeholder="Title" style={input}
                onChange={e=>setForm({...form,title:e.target.value})}/>

              <textarea required placeholder="Description"
                style={{...input, height:100}}
                onChange={e=>setForm({...form,desc:e.target.value})}/>

              <input type="date" required style={input}
                onChange={e=>setForm({...form,date:e.target.value})}/>
              <input type="time" required style={input}
                onChange={e=>setForm({...form,time:e.target.value})}/>

              <select style={input}
                onChange={e=>setForm({...form,audience:e.target.value})}>
                <option>All</option>
                <option>Male</option>
                <option>Female</option>
              </select>

              <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
                <button type="button" onClick={()=>setOpenModal(false)} style={smallBtn}>Cancel</button>
                <button type="submit" style={{ background:"var(--green)", color:"#fff", border:"none", padding:"8px 12px", borderRadius:8 }}>
                  <Send size={16}/> Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Container>
  );
}
