import { useState, useEffect } from "react";

const ADMIN_PIN = "7888";

// ---- GitHub storage ----
const GITHUB_TOKEN = "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";
const GITHUB_REPO  = "kadenjsmith6/golf-league";
const GITHUB_FILE  = "data.json";
const GITHUB_API   = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}`;
const GITHUB_HEADERS = {
  "Authorization": `token ${GITHUB_TOKEN}`,
  "Content-Type":  "application/json",
  "Accept":        "application/vnd.github.v3+json",
};

async function loadData() {
  try {
    const res = await fetch(GITHUB_API, { headers: GITHUB_HEADERS });
    if (!res.ok) return null;
    const json = await res.json();
    const decoded = JSON.parse(atob(json.content));
    if (decoded && Object.keys(decoded).length > 0 && !decoded.init) return decoded;
    return null;
  } catch(e) { console.error("Load error:", e); return null; }
}

async function saveData(d, setSaveStatus) {
  if (setSaveStatus) setSaveStatus("saving");
  try {
    const getRes = await fetch(GITHUB_API, { headers: GITHUB_HEADERS });
    let sha = null;
    if (getRes.ok) { const j = await getRes.json(); sha = j.sha; }
    const res = await fetch(GITHUB_API, {
      method: "PUT",
      headers: GITHUB_HEADERS,
      body: JSON.stringify({
        message: "Update league data",
        content: btoa(unescape(encodeURIComponent(JSON.stringify(d)))),
        ...(sha ? { sha } : {}),
      }),
    });
    if (!res.ok) {
      console.error("GitHub save failed:", res.status, await res.text());
      if (setSaveStatus) setSaveStatus("error");
    } else {
      if (setSaveStatus) setSaveStatus("saved");
      setTimeout(() => { if (setSaveStatus) setSaveStatus(null); }, 3000);
    }
  } catch(e) { console.error("Save error:", e); if (setSaveStatus) setSaveStatus("error"); }
}

// ---- Static data ----
const DEFAULT_TEAMS = [
  { id:"tA", name:"Team A", color:"#16a34a" },
  { id:"tB", name:"Team B", color:"#2563eb" },
  { id:"tC", name:"Team C", color:"#dc2626" },
];
const DEFAULT_PLAYERS = [
  { id:"pPayton",  name:"Payton",  teamId:"tA", handicap:9  },
  { id:"pJordan",  name:"Jordan",  teamId:"tA", handicap:16 },
  { id:"pCole",    name:"Cole",    teamId:"tA", handicap:19 },
  { id:"pKaden",   name:"Kaden",   teamId:"tA", handicap:27 },
  { id:"pSpencer", name:"Spencer", teamId:"tB", handicap:10 },
  { id:"pJosh",    name:"Josh",    teamId:"tB", handicap:13 },
  { id:"pJaxon",   name:"Jaxon",   teamId:"tB", handicap:20 },
  { id:"pAustin",  name:"Austin",  teamId:"tB", handicap:24 },
  { id:"pTanner",  name:"Tanner",  teamId:"tC", handicap:6  },
  { id:"pCaden",   name:"Caden",   teamId:"tC", handicap:18 },
  { id:"pBraden",  name:"Braden",  teamId:"tC", handicap:25 },
  { id:"pAlex",    name:"Alex",    teamId:"tC", handicap:32 },
];

const DEFAULT_SCHEDULE = [
  { number:1, type:"standard", foursomes:[
    { teamA:"tA", teamB:"tC", front:["pCole","pJordan","pTanner","pCaden"],      back:[["pCole","pTanner"],    ["pJordan","pCaden"]]  },
    { teamA:"tB", teamB:"tC", front:["pJaxon","pAustin","pBraden","pAlex"],      back:[["pJaxon","pBraden"],   ["pAustin","pAlex"]]   },
    { teamA:"tA", teamB:"tB", front:["pKaden","pPayton","pJosh","pSpencer"],      back:[["pKaden","pJosh"],     ["pPayton","pSpencer"]] },
  ]},
  { number:2, type:"standard", foursomes:[
    { teamA:"tA", teamB:"tB", front:["pJordan","pKaden","pJosh","pJaxon"],        back:[["pJordan","pJosh"],    ["pKaden","pJaxon"]]   },
    { teamA:"tB", teamB:"tC", front:["pCaden","pBraden","pSpencer","pAustin"],    back:[["pAustin","pBraden"],  ["pCaden","pSpencer"]] },
    { teamA:"tA", teamB:"tC", front:["pCole","pPayton","pTanner","pAlex"],        back:[["pTanner","pPayton"],  ["pAlex","pCole"]]     },
  ]},
  { number:3, type:"standard", foursomes:[
    { teamA:"tA", teamB:"tB", front:["pPayton","pJordan","pSpencer","pJaxon"],    back:[["pPayton","pJaxon"],   ["pJordan","pSpencer"]] },
    { teamA:"tA", teamB:"tC", front:["pCole","pKaden","pCaden","pBraden"],         back:[["pCole","pCaden"],     ["pKaden","pBraden"]]  },
    { teamA:"tB", teamB:"tC", front:["pJosh","pAustin","pTanner","pAlex"],         back:[["pJosh","pAlex"],      ["pAustin","pTanner"]] },
  ]},
  { number:4, type:"scramble5" },
  { number:5, type:"standard", foursomes:[
    { teamA:"tB", teamB:"tC", front:["pSpencer","pJosh","pTanner","pCaden"],       back:[["pSpencer","pCaden"],  ["pJosh","pTanner"]]   },
    { teamA:"tA", teamB:"tB", front:["pJordan","pCole","pJaxon","pAustin"],         back:[["pJordan","pAustin"],  ["pCole","pJaxon"]]    },
    { teamA:"tA", teamB:"tC", front:["pPayton","pKaden","pBraden","pAlex"],         back:[["pPayton","pBraden"],  ["pKaden","pAlex"]]    },
  ]},
  { number:6, type:"standard", foursomes:[
    { teamA:"tA", teamB:"tC", front:["pKaden","pJordan","pTanner","pBraden"],      back:[["pKaden","pTanner"],   ["pJordan","pBraden"]] },
    { teamA:"tA", teamB:"tB", front:["pCole","pPayton","pSpencer","pAustin"],       back:[["pCole","pAustin"],    ["pPayton","pSpencer"]] },
    { teamA:"tB", teamB:"tC", front:["pJosh","pJaxon","pCaden","pAlex"],            back:[["pJosh","pCaden"],     ["pJaxon","pAlex"]]    },
  ]},
];

const ROUND_INFO_DEFAULTS = Object.fromEntries([1,2,3,4,5,6].map(n=>[n,{course:"TBD",ctpHole:""}]));
const FORMATS = ["Scramble","Best Ball","Alt Shot","Match Play"];

// ---- Handicap helpers ----
function strokeBreakdown(raw) {
  const full = Math.floor(raw);
  const half = (raw - full) >= 0.5 ? 0.5 : 0;
  return { total: full + half };
}
function strokeLabel(raw) {
  if (raw <= 0) return null;
  const { total } = strokeBreakdown(raw);
  return `${total} stroke${total !== 1 ? "s" : ""}`;
}
function back9Raw(h1, h2) { return Math.abs(h1 - h2) / 2; }
function front9Info(format, t1p, t2p) {
  const h1 = t1p.map(p=>p.handicap), h2 = t2p.map(p=>p.handicap);
  if (format === "Scramble") {
    const th = hcps => { const s=[...hcps].sort((a,b)=>a-b); return s[0]*0.5+(s[1]??s[0])*0.25; };
    return { lower: th(h1)<=th(h2)?"team1":"team2", raw: Math.abs(th(h1)-th(h2))/2 };
  }
  if (format === "Best Ball") {
    const minH = Math.min(...h1,...h2);
    return { mode:"bestball", players:[...t1p,...t2p].map(p=>({ name:p.name, raw:(p.handicap-minH)*0.9/2 })) };
  }
  const s1=h1.reduce((a,b)=>a+b,0), s2=h2.reduce((a,b)=>a+b,0);
  return { lower: s1<=s2?"team1":"team2", raw: Math.abs(s1-s2)/2 };
}

// ---- Standings ----
function computeStandings(teams, players, rounds) {
  const teamPts   = Object.fromEntries(teams.map(t=>[t.id,0]));
  const playerPts = Object.fromEntries(players.map(p=>[p.id,0]));
  const onePts    = Object.fromEntries(players.map(p=>[p.id,0]));
  const twoPts    = Object.fromEntries(players.map(p=>[p.id,0]));
  const h2h       = {};
  const reg       = new Set(players.map(p=>p.id));

  const mvp = (pid, pts, type) => {
    if (!pid || !reg.has(pid)) return;
    playerPts[pid] = (playerPts[pid]||0) + pts;
    if (type==="1v1") onePts[pid] = (onePts[pid]||0) + pts;
    if (type==="2v2") twoPts[pid] = (twoPts[pid]||0) + pts;
  };
  const team = (tid, pts) => { if (tid) teamPts[tid] = (teamPts[tid]||0) + pts; };
  const h2hAdd = (a, b, pts) => {
    if (!a||!b||!reg.has(a)||!reg.has(b)) return;
    if (!h2h[a]) h2h[a]={};
    h2h[a][b] = (h2h[a][b]||0) + pts;
  };

  rounds.forEach(round => {
    if (!round.completed) return;
    if (round.type==="scramble5") {
      if (round.winner) { team(round.winner,5); (round.winnerPlayers||[]).forEach(p=>mvp(p,2.5,"2v2")); }
      else if (round.tieScramble) { (round.tiedTeams||[]).forEach(t=>team(t,2.5)); (round.tiePlayers||[]).forEach(p=>mvp(p,1.25,"2v2")); }
    } else {
      (round.matches||[]).forEach(m => {
        if (m.type==="front9") {
          const all = [...(m.team1Players||[]),...(m.team2Players||[])];
          if (m.result==="win") {
            team(m.winTeam, 2);
            const winners = all.filter(pid=>players.find(pl=>pl.id===pid)?.teamId===m.winTeam);
            const losers  = all.filter(pid=>players.find(pl=>pl.id===pid)?.teamId!==m.winTeam && reg.has(pid));
            winners.forEach(pid=>{ mvp(pid,1,"2v2"); losers.forEach(opp=>h2hAdd(pid,opp,1)); });
            losers.forEach(pid=>winners.forEach(opp=>h2hAdd(pid,opp,0)));
          } else if (m.result==="halve") {
            team(m.team1,1); team(m.team2,1);
            const t1=all.filter(pid=>players.find(pl=>pl.id===pid)?.teamId===m.team1);
            const t2=all.filter(pid=>players.find(pl=>pl.id===pid)?.teamId===m.team2);
            t1.forEach(pid=>{ mvp(pid,0.5,"2v2"); t2.forEach(opp=>{ h2hAdd(pid,opp,0.5); h2hAdd(opp,pid,0.5); }); });
            t2.forEach(pid=>mvp(pid,0.5,"2v2"));
          }
        } else if (m.type==="back9") {
          if (m.result==="win") {
            team(m.winTeam,1); mvp(m.winPlayer,1,"1v1");
            const loser=m.player1===m.winPlayer?m.player2:m.player1;
            h2hAdd(m.winPlayer,loser,1); h2hAdd(loser,m.winPlayer,0);
          } else if (m.result==="halve") {
            team(m.team1,0.5); team(m.team2,0.5);
            mvp(m.player1,0.5,"1v1"); mvp(m.player2,0.5,"1v1");
            h2hAdd(m.player1,m.player2,0.5); h2hAdd(m.player2,m.player1,0.5);
          }
        } else if (m.type==="ctp") {
          team(m.winTeam,0.5); mvp(m.winPlayer,0.5,"ctp");
        }
      });
    }
  });
  return { teamPts, playerPts, onePts, twoPts, h2h };
}

// ---- App ----
export default function App() {
  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [view, setView]           = useState("standings");
  const [isAdmin, setIsAdmin]     = useState(false);
  const [pinInput, setPinInput]   = useState("");
  const [pinError, setPinError]   = useState(false);
  const [activeRound, setActiveRound] = useState(null);
  const [hcpEdit, setHcpEdit]     = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    loadData().then(d => {
      if (d) { setData(d); }
      else {
        const rounds = [{
          id:"r1", number:1, type:"standard", date:"", completed:true, subs:[],
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
        const init = { teams:DEFAULT_TEAMS, players:DEFAULT_PLAYERS, rounds, roundInfo:ROUND_INFO_DEFAULTS, scheduleOverrides:{}, settings:{} };
        setData(init); saveData(init, setSaveStatus);
      }
      setLoading(false);
    });
  }, []);

  const persist = nd => { setData(nd); saveData(nd, setSaveStatus); };

  if (loading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",fontFamily:"sans-serif",color:"#6b7280",flexDirection:"column",gap:12}}>
      <div style={{fontSize:32}}>⛳</div><div>Loading league data...</div>
    </div>
  );

  const playerById = Object.fromEntries(data.players.map(p=>[p.id,p]));
  const teamById   = Object.fromEntries(data.teams.map(t=>[t.id,t]));
  const roundInfo  = data.roundInfo || ROUND_INFO_DEFAULTS;
  const scheduleOverrides = data.scheduleOverrides || {};
  const SCHEDULE = DEFAULT_SCHEDULE.map(r => {
    const ov = scheduleOverrides[r.number];
    return ov ? { ...r, foursomes: ov.foursomes } : r;
  });

  const { teamPts, playerPts, onePts, twoPts, h2h } = computeStandings(data.teams, data.players, data.rounds);
  const sortedTeams = [...data.teams].sort((a,b)=>(teamPts[b.id]||0)-(teamPts[a.id]||0));
  const mvpList = data.players
    .map(p=>({ id:p.id, name:p.name, teamId:p.teamId, pts:playerPts[p.id]||0 }))
    .sort((a,b) => {
      if (b.pts!==a.pts) return b.pts-a.pts;
      const aVsB=(h2h[a.id]||{})[b.id], bVsA=(h2h[b.id]||{})[a.id];
      if (aVsB!==undefined&&bVsA!==undefined&&aVsB!==bVsA) return bVsA-aVsB;
      if ((onePts[b.id]||0)!==(onePts[a.id]||0)) return (onePts[b.id]||0)-(onePts[a.id]||0);
      return (twoPts[b.id]||0)-(twoPts[a.id]||0);
    });

  const resolvePlayer = (pid, subs) => {
    const sub = (subs||[]).find(s=>s.subId===pid);
    if (sub) return { id:sub.subId, name:sub.name, teamId:sub.teamId, handicap:sub.handicap, isSub:true };
    return playerById[pid];
  };

  const s = {
    wrap:  { fontFamily:"'Segoe UI',sans-serif", maxWidth:700, margin:"0 auto", paddingBottom:40 },
    hdr:   { background:"linear-gradient(135deg,#14532d,#15803d)", color:"#fff", padding:"18px 16px 0" },
    tabs:  { display:"flex", gap:4, marginTop:14, flexWrap:"wrap" },
    tab: a=>({ padding:"8px 13px", borderRadius:"8px 8px 0 0", border:"none", cursor:"pointer", fontSize:13, fontWeight:a?700:500, background:a?"#fff":"rgba(255,255,255,0.15)", color:a?"#166534":"#fff" }),
    body:  { padding:"16px 14px" },
    card:  { background:"#fff", borderRadius:12, boxShadow:"0 1px 4px rgba(0,0,0,0.08)", padding:16, marginBottom:14 },
    sec:   { fontSize:15, fontWeight:700, color:"#111827", marginBottom:12 },
    pill:  c=>({ display:"inline-block", background:c+"22", color:c, borderRadius:20, padding:"2px 9px", fontSize:11, fontWeight:600 }),
    btn:   v=>({ padding:"8px 14px", borderRadius:8, border:"none", cursor:"pointer", fontSize:13, fontWeight:600, background:v==="primary"?"#16a34a":v==="danger"?"#dc2626":v==="blue"?"#2563eb":"#f3f4f6", color:v==="secondary"?"#374151":"#fff" }),
    inp:   { padding:"7px 10px", borderRadius:8, border:"1px solid #d1d5db", fontSize:13, width:"100%", boxSizing:"border-box" },
    row:   { display:"flex", alignItems:"center", gap:8 },
    htag:  { fontSize:11, background:"#fef3c7", color:"#92400e", borderRadius:6, padding:"2px 7px", fontWeight:600, display:"inline-block", marginTop:6 },
  };

  // ── STANDINGS ──────────────────────────────────────────────────────────────
  const StandingsView = () => (
    <div>
      <div style={s.card}>
        <div style={s.sec}>🏆 Team Standings</div>
        {sortedTeams.map((t,i)=>(
          <div key={t.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<2?"1px solid #f3f4f6":""}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:t.color,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13}}>{i+1}</div>
            <div style={{flex:1,fontWeight:600,fontSize:15}}>{t.name}</div>
            <div style={{fontWeight:700,fontSize:20,color:t.color}}>{(teamPts[t.id]||0).toFixed(1)}<span style={{fontSize:11,color:"#9ca3af",fontWeight:400}}> pts</span></div>
          </div>
        ))}
      </div>
      <div style={s.card}>
        <div style={s.sec}>⭐ MVP Leaderboard</div>
        {mvpList.map((p,i)=>{
          const team=teamById[p.teamId];
          return (
            <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<mvpList.length-1?"1px solid #f3f4f6":""}}>
              <div style={{width:22,textAlign:"center",fontWeight:700,color:"#9ca3af",fontSize:12}}>#{i+1}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:14}}>{p.name}</div>
                {team&&<span style={s.pill(team.color)}>{team.name}</span>}
              </div>
              <div style={{fontWeight:700,fontSize:16,color:team?.color||"#111"}}>{(p.pts||0).toFixed(1)}<span style={{fontSize:10,color:"#9ca3af",fontWeight:400}}> pts</span></div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── SCHEDULE ───────────────────────────────────────────────────────────────
  const ScheduleView = () => {
    const [sel, setSel] = useState(1);
    const [fmts, setFmts] = useState(Object.fromEntries(SCHEDULE.map(r=>[r.number,"Scramble"])));
    const sched = SCHEDULE.find(r=>r.number===sel);
    const info  = roundInfo[sel]||{};
    const rdData= data.rounds.find(r=>r.number===sel);
    const subs  = rdData?.subs||[];
    if (!sched) return null;
    const rp = pid => resolvePlayer(pid,subs);
    return (
      <div style={s.card}>
        <div style={s.sec}>📅 Season Schedule</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
          {SCHEDULE.map(r=>{
            const done=data.rounds.find(x=>x.number===r.number)?.completed;
            return <button key={r.number} style={s.btn(sel===r.number?"primary":"secondary")} onClick={()=>setSel(r.number)}>R{r.number}{done?" ✓":""}</button>;
          })}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",background:"#f9fafb",borderRadius:10,padding:"12px 14px",marginBottom:14}}>
          <div>
            <div style={{fontWeight:700,fontSize:15}}>Round {sel}{sched.type==="scramble5"?" — Scramble":""}</div>
            <div style={{fontSize:13,color:"#6b7280",marginTop:2}}>📍 {info.course||"TBD"}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:13,color:"#6b7280"}}>{rdData?.date||"Date TBD"}</div>
            {info.ctpHole&&<div style={{fontSize:12,color:"#6b7280",marginTop:2}}>CTP: Hole {info.ctpHole}</div>}
          </div>
        </div>
        {sched.type==="scramble5"?(
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{fontSize:32}}>⛳</div>
            <div style={{fontWeight:700,fontSize:17,marginTop:8}}>Full Team Scramble</div>
            <div style={{fontSize:13,color:"#6b7280",marginTop:4}}>All 3 teams compete. 5 team points. Stroke play.</div>
            <div style={{marginTop:14}}>{data.teams.map(t=><div key={t.id} style={{...s.pill(t.color),margin:4,display:"inline-block",fontSize:13}}>{t.name}: {data.players.filter(p=>p.teamId===t.id).map(p=>p.name).join(", ")}</div>)}</div>
          </div>
        ):sched.foursomes.map((fg,fi)=>{
          const fmt=fmts[sel];
          const t1p=fg.front.slice(0,2).map(id=>rp(id)).filter(Boolean);
          const t2p=fg.front.slice(2,4).map(id=>rp(id)).filter(Boolean);
          const t1=teamById[fg.teamA], t2=teamById[fg.teamB];
          const hcp=front9Info(fmt,t1p,t2p);
          return (
            <div key={fi} style={{border:"1px solid #e5e7eb",borderRadius:10,padding:14,marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{fontWeight:700,fontSize:14}}>Foursome {fi+1}</div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <span style={{fontSize:12,color:"#6b7280"}}>Format:</span>
                  <select style={{...s.inp,width:"auto",padding:"4px 8px",fontSize:12}} value={fmts[sel]} onChange={e=>setFmts({...fmts,[sel]:e.target.value})}>{FORMATS.map(f=><option key={f}>{f}</option>)}</select>
                </div>
              </div>
              <div style={{background:"#f0fdf4",borderRadius:8,padding:10,marginBottom:8}}>
                <div style={{fontSize:12,fontWeight:700,color:"#166534",marginBottom:6}}>🏌️ Front 9 — {fmt}</div>
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6}}>
                  <div style={{fontSize:13}}><span style={s.pill(t1.color)}>{t1.name}</span> <span style={{marginLeft:4}}>{t1p.map(p=>`${p.name}${p.isSub?" (sub)":""} (${p.handicap})`).join(" & ")}</span></div>
                  <span style={{fontSize:12,color:"#9ca3af"}}>vs</span>
                  <div style={{fontSize:13}}><span style={s.pill(t2.color)}>{t2.name}</span> <span style={{marginLeft:4}}>{t2p.map(p=>`${p.name}${p.isSub?" (sub)":""} (${p.handicap})`).join(" & ")}</span></div>
                </div>
                <div style={{marginTop:8}}>
                  {hcp?.mode==="bestball"?(
                    <div style={{fontSize:11}}><span style={{fontWeight:600,color:"#6b7280"}}>Strokes: </span>{hcp.players.map((p,i)=><span key={i} style={{marginRight:8}}><b>{p.name}</b>: {p.raw<=0?"none":strokeLabel(p.raw)}</span>)}</div>
                  ):hcp&&hcp.raw>0?(
                    <div style={s.htag}>{hcp.lower==="team1"?t2p.map(p=>p.name).join(" & "):t1p.map(p=>p.name).join(" & ")} get {strokeLabel(hcp.raw)}</div>
                  ):<span style={{fontSize:11,color:"#9ca3af"}}>Even — no strokes</span>}
                </div>
              </div>
              {fg.back.map(([pid1,pid2],bi)=>{
                const p1=rp(pid1),p2=rp(pid2);
                if(!p1||!p2) return null;
                const raw=back9Raw(p1.handicap,p2.handicap);
                const higher=p1.handicap>p2.handicap?p1:p2;
                const lbl=strokeLabel(raw);
                return (
                  <div key={bi} style={{background:"#eff6ff",borderRadius:8,padding:10,marginBottom:bi===0?8:0}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#1d4ed8",marginBottom:6}}>🎯 Back 9 — Match Play</div>
                    <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6}}>
                      <span style={{fontSize:13}}><b>{p1.name}</b>{p1.isSub&&<span style={{fontSize:10,color:"#9ca3af"}}> (sub)</span>} <span style={{color:"#9ca3af",fontSize:11}}>({p1.handicap})</span></span>
                      <span style={{fontSize:12,color:"#9ca3af"}}>vs</span>
                      <span style={{fontSize:13}}><b>{p2.name}</b>{p2.isSub&&<span style={{fontSize:10,color:"#9ca3af"}}> (sub)</span>} <span style={{color:"#9ca3af",fontSize:11}}>({p2.handicap})</span></span>
                    </div>
                    {lbl&&<div style={s.htag}>{higher.name} gets {lbl}</div>}
                    {!lbl&&<div style={{fontSize:11,color:"#9ca3af",marginTop:4}}>Even — no strokes</div>}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  // ── RESULTS ────────────────────────────────────────────────────────────────
  const RoundsView = () => (
    <div>
      {data.rounds.length===0&&<div style={{...s.card,color:"#9ca3af",fontSize:13}}>No rounds recorded yet.</div>}
      {data.rounds.map(round=>{
        const info=roundInfo[round.number]||{};
        return (
          <div key={round.id} style={s.card}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div>
                <span style={{fontWeight:700,fontSize:15}}>Round {round.number}</span>
                <span style={{...s.pill("#6b7280"),marginLeft:8}}>{round.type==="scramble5"?"4-Man Scramble":"Standard"}</span>
                {round.completed&&<span style={{...s.pill("#16a34a"),marginLeft:6}}>✓</span>}
                {info.course&&info.course!=="TBD"&&<div style={{fontSize:13,color:"#6b7280",marginTop:4}}>📍 {info.course}</div>}
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:12,color:"#9ca3af"}}>{round.date||"Date TBD"}</div>
                {info.ctpHole&&<div style={{fontSize:12,color:"#6b7280",marginTop:2}}>CTP: Hole {info.ctpHole}</div>}
              </div>
            </div>
            {(round.subs||[]).length>0&&<div style={{fontSize:12,color:"#7c3aed",marginBottom:8}}>Subs: {round.subs.map(s=>`${s.name} (for ${playerById[s.replacesId]?.name||"?"})`).join(", ")}</div>}
            {round.type==="scramble5"?(
              <div style={{fontSize:13}}>{round.completed?round.winner?<div>🏆 <b style={{color:teamById[round.winner]?.color}}>{teamById[round.winner]?.name}</b> wins (+5 pts)</div>:<div>Tie — {(round.tiedTeams||[]).map(tid=>teamById[tid]?.name).join(" & ")}</div>:<div style={{color:"#9ca3af"}}>Pending</div>}</div>
            ):(round.matches||[]).map((m,mi)=>(
              <div key={mi} style={{fontSize:13,padding:"5px 0",borderBottom:"1px solid #f9fafb",color:"#374151"}}>
                {m.type==="front9"&&<span>🏌️ <b>{teamById[m.team1]?.name}</b> vs <b>{teamById[m.team2]?.name}</b> ({m.format||"?"}): {m.result==="win"?<b style={{color:teamById[m.winTeam]?.color}}>{teamById[m.winTeam]?.name} wins</b>:m.result==="halve"?"Halved":<span style={{color:"#9ca3af"}}>Pending</span>}</span>}
                {m.type==="back9"&&<span>🎯 <b>{resolvePlayer(m.player1,round.subs)?.name||"?"}</b> vs <b>{resolvePlayer(m.player2,round.subs)?.name||"?"}</b>: {m.result==="win"?<b>{resolvePlayer(m.winPlayer,round.subs)?.name} wins</b>:m.result==="halve"?"Halved":<span style={{color:"#9ca3af"}}>Pending</span>}</span>}
                {m.type==="ctp"&&<span>📍 CTP: {m.winPlayer?<b>{resolvePlayer(m.winPlayer,round.subs)?.name}</b>:<span style={{color:"#9ca3af"}}>Pending</span>}</span>}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );

  // ── ROUND EDITOR ───────────────────────────────────────────────────────────
  const RoundEditor = ({round, onClose}) => {
    const [r, setR]           = useState(JSON.parse(JSON.stringify(round)));
    const [localInfo, setLI]  = useState({ course:roundInfo[round.number]?.course||"TBD", ctpHole:roundInfo[round.number]?.ctpHole||"" });
    const [subs, setSubs]     = useState(round.subs||[]);
    const [newSub, setNewSub] = useState({ name:"", teamId:"tA", handicap:"", replacesId:"" });
    const sched = SCHEDULE.find(x=>x.number===round.number);
    const [schedDraft, setSchedDraft] = useState(JSON.parse(JSON.stringify(sched?.foursomes||[])));

    const upd = (i,f,v) => { const ms=[...(r.matches||[])]; ms[i]={...ms[i],[f]:v}; setR({...r,matches:ms}); };

    useEffect(()=>{
      if((r.matches||[]).length===0&&sched&&sched.type!=="scramble5"){
        const matches=[];
        sched.foursomes.forEach(fg=>{
          const all=fg.front.map(id=>playerById[id]).filter(Boolean);
          const t1=all.filter(p=>p.teamId===fg.teamA).map(p=>p.id);
          const t2=all.filter(p=>p.teamId===fg.teamB).map(p=>p.id);
          matches.push({type:"front9",format:"Scramble",team1:fg.teamA,team2:fg.teamB,team1Players:t1,team2Players:t2,result:"",winTeam:"",winPlayers:[]});
          fg.back.forEach(([p1,p2])=>{
            const pp1=playerById[p1],pp2=playerById[p2];
            matches.push({type:"back9",player1:p1,player2:p2,team1:pp1?.teamId||"",team2:pp2?.teamId||"",result:"",winPlayer:"",winTeam:""});
          });
        });
        matches.push({type:"ctp",winPlayer:"",winTeam:""});
        setR(prev=>({...prev,matches}));
      }
    },[]);

    const allPlayers=[...data.players,...subs.map(s=>({id:s.subId,name:`${s.name} (sub)`,teamId:s.teamId}))];
    const pOpts=allPlayers.map(p=><option key={p.id} value={p.id}>{p.name} ({teamById[p.teamId]?.name})</option>);
    const tOpts=data.teams.map(t=><option key={t.id} value={t.id}>{t.name}</option>);

    const addSub=()=>{
      if(!newSub.name.trim()||!newSub.replacesId) return;
      const subId="sub_"+Date.now();
      const sub={subId,name:newSub.name.trim(),teamId:newSub.teamId,handicap:Number(newSub.handicap)||0,replacesId:newSub.replacesId};
      setSubs([...subs,sub]);
      const rep=pid=>pid===sub.replacesId?subId:pid;
      const updated=(r.matches||[]).map(m=>{
        if(m.type==="front9") return {...m,team1Players:(m.team1Players||[]).map(rep),team2Players:(m.team2Players||[]).map(rep),winPlayers:(m.winPlayers||[]).map(rep)};
        if(m.type==="back9") return {...m,player1:rep(m.player1),player2:rep(m.player2),winPlayer:rep(m.winPlayer)};
        if(m.type==="ctp") return {...m,winPlayer:rep(m.winPlayer)};
        return m;
      });
      setR(prev=>({...prev,matches:updated}));
      setNewSub({name:"",teamId:"tA",handicap:"",replacesId:""});
    };

    const removeSub=subId=>{
      const sub=subs.find(s=>s.subId===subId); if(!sub) return;
      setSubs(subs.filter(s=>s.subId!==subId));
      const rev=pid=>pid===subId?sub.replacesId:pid;
      const updated=(r.matches||[]).map(m=>{
        if(m.type==="front9") return {...m,team1Players:(m.team1Players||[]).map(rev),team2Players:(m.team2Players||[]).map(rev),winPlayers:(m.winPlayers||[]).map(rev)};
        if(m.type==="back9") return {...m,player1:rev(m.player1),player2:rev(m.player2),winPlayer:rev(m.winPlayer)};
        if(m.type==="ctp") return {...m,winPlayer:rev(m.winPlayer)};
        return m;
      });
      setR(prev=>({...prev,matches:updated}));
    };

    const handleSave=completed=>{
      const newInfo={...roundInfo,[round.number]:localInfo};
      const newOv={...(data.scheduleOverrides||{}),[round.number]:{foursomes:schedDraft}};
      const updated={...r,subs,completed};
      const exists=data.rounds.find(x=>x.number===r.number);
      const rounds=exists?data.rounds.map(x=>x.number===r.number?updated:x):[...data.rounds,updated];
      persist({...data,rounds,roundInfo:newInfo,scheduleOverrides:newOv});
      onClose();
    };

    const updSF=(fi,pi,v)=>{ const d=JSON.parse(JSON.stringify(schedDraft)); d[fi].front[pi]=v; setSchedDraft(d); };
    const updSB=(fi,bi,pi,v)=>{ const d=JSON.parse(JSON.stringify(schedDraft)); d[fi].back[bi][pi]=v; setSchedDraft(d); };

    return (
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:100,overflowY:"auto",display:"flex",justifyContent:"center",padding:"16px 8px"}}>
        <div style={{background:"#fff",borderRadius:14,padding:18,width:"100%",maxWidth:560,alignSelf:"flex-start"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontWeight:700,fontSize:16}}>Round {r.number}</div>
            <button style={s.btn("secondary")} onClick={onClose}>✕</button>
          </div>

          {/* Round details */}
          <div style={{background:"#f9fafb",borderRadius:10,padding:12,marginBottom:12}}>
            <div style={{fontWeight:600,fontSize:13,marginBottom:10}}>📋 Round Details</div>
            <div style={{...s.row,marginBottom:8}}><label style={{fontSize:12,color:"#6b7280",width:70,flexShrink:0}}>Course</label><input style={s.inp} value={localInfo.course} onChange={e=>setLI({...localInfo,course:e.target.value})} /></div>
            <div style={{...s.row,marginBottom:8}}><label style={{fontSize:12,color:"#6b7280",width:70,flexShrink:0}}>Date</label><input type="date" style={s.inp} value={r.date||""} onChange={e=>setR({...r,date:e.target.value})} /></div>
            <div style={s.row}><label style={{fontSize:12,color:"#6b7280",width:70,flexShrink:0}}>CTP hole</label><input type="number" min="1" max="18" style={{...s.inp,width:80}} value={localInfo.ctpHole} onChange={e=>setLI({...localInfo,ctpHole:e.target.value})} /></div>
          </div>

          {/* Subs */}
          {r.type!=="scramble5"&&(
            <div style={{background:"#faf5ff",borderRadius:10,padding:12,marginBottom:12}}>
              <div style={{fontWeight:600,fontSize:13,marginBottom:10}}>🔄 Substitute Players</div>
              {subs.map(sub=>(
                <div key={sub.subId} style={{...s.row,marginBottom:6,justifyContent:"space-between"}}>
                  <span style={{fontSize:13}}><b>{sub.name}</b> for {playerById[sub.replacesId]?.name||"?"} — hcp {sub.handicap} — <span style={s.pill(teamById[sub.teamId]?.color||"#888")}>{teamById[sub.teamId]?.name}</span></span>
                  <button style={{...s.btn("danger"),padding:"2px 8px",fontSize:11}} onClick={()=>removeSub(sub.subId)}>✕</button>
                </div>
              ))}
              <div style={{fontSize:12,color:"#6b7280",marginTop:8,marginBottom:6}}>Add substitute:</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                <input style={{...s.inp,width:110}} placeholder="Sub name" value={newSub.name} onChange={e=>setNewSub({...newSub,name:e.target.value})} />
                <select style={{...s.inp,width:90}} value={newSub.teamId} onChange={e=>setNewSub({...newSub,teamId:e.target.value})}>{tOpts}</select>
                <input type="number" style={{...s.inp,width:60}} placeholder="Hcp" value={newSub.handicap} onChange={e=>setNewSub({...newSub,handicap:e.target.value})} />
                <select style={{...s.inp,flex:1}} value={newSub.replacesId} onChange={e=>setNewSub({...newSub,replacesId:e.target.value})}>
                  <option value="">Replaces...</option>
                  {data.players.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <button style={s.btn("primary")} onClick={addSub}>Add</button>
              </div>
            </div>
          )}

          {/* Schedule override */}
          {r.type!=="scramble5"&&(
            <div style={{background:"#f0f9ff",borderRadius:10,padding:12,marginBottom:12}}>
              <div style={{fontWeight:600,fontSize:13,marginBottom:10}}>📅 Adjust Matchups</div>
              {schedDraft.map((fg,fi)=>(
                <div key={fi} style={{marginBottom:12,paddingBottom:12,borderBottom:fi<schedDraft.length-1?"1px solid #e0f2fe":""}}>
                  <div style={{fontSize:12,fontWeight:600,color:"#0369a1",marginBottom:6}}>Foursome {fi+1}</div>
                  <div style={{fontSize:11,color:"#6b7280",marginBottom:4}}>Front 9 players:</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:6}}>
                    {[0,1,2,3].map(pi=>(
                      <select key={pi} style={{...s.inp,width:"calc(50% - 4px)",fontSize:12,padding:"4px 6px"}} value={fg.front[pi]||""} onChange={e=>updSF(fi,pi,e.target.value)}>
                        <option value="">Select</option>
                        {data.players.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    ))}
                  </div>
                  {fg.back.map((pair,bi)=>(
                    <div key={bi} style={{...s.row,marginBottom:4}}>
                      <span style={{fontSize:11,color:"#6b7280",width:50,flexShrink:0}}>1v1 {bi+1}:</span>
                      {[0,1].map(pi=>(
                        <select key={pi} style={{...s.inp,fontSize:12,padding:"4px 6px"}} value={pair[pi]||""} onChange={e=>updSB(fi,bi,pi,e.target.value)}>
                          <option value="">Select</option>
                          {data.players.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Results */}
          {r.type==="scramble5"?(
            <div style={{marginBottom:12}}>
              <div style={{fontWeight:600,fontSize:13,marginBottom:10}}>Results</div>
              {data.teams.map(t=>(
                <div key={t.id} style={{...s.row,marginBottom:8}}>
                  <span style={{...s.pill(t.color),width:70,textAlign:"center"}}>{t.name}</span>
                  <input style={s.inp} placeholder="Score" type="number" value={r.teamScores?.[t.id]||""} onChange={e=>setR({...r,teamScores:{...(r.teamScores||{}),[t.id]:e.target.value}})} />
                </div>
              ))}
              <div style={{...s.row,marginBottom:8}}>
                <label style={{fontSize:13,width:55}}>Result</label>
                <select style={s.inp} value={r.tieScramble?"tie":"win"} onChange={e=>setR({...r,tieScramble:e.target.value==="tie",winner:"",tiedTeams:[]})}><option value="win">Winner</option><option value="tie">Tie</option></select>
              </div>
              {!r.tieScramble
                ?<div style={{...s.row,marginBottom:8}}><label style={{fontSize:13,width:55}}>Winner</label><select style={s.inp} value={r.winner||""} onChange={e=>setR({...r,winner:e.target.value})}><option value="">Select</option>{tOpts}</select></div>
                :<div style={{marginBottom:8}}>{data.teams.map(t=><label key={t.id} style={{display:"flex",alignItems:"center",gap:6,fontSize:13,marginTop:4}}><input type="checkbox" checked={(r.tiedTeams||[]).includes(t.id)} onChange={e=>{const a=r.tiedTeams||[];setR({...r,tiedTeams:e.target.checked?[...a,t.id]:a.filter(x=>x!==t.id)});}} />{t.name}</label>)}</div>}
              {r.winner&&<div><label style={{fontSize:13,fontWeight:600}}>Winning players (MVP):</label>{data.players.filter(p=>p.teamId===r.winner).map(p=><label key={p.id} style={{display:"flex",alignItems:"center",gap:6,fontSize:13,marginTop:4}}><input type="checkbox" checked={(r.winnerPlayers||[]).includes(p.id)} onChange={e=>{const a=r.winnerPlayers||[];setR({...r,winnerPlayers:e.target.checked?[...a,p.id]:a.filter(x=>x!==p.id)});}} />{p.name}</label>)}</div>}
            </div>
          ):(r.matches||[]).map((m,i)=>(
            <div key={i} style={{background:"#f9fafb",borderRadius:10,padding:12,marginBottom:10}}>
              {m.type==="front9"&&<>
                <div style={{fontWeight:600,fontSize:13,marginBottom:8}}>🏌️ Front 9: <span style={{color:teamById[m.team1]?.color}}>{teamById[m.team1]?.name}</span> vs <span style={{color:teamById[m.team2]?.color}}>{teamById[m.team2]?.name}</span></div>
                <div style={{...s.row,marginBottom:6}}><label style={{fontSize:12,width:55}}>Format</label><select style={s.inp} value={m.format||"Scramble"} onChange={e=>upd(i,"format",e.target.value)}>{FORMATS.map(f=><option key={f}>{f}</option>)}</select></div>
                <div style={{...s.row,marginBottom:6}}><label style={{fontSize:12,width:55}}>Result</label><select style={s.inp} value={m.result||""} onChange={e=>upd(i,"result",e.target.value)}><option value="">Pending</option><option value="win">Win</option><option value="halve">Halve</option></select></div>
                {m.result==="win"&&<div style={s.row}><label style={{fontSize:12,width:55}}>Winner</label><select style={s.inp} value={m.winTeam||""} onChange={e=>{const tid=e.target.value;const side=tid===m.team1?"team1Players":"team2Players";const ms=[...(r.matches||[])];ms[i]={...ms[i],winTeam:tid,winPlayers:ms[i][side]||[]};setR({...r,matches:ms});}}><option value="">Select</option>{tOpts}</select></div>}
              </>}
              {m.type==="back9"&&<>
                <div style={{fontWeight:600,fontSize:13,marginBottom:8}}>🎯 Back 9: <b>{resolvePlayer(m.player1,subs)?.name||"?"}</b> vs <b>{resolvePlayer(m.player2,subs)?.name||"?"}</b></div>
                <div style={{...s.row,marginBottom:6}}><label style={{fontSize:12,width:55}}>Result</label><select style={s.inp} value={m.result||""} onChange={e=>upd(i,"result",e.target.value)}><option value="">Pending</option><option value="win">Win</option><option value="halve">Halve</option></select></div>
                {m.result==="win"&&<div style={s.row}><label style={{fontSize:12,width:55}}>Winner</label><select style={s.inp} value={m.winPlayer||""} onChange={e=>{const pid=e.target.value;const p=resolvePlayer(pid,subs)||playerById[pid];const ms=[...(r.matches||[])];ms[i]={...ms[i],winPlayer:pid,winTeam:p?.teamId||""};setR({...r,matches:ms});}}><option value="">Select</option>{pOpts}</select></div>}
              </>}
              {m.type==="ctp"&&<>
                <div style={{fontWeight:600,fontSize:13,marginBottom:8}}>📍 Closest to Pin</div>
                <div style={s.row}><label style={{fontSize:12,width:55}}>Winner</label><select style={s.inp} value={m.winPlayer||""} onChange={e=>{const pid=e.target.value;const p=resolvePlayer(pid,subs)||playerById[pid];const ms=[...(r.matches||[])];ms[i]={...ms[i],winPlayer:pid,winTeam:p?.teamId||""};setR({...r,matches:ms});}}><option value="">Select player</option>{pOpts}</select></div>
              </>}
            </div>
          ))}

          <div style={{...s.row,justifyContent:"flex-end",gap:8,marginTop:12}}>
            <button style={s.btn("secondary")} onClick={()=>handleSave(false)}>Save Draft</button>
            <button style={s.btn("primary")} onClick={()=>handleSave(true)}>✓ Mark Complete</button>
          </div>
        </div>
      </div>
    );
  };

  // ── HANDICAP EDITOR ────────────────────────────────────────────────────────
  const HandicapEditor = () => {
    const [draft, setDraft] = useState(Object.fromEntries(data.players.map(p=>[p.id,p.handicap])));
    const save = () => { persist({...data,players:data.players.map(p=>({...p,handicap:Number(draft[p.id])||p.handicap}))}); setHcpEdit(false); };
    return (
      <div style={s.card}>
        <div style={s.sec}>✏️ Update Handicaps</div>
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

  // ── ADMIN ──────────────────────────────────────────────────────────────────
  const AdminView = () => {
    const getRound = num => data.rounds.find(r=>r.number===num);
    const openRound = num => {
      const sched = SCHEDULE.find(s=>s.number===num);
      const existing = getRound(num);
      setActiveRound(existing||{id:"r"+num,number:num,type:sched.type,date:"",completed:false,matches:[],subs:[]});
    };
    return (
      <div>
        {activeRound&&<RoundEditor round={activeRound} onClose={()=>setActiveRound(null)} />}
        {hcpEdit?<HandicapEditor />:(
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
          <div style={s.sec}>📋 Round Management</div>
          {SCHEDULE.map(sched=>{
            const rd=getRound(sched.number);
            const info=roundInfo[sched.number]||{};
            return (
              <div key={sched.number} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #f3f4f6"}}>
                <div>
                  <span style={{fontWeight:600,fontSize:14}}>Round {sched.number}</span>
                  <span style={{...s.pill("#6b7280"),marginLeft:8}}>{sched.type==="scramble5"?"Scramble":"Standard"}</span>
                  {rd?.completed&&<span style={{...s.pill("#16a34a"),marginLeft:6}}>✓</span>}
                  {(rd?.subs||[]).length>0&&<span style={{...s.pill("#7c3aed"),marginLeft:6}}>{rd.subs.length} sub{rd.subs.length!==1?"s":""}</span>}
                  {info.course&&info.course!=="TBD"&&<span style={{fontSize:12,color:"#9ca3af",marginLeft:8}}>{info.course}</span>}
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
    ...(isAdmin?[{id:"admin",label:"⚙️ Admin"}]:[{id:"login",label:"🔐 Admin"}]),
  ];

  return (
    <div style={s.wrap}>
      <div style={s.hdr}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontSize:22,fontWeight:700,margin:0}}>⛳ Golf League</div>
            <div style={{fontSize:12,opacity:0.75,marginTop:2}}>{data.rounds.filter(r=>r.completed).length}/6 rounds complete</div>
          </div>
          {saveStatus&&(
            <div style={{fontSize:12,padding:"4px 10px",borderRadius:20,marginTop:4,background:saveStatus==="saved"?"#16a34a":saveStatus==="error"?"#dc2626":"rgba(255,255,255,0.3)",color:"#fff",fontWeight:600}}>
              {saveStatus==="saving"?"Saving...":saveStatus==="saved"?"✓ Saved":"✕ Save failed — retry"}
            </div>
          )}
        </div>
        <div style={s.tabs}>{tabs.map(t=><button key={t.id} style={s.tab(view===t.id)} onClick={()=>setView(t.id)}>{t.label}</button>)}</div>
      </div>
      <div style={s.body}>
        {view==="standings"&&<StandingsView />}
        {view==="schedule" &&<ScheduleView />}
        {view==="rounds"   &&<RoundsView />}
        {view==="admin"&&isAdmin&&<AdminView />}
        {view==="login"&&!isAdmin&&(
          <div style={s.card}>
            <div style={s.sec}>Admin Login</div>
            <div style={{...s.row,marginBottom:8}}>
              <input style={s.inp} type="password" placeholder="Enter PIN" value={pinInput} onChange={e=>setPinInput(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"){if(pinInput===ADMIN_PIN){setIsAdmin(true);setPinError(false);setView("admin");}else setPinError(true);}}} />
              <button style={s.btn("primary")} onClick={()=>{if(pinInput===ADMIN_PIN){setIsAdmin(true);setPinError(false);setView("admin");}else setPinError(true);}}>Login</button>
            </div>
            {pinError&&<div style={{color:"#dc2626",fontSize:13}}>Incorrect PIN</div>}
          </div>
        )}
      </div>
    </div>
  );
}
