import { useState, useEffect } from "react";

const ADMIN_PIN = "1234";

// ---- Supabase config ----
const SUPABASE_URL = "https://iaywfctwtyirzalfifzr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlheXdmY3R3dHlpcnphbGZpZnpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NjQxNjYsImV4cCI6MjA5MTI0MDE2Nn0.heFUKae5-k6fgPcK-xYXUw-1QBuRA_xF5LKymWr19g4";

const SB_HEADERS = {
  "Content-Type": "application/json",
  "apikey": SUPABASE_ANON_KEY,
  "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
};

async function loadData() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/league_data?id=eq.main&select=data`,
      { headers: SB_HEADERS }
    );
    const rows = await res.json();
    if (rows && rows.length > 0 && Object.keys(rows[0].data).length > 0) {
      return rows[0].data;
    }
    return null;
  } catch (e) {
    console.error("Load error:", e);
    return null;
  }
}

async function saveData(d) {
  try {
    await fetch(
      `${SUPABASE_URL}/rest/v1/league_data?id=eq.main`,
      {
        method: "PATCH",
        headers: SB_HEADERS,
        body: JSON.stringify({ data: d, updated_at: new Date().toISOString() }),
      }
    );
  } catch (e) {
    console.error("Save error:", e);
  }
}

const DEFAULT_TEAMS = [
  { id: "tA", name: "Team A", color: "#16a34a" },
  { id: "tB", name: "Team B", color: "#2563eb" },
  { id: "tC", name: "Team C", color: "#dc2626" },
];

const DEFAULT_PLAYERS = [
  { id: "pPayton",  name: "Payton",  teamId: "tA", handicap: 9  },
  { id: "pJordan",  name: "Jordan",  teamId: "tA", handicap: 16 },
  { id: "pCole",    name: "Cole",    teamId: "tA", handicap: 19 },
  { id: "pKaden",   name: "Kaden",   teamId: "tA", handicap: 27 },
  { id: "pSpencer", name: "Spencer", teamId: "tB", handicap: 10 },
  { id: "pJosh",    name: "Josh",    teamId: "tB", handicap: 13 },
  { id: "pJaxon",   name: "Jaxon",   teamId: "tB", handicap: 20 },
  { id: "pAustin",  name: "Austin",  teamId: "tB", handicap: 24 },
  { id: "pTanner",  name: "Tanner",  teamId: "tC", handicap: 6  },
  { id: "pCaden",   name: "Caden",   teamId: "tC", handicap: 18 },
  { id: "pBraden",  name: "Braden",  teamId: "tC", handicap: 25 },
  { id: "pAlex",    name: "Alex",    teamId: "tC", handicap: 32 },
];

const SCHEDULE = [
  { number: 1, type: "standard",
    foursomes: [
      { teamA: "tA", teamB: "tC", front: ["pCole","pJordan","pTanner","pCaden"],      back: [["pCole","pTanner"],    ["pJordan","pCaden"]]  },
      { teamA: "tB", teamB: "tC", front: ["pJaxon","pAustin","pBraden","pAlex"],      back: [["pJaxon","pBraden"],   ["pAustin","pAlex"]]   },
      { teamA: "tA", teamB: "tB", front: ["pKaden","pPayton","pJosh","pSpencer"],      back: [["pKaden","pJosh"],     ["pPayton","pSpencer"]] },
    ]
  },
  { number: 2, type: "standard",
    foursomes: [
      { teamA: "tA", teamB: "tB", front: ["pJordan","pKaden","pJosh","pJaxon"],        back: [["pJordan","pJosh"],    ["pKaden","pJaxon"]]   },
      { teamA: "tA", teamB: "tC", front: ["pPayton","pCole","pCaden","pAlex"],          back: [["pPayton","pCaden"],   ["pCole","pAlex"]]     },
      { teamA: "tB", teamB: "tC", front: ["pSpencer","pAustin","pTanner","pBraden"],   back: [["pSpencer","pTanner"], ["pAustin","pBraden"]] },
    ]
  },
  { number: 3, type: "standard",
    foursomes: [
      { teamA: "tA", teamB: "tB", front: ["pPayton","pJordan","pSpencer","pJaxon"],    back: [["pPayton","pJaxon"],   ["pJordan","pSpencer"]] },
      { teamA: "tA", teamB: "tC", front: ["pCole","pKaden","pCaden","pBraden"],         back: [["pCole","pCaden"],     ["pKaden","pBraden"]]  },
      { teamA: "tB", teamB: "tC", front: ["pJosh","pAustin","pTanner","pAlex"],         back: [["pJosh","pAlex"],      ["pAustin","pTanner"]] },
    ]
  },
  { number: 4, type: "scramble5" },
  { number: 5, type: "standard",
    foursomes: [
      { teamA: "tA", teamB: "tC", front: ["pPayton","pKaden","pBraden","pAlex"],        back: [["pPayton","pBraden"],  ["pKaden","pAlex"]]    },
      { teamA: "tA", teamB: "tB", front: ["pJordan","pCole","pJaxon","pAustin"],         back: [["pJordan","pJaxon"],   ["pCole","pAustin"]]   },
      { teamA: "tB", teamB: "tC", front: ["pSpencer","pJosh","pTanner","pCaden"],        back: [["pSpencer","pCaden"],  ["pJosh","pTanner"]]   },
    ]
  },
  { number: 6, type: "standard",
    foursomes: [
      { teamA: "tA", teamB: "tC", front: ["pPayton","pJordan","pTanner","pBraden"],     back: [["pPayton","pTanner"],  ["pJordan","pBraden"]] },
      { teamA: "tA", teamB: "tB", front: ["pCole","pKaden","pSpencer","pAustin"],        back: [["pCole","pSpencer"],   ["pKaden","pAustin"]]  },
      { teamA: "tB", teamB: "tC", front: ["pJosh","pJaxon","pCaden","pAlex"],            back: [["pJosh","pCaden"],     ["pJaxon","pAlex"]]    },
    ]
  },
];

const FORMATS = ["Scramble", "Best Ball", "Alt Shot", "Match Play"];

function back9Strokes(p1hcp, p2hcp) {
  return Math.round(Math.abs(p1hcp - p2hcp) / 2);
}

function front9Strokes(format, t1players, t2players) {
  const t1hcps = t1players.map(p => p.handicap);
  const t2hcps = t2players.map(p => p.handicap);
  if (format === "Scramble") {
    const teamHcp = hcps => { const s = [...hcps].sort((a,b)=>a-b); return s[0]*0.5+(s[1]??s[0])*0.25; };
    const t1 = teamHcp(t1hcps), t2 = teamHcp(t2hcps);
    return { lower: t1<=t2?"team1":"team2", strokes: Math.round(Math.abs(t1-t2)/2) };
  }
  if (format === "Best Ball") {
    const minHcp = Math.min(...t1hcps, ...t2hcps);
    const adj = hcp => Math.round((hcp-minHcp)*0.9/2);
    return { team1: t1hcps.map(adj), team2: t2hcps.map(adj), mode: "bestball" };
  }
  if (format === "Alt Shot" || format === "Match Play") {
    const t1t = t1hcps.reduce((a,b)=>a+b,0), t2t = t2hcps.reduce((a,b)=>a+b,0);
    return { lower: t1t<=t2t?"team1":"team2", strokes: Math.round(Math.abs(t1t-t2t)/2) };
  }
  return null;
}

function computeStandings(teams, players, rounds) {
  const teamPts = Object.fromEntries(teams.map(t=>[t.id,0]));
  const playerPts = Object.fromEntries(players.map(p=>[p.id,0]));
  rounds.forEach(round => {
    if (!round.completed) return;
    if (round.type === "scramble5") {
      if (round.winner) {
        teamPts[round.winner] = (teamPts[round.winner]||0) + 5;
        (round.winnerPlayers||[]).forEach(pid => playerPts[pid] = (playerPts[pid]||0) + 2.5);
      } else if (round.tieScramble) {
        (round.tiedTeams||[]).forEach(tid => teamPts[tid] = (teamPts[tid]||0) + 2.5);
        (round.tiePlayers||[]).forEach(pid => playerPts[pid] = (playerPts[pid]||0) + 1.25);
      }
    } else {
      (round.matches||[]).forEach(m => {
        if (m.type==="front9") {
          if (m.result==="win") { teamPts[m.winTeam]=(teamPts[m.winTeam]||0)+2; (m.winPlayers||[]).forEach(pid=>playerPts[pid]=(playerPts[pid]||0)+1); }
          else if (m.result==="halve") { [m.team1,m.team2].forEach(tid=>teamPts[tid]=(teamPts[tid]||0)+1); [...(m.team1Players||[]),...(m.team2Players||[])].forEach(pid=>playerPts[pid]=(playerPts[pid]||0)+0.5); }
        } else if (m.type==="back9") {
          if (m.result==="win") { teamPts[m.winTeam]=(teamPts[m.winTeam]||0)+1; if(m.winPlayer) playerPts[m.winPlayer]=(playerPts[m.winPlayer]||0)+1; }
          else if (m.result==="halve") { [m.team1,m.team2].forEach(tid=>teamPts[tid]=(teamPts[tid]||0)+0.5); [m.player1,m.player2].forEach(pid=>{if(pid)playerPts[pid]=(playerPts[pid]||0)+0.5;}); }
        } else if (m.type==="ctp") {
          if (m.winTeam) teamPts[m.winTeam]=(teamPts[m.winTeam]||0)+0.5;
          if (m.winPlayer) playerPts[m.winPlayer]=(playerPts[m.winPlayer]||0)+0.5;
        }
      });
    }
  });
  return { teamPts, playerPts };
}

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("standings");
  const [isAdmin, setIsAdmin] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [activeRound, setActiveRound] = useState(null);
  const [hcpEdit, setHcpEdit] = useState(false);

  useEffect(() => {
    loadData().then(d => {
      if (d) { setData(d); }
      else {
        const rounds = [{
          id:"r1", number:1, type:"standard", date:"", completed:true,
          matches:[
            { type:"front9", format:"Scramble", team1:"tA", team2:"tC", team1Players:["pCole","pJordan"], team2Players:["pTanner","pCaden"], result:"win", winTeam:"tC", winPlayers:["pTanner","pCaden"] },
            { type:"back9", player1:"pCole", player2:"pTanner", team1:"tA", team2:"tC", result:"win", winPlayer:"pTanner", winTeam:"tC" },
            { type:"back9", player1:"pJordan", player2:"pCaden", team1:"tA", team2:"tC", result:"win", winPlayer:"pJordan", winTeam:"tA" },
            { type:"front9", format:"Scramble", team1:"tB", team2:"tC", team1Players:["pJaxon","pAustin"], team2Players:["pBraden","pAlex"], result:"halve", winTeam:"", winPlayers:[] },
            { type:"back9", player1:"pJaxon", player2:"pBraden", team1:"tB", team2:"tC", result:"halve", winPlayer:"", winTeam:"" },
            { type:"back9", player1:"pAustin", player2:"pAlex", team1:"tB", team2:"tC", result:"win", winPlayer:"pAustin", winTeam:"tB" },
            { type:"front9", format:"Scramble", team1:"tA", team2:"tB", team1Players:["pKaden","pPayton"], team2Players:["pJosh","pSpencer"], result:"win", winTeam:"tA", winPlayers:["pKaden","pPayton"] },
            { type:"back9", player1:"pKaden", player2:"pJosh", team1:"tA", team2:"tB", result:"win", winPlayer:"pJosh", winTeam:"tB" },
            { type:"back9", player1:"pPayton", player2:"pSpencer", team1:"tA", team2:"tB", result:"win", winPlayer:"pPayton", winTeam:"tA" },
            { type:"ctp", winPlayer:"pTanner", winTeam:"tC" },
          ]
        }];
        const init = { teams: DEFAULT_TEAMS, players: DEFAULT_PLAYERS, rounds, settings:{ adminPin: ADMIN_PIN } };
        setData(init);
        saveData(init);
      }
      setLoading(false);
    });
  }, []);

  const persist = nd => { setData(nd); saveData(nd); };

  if (loading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",fontFamily:"sans-serif",color:"#6b7280",flexDirection:"column",gap:12}}>
      <div style={{fontSize:32}}>⛳</div>
      <div>Loading league data...</div>
    </div>
  );

  const playerById = Object.fromEntries(data.players.map(p=>[p.id,p]));
  const teamById   = Object.fromEntries(data.teams.map(t=>[t.id,t]));
  const { teamPts, playerPts } = computeStandings(data.teams, data.players, data.rounds);
  const sortedTeams   = [...data.teams].sort((a,b)=>(teamPts[b.id]||0)-(teamPts[a.id]||0));
  const sortedPlayers = [...data.players].sort((a,b)=>(playerPts[b.id]||0)-(playerPts[a.id]||0));

  const s = {
    wrap:     { fontFamily:"'Segoe UI',sans-serif", maxWidth:700, margin:"0 auto", paddingBottom:40 },
    hdr:      { background:"linear-gradient(135deg,#14532d,#15803d)", color:"#fff", padding:"18px 16px 0" },
    hdrTitle: { fontSize:22, fontWeight:700, margin:0 },
    hdrSub:   { fontSize:12, opacity:0.75, marginTop:2 },
    tabs:     { display:"flex", gap:4, marginTop:14, flexWrap:"wrap" },
    tab:  a => ({ padding:"8px 13px", borderRadius:"8px 8px 0 0", border:"none", cursor:"pointer", fontSize:13, fontWeight:a?700:500, background:a?"#fff":"rgba(255,255,255,0.15)", color:a?"#166534":"#fff" }),
    body:     { padding:"16px 14px" },
    card:     { background:"#fff", borderRadius:12, boxShadow:"0 1px 4px rgba(0,0,0,0.08)", padding:16, marginBottom:14 },
    sec:      { fontSize:15, fontWeight:700, color:"#111827", marginBottom:12 },
    pill: c => ({ display:"inline-block", background:c+"22", color:c, borderRadius:20, padding:"2px 9px", fontSize:11, fontWeight:600 }),
    btn:  v => ({ padding:"8px 14px", borderRadius:8, border:"none", cursor:"pointer", fontSize:13, fontWeight:600, background:v==="primary"?"#16a34a":v==="danger"?"#dc2626":v==="blue"?"#2563eb":"#f3f4f6", color:v==="secondary"?"#374151":"#fff" }),
    inp:      { padding:"7px 10px", borderRadius:8, border:"1px solid #d1d5db", fontSize:13, width:"100%", boxSizing:"border-box" },
    row:      { display:"flex", alignItems:"center", gap:8 },
  };

  // ── STANDINGS ──────────────────────────────────────────────────────────────
  const StandingsView = () => (
    <div>
      <div style={s.card}>
        <div style={s.sec}>🏆 Team Standings</div>
        {sortedTeams.map((t,i) => (
          <div key={t.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<2?"1px solid #f3f4f6":""}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:t.color,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13}}>{i+1}</div>
            <div style={{flex:1,fontWeight:600,fontSize:15}}>{t.name}</div>
            <div style={{fontWeight:700,fontSize:20,color:t.color}}>{(teamPts[t.id]||0).toFixed(1)}<span style={{fontSize:11,color:"#9ca3af",fontWeight:400}}> pts</span></div>
          </div>
        ))}
      </div>
      <div style={s.card}>
        <div style={s.sec}>⭐ MVP Leaderboard</div>
        {sortedPlayers.map((p,i) => {
          const team = teamById[p.teamId];
          return (
            <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<sortedPlayers.length-1?"1px solid #f3f4f6":""}}>
              <div style={{width:22,textAlign:"center",fontWeight:700,color:"#9ca3af",fontSize:12}}>#{i+1}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:14}}>{p.name}</div>
                {team && <span style={s.pill(team.color)}>{team.name}</span>}
              </div>
              <div style={{fontWeight:700,fontSize:16,color:team?.color||"#111"}}>{(playerPts[p.id]||0).toFixed(1)}<span style={{fontSize:10,color:"#9ca3af",fontWeight:400}}> pts</span></div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── SCHEDULE ───────────────────────────────────────────────────────────────
  const ScheduleView = () => {
    const [selRound, setSelRound] = useState(1);
    const [fmtMap, setFmtMap] = useState(Object.fromEntries(SCHEDULE.map(r=>[r.number,"Scramble"])));
    const sched = SCHEDULE.find(r=>r.number===selRound);
    if (!sched) return null;

    return (
      <div>
        <div style={s.card}>
          <div style={s.sec}>📅 Season Schedule</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
            {SCHEDULE.map(r => {
              const done = data.rounds.find(x=>x.number===r.number)?.completed;
              return (
                <button key={r.number} style={s.btn(selRound===r.number?"primary":"secondary")} onClick={()=>setSelRound(r.number)}>
                  R{r.number}{done?" ✓":""}
                </button>
              );
            })}
          </div>

          {sched.type==="scramble5" ? (
            <div style={{textAlign:"center",padding:"20px 0"}}>
              <div style={{fontSize:32}}>⛳</div>
              <div style={{fontWeight:700,fontSize:17,marginTop:8}}>Round 4 — Full Team Scramble</div>
              <div style={{fontSize:13,color:"#6b7280",marginTop:4}}>All 3 teams compete together. 5 team points. Stroke play.</div>
              <div style={{marginTop:14}}>
                {data.teams.map(t=>(
                  <div key={t.id} style={{...s.pill(t.color),margin:4,display:"inline-block",fontSize:13}}>
                    {t.name}: {data.players.filter(p=>p.teamId===t.id).map(p=>p.name).join(", ")}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            sched.foursomes.map((fg,fi) => {
              const fmt = fmtMap[selRound];
              const t1p = fg.front.slice(0,2).map(id=>playerById[id]).filter(Boolean);
              const t2p = fg.front.slice(2,4).map(id=>playerById[id]).filter(Boolean);
              const t1 = teamById[fg.teamA], t2 = teamById[fg.teamB];
              const hcpInfo = front9Strokes(fmt, t1p, t2p);
              return (
                <div key={fi} style={{border:"1px solid #e5e7eb",borderRadius:10,padding:14,marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <div style={{fontWeight:700,fontSize:14}}>Foursome {fi+1}</div>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      <span style={{fontSize:12,color:"#6b7280"}}>Format:</span>
                      <select style={{...s.inp,width:"auto",padding:"4px 8px",fontSize:12}} value={fmtMap[selRound]} onChange={e=>setFmtMap({...fmtMap,[selRound]:e.target.value})}>
                        {FORMATS.map(f=><option key={f}>{f}</option>)}
                      </select>
                    </div>
                  </div>
                  {/* Front 9 */}
                  <div style={{background:"#f0fdf4",borderRadius:8,padding:10,marginBottom:8}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#166534",marginBottom:6}}>🏌️ Front 9 — {fmt}</div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:6}}>
                      <div style={{fontSize:13}}><span style={s.pill(t1.color)}>{t1.name}</span> <span style={{marginLeft:4}}>{t1p.map(p=>`${p.name} (${p.handicap})`).join(" & ")}</span></div>
                      <span style={{fontSize:12,color:"#9ca3af"}}>vs</span>
                      <div style={{fontSize:13}}><span style={s.pill(t2.color)}>{t2.name}</span> <span style={{marginLeft:4}}>{t2p.map(p=>`${p.name} (${p.handicap})`).join(" & ")}</span></div>
                    </div>
                    <div style={{marginTop:8}}>
                      {hcpInfo?.mode==="bestball" ? (
                        <div style={{fontSize:11}}>
                          <span style={{fontWeight:600,color:"#6b7280"}}>Strokes vs lowest hcp: </span>
                          {[...t1p,...t2p].map(p => {
                            const minH = Math.min(...[...t1p,...t2p].map(x=>x.handicap));
                            const strokes = Math.round((p.handicap-minH)*0.9/2);
                            return <span key={p.id} style={{marginRight:8}}><b>{p.name}</b>: {strokes===0?"none":`+${strokes} holes`}</span>;
                          })}
                        </div>
                      ) : hcpInfo?.strokes > 0 ? (
                        <span style={{fontSize:11,background:"#fef3c7",color:"#92400e",borderRadius:6,padding:"1px 6px",fontWeight:600}}>
                          {hcpInfo.lower==="team1"
                            ? `${t2.name} gets +${hcpInfo.strokes} stroke${hcpInfo.strokes!==1?"s":""} on ${hcpInfo.strokes} hardest hole${hcpInfo.strokes!==1?"s":""}`
                            : `${t1.name} gets +${hcpInfo.strokes} stroke${hcpInfo.strokes!==1?"s":""} on ${hcpInfo.strokes} hardest hole${hcpInfo.strokes!==1?"s":""}`}
                        </span>
                      ) : <span style={{fontSize:11,color:"#9ca3af"}}>Even — no strokes</span>}
                    </div>
                  </div>
                  {/* Back 9 */}
                  {fg.back.map(([pid1,pid2],bi) => {
                    const p1=playerById[pid1], p2=playerById[pid2];
                    if(!p1||!p2) return null;
                    const strokes = back9Strokes(p1.handicap, p2.handicap);
                    const higher = p1.handicap>p2.handicap?p1:p2;
                    return (
                      <div key={bi} style={{background:"#eff6ff",borderRadius:8,padding:10,marginBottom:bi===0?8:0}}>
                        <div style={{fontSize:12,fontWeight:700,color:"#1d4ed8",marginBottom:6}}>🎯 Back 9 — Match Play</div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:6}}>
                          <span style={{fontSize:13}}><b>{p1.name}</b> <span style={{color:"#9ca3af",fontSize:11}}>({p1.handicap})</span></span>
                          <span style={{fontSize:12,color:"#9ca3af"}}>vs</span>
                          <span style={{fontSize:13}}><b>{p2.name}</b> <span style={{color:"#9ca3af",fontSize:11}}>({p2.handicap})</span></span>
                        </div>
                        <div style={{marginTop:6}}>
                          {strokes>0
                            ? <span style={{fontSize:11,background:"#fef3c7",color:"#92400e",borderRadius:6,padding:"1px 6px",fontWeight:600}}>{higher.name} gets +{strokes} stroke{strokes!==1?"s":""} on {strokes} hardest hole{strokes!==1?"s":""}</span>
                            : <span style={{fontSize:11,color:"#9ca3af"}}>Even — no strokes</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  // ── RESULTS ────────────────────────────────────────────────────────────────
  const RoundsView = () => (
    <div>
      {data.rounds.length===0 && <div style={{...s.card,color:"#9ca3af",fontSize:13}}>No rounds recorded yet.</div>}
      {data.rounds.map((round,ri) => (
        <div key={round.id} style={s.card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div>
              <span style={{fontWeight:700,fontSize:15}}>Round {round.number}</span>
              <span style={{...s.pill("#6b7280"),marginLeft:8}}>{round.type==="scramble5"?"4-Man Scramble":"Standard"}</span>
              {round.completed && <span style={{...s.pill("#16a34a"),marginLeft:6}}>✓</span>}
            </div>
            <div style={{fontSize:12,color:"#9ca3af"}}>{round.date||""}</div>
          </div>
          {round.type==="scramble5" ? (
            <div style={{fontSize:13}}>
              {round.completed
                ? round.winner
                  ? <div>🏆 <b style={{color:teamById[round.winner]?.color}}>{teamById[round.winner]?.name}</b> wins (+5 pts)</div>
                  : <div>Tie — {(round.tiedTeams||[]).map(tid=>teamById[tid]?.name).join(" & ")} (+2.5 pts each)</div>
                : <div style={{color:"#9ca3af"}}>Pending</div>}
            </div>
          ) : (
            (round.matches||[]).map((m,mi) => (
              <div key={mi} style={{fontSize:13,padding:"5px 0",borderBottom:"1px solid #f9fafb",color:"#374151"}}>
                {m.type==="front9" && <span>🏌️ <b>{teamById[m.team1]?.name}</b> vs <b>{teamById[m.team2]?.name}</b> ({m.format||"?"}): {m.result==="win"?<b style={{color:teamById[m.winTeam]?.color}}>{teamById[m.winTeam]?.name} wins</b>:m.result==="halve"?"Halved":<span style={{color:"#9ca3af"}}>Pending</span>}</span>}
                {m.type==="back9" && <span>🎯 <b>{playerById[m.player1]?.name||"?"}</b> vs <b>{playerById[m.player2]?.name||"?"}</b>: {m.result==="win"?<b>{playerById[m.winPlayer]?.name} wins</b>:m.result==="halve"?"Halved":<span style={{color:"#9ca3af"}}>Pending</span>}</span>}
                {m.type==="ctp" && <span>📍 CTP: {m.winPlayer?<b>{playerById[m.winPlayer]?.name}</b>:<span style={{color:"#9ca3af"}}>Pending</span>}</span>}
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );

  // ── ADMIN: Handicap Editor ─────────────────────────────────────────────────
  const HandicapEditor = () => {
    const [draft, setDraft] = useState(Object.fromEntries(data.players.map(p=>[p.id,p.handicap])));
    const save = () => { persist({...data,players:data.players.map(p=>({...p,handicap:Number(draft[p.id])||p.handicap}))}); setHcpEdit(false); };
    return (
      <div style={s.card}>
        <div style={s.sec}>✏️ Update Handicaps</div>
        <div style={{fontSize:12,color:"#6b7280",marginBottom:12}}>Changes apply to all future schedule calculations.</div>
        {data.teams.map(t=>(
          <div key={t.id} style={{marginBottom:14}}>
            <span style={s.pill(t.color)}>{t.name}</span>
            {data.players.filter(p=>p.teamId===t.id).map(p=>(
              <div key={p.id} style={{...s.row,marginBottom:6,marginTop:6}}>
                <span style={{width:80,fontSize:13,fontWeight:500}}>{p.name}</span>
                <input type="number" style={{...s.inp,width:70}} value={draft[p.id]||""} onChange={e=>setDraft({...draft,[p.id]:e.target.value})} />
              </div>
            ))}
          </div>
        ))}
        <div style={s.row}>
          <button style={s.btn("primary")} onClick={save}>Save</button>
          <button style={s.btn("secondary")} onClick={()=>setHcpEdit(false)}>Cancel</button>
        </div>
      </div>
    );
  };

  // ── ADMIN: Round Editor ────────────────────────────────────────────────────
  const RoundEditor = ({round, onSave, onClose}) => {
    const [r, setR] = useState(JSON.parse(JSON.stringify(round)));
    const sched = SCHEDULE.find(x=>x.number===round.number);
    const updMatch = (i,f,v) => { const ms=[...(r.matches||[])]; ms[i]={...ms[i],[f]:v}; setR({...r,matches:ms}); };

    useEffect(()=>{
      if((r.matches||[]).length===0 && sched && sched.type!=="scramble5"){
        const matches=[];
        sched.foursomes.forEach(fg=>{
          matches.push({type:"front9",format:"Scramble",team1:fg.teamA,team2:fg.teamB,team1Players:fg.front.slice(0,2),team2Players:fg.front.slice(2,4),result:"",winTeam:"",winPlayers:[]});
          fg.back.forEach(([p1,p2])=>{
            const pp1=playerById[p1],pp2=playerById[p2];
            matches.push({type:"back9",player1:p1,player2:p2,team1:pp1?.teamId||"",team2:pp2?.teamId||"",result:"",winPlayer:"",winTeam:""});
          });
        });
        matches.push({type:"ctp",winPlayer:"",winTeam:""});
        setR({...r,matches});
      }
    },[]);

    const pOpts = data.players.map(p=><option key={p.id} value={p.id}>{p.name} ({teamById[p.teamId]?.name})</option>);
    const tOpts = data.teams.map(t=><option key={t.id} value={t.id}>{t.name}</option>);

    return (
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:100,overflowY:"auto",display:"flex",justifyContent:"center",padding:"16px 8px"}}>
        <div style={{background:"#fff",borderRadius:14,padding:18,width:"100%",maxWidth:540,alignSelf:"flex-start"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontWeight:700,fontSize:16}}>Enter Results — Round {r.number}</div>
            <button style={s.btn("secondary")} onClick={onClose}>✕</button>
          </div>
          <div style={{...s.row,marginBottom:12}}>
            <label style={{fontSize:13,width:40}}>Date</label>
            <input type="date" style={s.inp} value={r.date||""} onChange={e=>setR({...r,date:e.target.value})} />
          </div>

          {r.type==="scramble5" ? (
            <div>
              <div style={{fontSize:13,color:"#6b7280",marginBottom:10}}>4-Man Scramble — 5 pts stroke play</div>
              {data.teams.map(t=>(
                <div key={t.id} style={{...s.row,marginBottom:8}}>
                  <span style={{...s.pill(t.color),width:70,textAlign:"center"}}>{t.name}</span>
                  <input style={s.inp} placeholder="Score" type="number" value={r.teamScores?.[t.id]||""} onChange={e=>setR({...r,teamScores:{...(r.teamScores||{}),[t.id]:e.target.value}})} />
                </div>
              ))}
              <div style={{...s.row,marginBottom:8}}>
                <label style={{fontSize:13,width:50}}>Result</label>
                <select style={s.inp} value={r.tieScramble?"tie":"win"} onChange={e=>setR({...r,tieScramble:e.target.value==="tie",winner:"",tiedTeams:[]})}>
                  <option value="win">Winner</option><option value="tie">Tie</option>
                </select>
              </div>
              {!r.tieScramble
                ? <div style={{...s.row,marginBottom:10}}><label style={{fontSize:13,width:50}}>Winner</label><select style={s.inp} value={r.winner||""} onChange={e=>setR({...r,winner:e.target.value})}><option value="">Select</option>{tOpts}</select></div>
                : <div style={{marginBottom:10}}>{data.teams.map(t=><label key={t.id} style={{display:"flex",alignItems:"center",gap:6,fontSize:13,marginTop:4}}><input type="checkbox" checked={(r.tiedTeams||[]).includes(t.id)} onChange={e=>{const a=r.tiedTeams||[];setR({...r,tiedTeams:e.target.checked?[...a,t.id]:a.filter(x=>x!==t.id)});}} />{t.name}</label>)}</div>}
              {r.winner && <div><label style={{fontSize:13,fontWeight:600}}>Winning players (MVP):</label>{data.players.filter(p=>p.teamId===r.winner).map(p=><label key={p.id} style={{display:"flex",alignItems:"center",gap:6,fontSize:13,marginTop:4}}><input type="checkbox" checked={(r.winnerPlayers||[]).includes(p.id)} onChange={e=>{const a=r.winnerPlayers||[];setR({...r,winnerPlayers:e.target.checked?[...a,p.id]:a.filter(x=>x!==p.id)});}} />{p.name}</label>)}</div>}
            </div>
          ) : (
            (r.matches||[]).map((m,i)=>(
              <div key={i} style={{background:"#f9fafb",borderRadius:10,padding:12,marginBottom:10}}>
                {m.type==="front9" && <>
                  <div style={{fontWeight:600,fontSize:13,marginBottom:8}}>🏌️ Front 9: <span style={{color:teamById[m.team1]?.color}}>{teamById[m.team1]?.name}</span> vs <span style={{color:teamById[m.team2]?.color}}>{teamById[m.team2]?.name}</span></div>
                  <div style={{...s.row,marginBottom:6}}><label style={{fontSize:12,width:55}}>Format</label><select style={s.inp} value={m.format||"Scramble"} onChange={e=>updMatch(i,"format",e.target.value)}>{FORMATS.map(f=><option key={f}>{f}</option>)}</select></div>
                  <div style={{...s.row,marginBottom:6}}><label style={{fontSize:12,width:55}}>Result</label><select style={s.inp} value={m.result||""} onChange={e=>updMatch(i,"result",e.target.value)}><option value="">Pending</option><option value="win">Win</option><option value="halve">Halve</option></select></div>
                  {m.result==="win" && <div style={s.row}><label style={{fontSize:12,width:55}}>Winner</label><select style={s.inp} value={m.winTeam||""} onChange={e=>{const side=e.target.value===m.team1?"team1Players":"team2Players";updMatch(i,"winTeam",e.target.value);updMatch(i,"winPlayers",m[side]||[]);}}><option value="">Select</option>{tOpts}</select></div>}
                </>}
                {m.type==="back9" && <>
                  <div style={{fontWeight:600,fontSize:13,marginBottom:8}}>🎯 Back 9: <b>{playerById[m.player1]?.name||"?"}</b> vs <b>{playerById[m.player2]?.name||"?"}</b></div>
                  <div style={{...s.row,marginBottom:6}}><label style={{fontSize:12,width:55}}>Result</label><select style={s.inp} value={m.result||""} onChange={e=>updMatch(i,"result",e.target.value)}><option value="">Pending</option><option value="win">Win</option><option value="halve">Halve</option></select></div>
                  {m.result==="win" && <div style={s.row}><label style={{fontSize:12,width:55}}>Winner</label><select style={s.inp} value={m.winPlayer||""} onChange={e=>{const p=playerById[e.target.value];updMatch(i,"winPlayer",e.target.value);if(p)updMatch(i,"winTeam",p.teamId);}}><option value="">Select</option>{pOpts}</select></div>}
                </>}
                {m.type==="ctp" && <>
                  <div style={{fontWeight:600,fontSize:13,marginBottom:8}}>📍 Closest to Pin</div>
                  <div style={s.row}><label style={{fontSize:12,width:55}}>Winner</label><select style={s.inp} value={m.winPlayer||""} onChange={e=>{const p=playerById[e.target.value];updMatch(i,"winPlayer",e.target.value);if(p)updMatch(i,"winTeam",p.teamId);}}><option value="">Select player</option>{pOpts}</select></div>
                </>}
              </div>
            ))
          )}
          <div style={{...s.row,justifyContent:"flex-end",gap:8,marginTop:12}}>
            <button style={s.btn("secondary")} onClick={()=>onSave(r)}>Save Draft</button>
            <button style={s.btn("primary")} onClick={()=>onSave({...r,completed:true})}>✓ Mark Complete</button>
          </div>
        </div>
      </div>
    );
  };

  // ── ADMIN ──────────────────────────────────────────────────────────────────
  const AdminView = () => {
    const getRound = num => data.rounds.find(r=>r.number===num);
    const upsertRound = updated => {
      const exists = data.rounds.find(r=>r.number===updated.number);
      const rounds = exists ? data.rounds.map(r=>r.number===updated.number?updated:r) : [...data.rounds,updated];
      persist({...data,rounds});
      setActiveRound(null);
    };
    const openRound = num => {
      const sched = SCHEDULE.find(s=>s.number===num);
      const existing = getRound(num);
      setActiveRound(existing||{id:"r"+num,number:num,type:sched.type,date:"",completed:false,matches:[]});
    };

    return (
      <div>
        {activeRound && <RoundEditor round={activeRound} onSave={upsertRound} onClose={()=>setActiveRound(null)} />}
        {hcpEdit ? <HandicapEditor /> : (
          <div style={s.card}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={s.sec}>👤 Player Handicaps</div>
              <button style={s.btn("blue")} onClick={()=>setHcpEdit(true)}>Update</button>
            </div>
            {data.teams.map(t=>(
              <div key={t.id} style={{marginBottom:10}}>
                <span style={s.pill(t.color)}>{t.name}</span>
                <div style={{display:"flex",gap:14,flexWrap:"wrap",marginTop:6}}>
                  {data.players.filter(p=>p.teamId===t.id).map(p=>(
                    <span key={p.id} style={{fontSize:13}}>{p.name} <b style={{color:teamById[p.teamId]?.color}}>{p.handicap}</b></span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={s.card}>
          <div style={s.sec}>📋 Enter Round Results</div>
          {SCHEDULE.map(sched=>{
            const rd = getRound(sched.number);
            return (
              <div key={sched.number} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #f3f4f6"}}>
                <div>
                  <span style={{fontWeight:600,fontSize:14}}>Round {sched.number}</span>
                  <span style={{...s.pill("#6b7280"),marginLeft:8}}>{sched.type==="scramble5"?"Scramble":"Standard"}</span>
                  {rd?.completed && <span style={{...s.pill("#16a34a"),marginLeft:6}}>✓ Done</span>}
                  {rd?.date && <span style={{fontSize:12,color:"#9ca3af",marginLeft:8}}>{rd.date}</span>}
                </div>
                <button style={{...s.btn(rd?.completed?"secondary":"primary"),padding:"6px 12px"}} onClick={()=>openRound(sched.number)}>
                  {rd?.completed?"Edit":"Enter"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── SHELL ──────────────────────────────────────────────────────────────────
  const tabs = [
    {id:"standings", label:"🏆 Standings"},
    {id:"schedule",  label:"📅 Schedule"},
    {id:"rounds",    label:"📋 Results"},
    ...(isAdmin ? [{id:"admin",label:"⚙️ Admin"}] : [{id:"login",label:"🔐 Admin"}]),
  ];

  return (
    <div style={s.wrap}>
      <div style={s.hdr}>
        <div style={s.hdrTitle}>⛳ Golf League</div>
        <div style={s.hdrSub}>{data.rounds.filter(r=>r.completed).length}/6 rounds complete</div>
        <div style={s.tabs}>{tabs.map(t=><button key={t.id} style={s.tab(view===t.id)} onClick={()=>setView(t.id)}>{t.label}</button>)}</div>
      </div>
      <div style={s.body}>
        {view==="standings" && <StandingsView />}
        {view==="schedule"  && <ScheduleView />}
        {view==="rounds"    && <RoundsView />}
        {view==="admin" && isAdmin && <AdminView />}
        {view==="login" && !isAdmin && (
          <div style={s.card}>
            <div style={s.sec}>Admin Login</div>
            <div style={{...s.row,marginBottom:8}}>
              <input style={s.inp} type="password" placeholder="PIN" value={pinInput} onChange={e=>setPinInput(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"){if(pinInput===ADMIN_PIN){setIsAdmin(true);setPinError(false);setView("admin");}else setPinError(true);}}} />
              <button style={s.btn("primary")} onClick={()=>{if(pinInput===ADMIN_PIN){setIsAdmin(true);setPinError(false);setView("admin");}else setPinError(true);}}>Login</button>
            </div>
            {pinError && <div style={{color:"#dc2626",fontSize:13}}>Incorrect PIN</div>}
            <div style={{fontSize:12,color:"#9ca3af",marginTop:6}}>Default PIN: 1234</div>
          </div>
        )}
      </div>
    </div>
  );
}
