import { useState, useEffect, useRef } from "react";

// ── Brand tokens (exact from brand-kit-v2) ───────────────────────────────────
const T = {
  navyDark:   "#080B3A",
  navy:       "#0E1260",
  navyMid:    "#1A2280",
  red:        "#E82030",
  redDeep:    "#B81828",
  ballPink:   "#D42080",
  ballMid:    "#B0245C",
  ballPurple: "#8B1FA2",
  batBlue:    "#4A52B8",
  batLight:   "#6870CC",
  border:     "#3A3B8E",
  textNavy:   "#1C1E6E",
  grayMid:    "#8A8EBB",
  grayDark:   "#2E3160",
  white:      "#FFFFFF",
  offWhite:   "#F4F5FA",
};

// ── Data ─────────────────────────────────────────────────────────────────────
const PLAYERS = [
  { id:1,  name:"DEEPEN",   team:"PM MAVERICK", avg:180, hss:400, hgs:230, handicap:0, lastWk:10, wk10:349, wk9:374, games:20, improved:17.75, g1:162, g2:200 },
  { id:2,  name:"PARTH",    team:"PLAYMASTERS", avg:180, hss:429, hgs:237, handicap:0, lastWk:10, wk10:429, wk9:335, games:14, improved:9.07,  g1:183, g2:199 },
  { id:3,  name:"NIHIL",    team:"4BAGGERZ",    avg:179, hss:390, hgs:210, handicap:0, lastWk:10, wk10:355, wk9:388, games:20, improved:13.35, g1:176, g2:178 },
  { id:4,  name:"BISMARK",  team:"AMIGOS",      avg:179, hss:408, hgs:235, handicap:0, lastWk:10, wk10:328, wk9:408, games:16, improved:4.18,  g1:175, g2:175 },
  { id:5,  name:"HIREN",    team:"PLAYMASTERS", avg:174, hss:389, hgs:217, handicap:0, lastWk:10, wk10:344, wk9:389, games:18, improved:11.11, g1:180, g2:187 },
  { id:6,  name:"IAN",      team:"PM MAVERICK", avg:174, hss:357, hgs:202, handicap:0, lastWk:10, wk10:296, wk9:357, games:4,  improved:23.37, g1:175, g2:152 },
  { id:7,  name:"SAAGAR",   team:"4BAGGERZ",    avg:174, hss:397, hgs:220, handicap:0, lastWk:10, wk10:363, wk9:361, games:16, improved:null,  g1:178, g2:184 },
  { id:8,  name:"HARSH",    team:"4BAGGERZ",    avg:174, hss:444, hgs:222, handicap:0, lastWk:10, wk10:444, wk9:369, games:16, improved:17.31, g1:171, g2:224 },
  { id:9,  name:"JOE",      team:"AMIGOS",      avg:172, hss:385, hgs:213, handicap:0, lastWk:10, wk10:304, wk9:377, games:16, improved:1.85,  g1:172, g2:172 },
  { id:10, name:"SURESH",   team:"PLAYMASTERS", avg:168, hss:417, hgs:227, handicap:0, lastWk:10, wk10:364, wk9:417, games:16, improved:null,  g1:220, g2:171 },
  { id:11, name:"RAHUL",    team:"PM MAVERICK", avg:167, hss:384, hgs:235, handicap:0, lastWk:10, wk10:330, wk9:353, games:18, improved:null,  g1:151, g2:191 },
  { id:12, name:"JAMES",    team:"PLAYMASTERS", avg:168, hss:392, hgs:210, handicap:0, lastWk:0,  wk10:0,   wk9:392, games:12, improved:null,  g1:null, g2:null },
  { id:13, name:"IAN",      team:"PM RISING",   avg:174, hss:403, hgs:221, handicap:0, lastWk:0,  wk10:0,   wk9:403, games:16, improved:null,  g1:null, g2:null },
  { id:14, name:"DOROTHY",  team:"PM RISING",   avg:160, hss:381, hgs:224, handicap:0, lastWk:10, wk10:281, wk9:313, games:20, improved:null,  g1:158, g2:139, gender:"F" },
  { id:15, name:"DUFLA",    team:"AMIGOS",      avg:177, hss:400, hgs:218, handicap:0, lastWk:10, wk10:379, wk9:374, games:20, improved:31.85, g1:178, g2:198 },
  { id:16, name:"MANDELA",  team:"PM MAVERICK", avg:163, hss:361, hgs:185, handicap:0, lastWk:10, wk10:325, wk9:361, games:16, improved:7.56,  g1:185, g2:140 },
];

const MON_STANDINGS = [
  { rank:1, name:"PLAYMASTERS",          w:26, l:4,  pins:13700, hgs:806, hss:1498, pts:52 },
  { rank:2, name:"AMIGOS SEGUNDO",       w:24, l:6,  pins:13649, hgs:750, hss:1486, pts:48 },
  { rank:3, name:"4BAGGERZ NATION",      w:20, l:10, pins:13814, hgs:804, hss:1522, pts:40 },
  { rank:4, name:"PLAYMASTERS MAVERICK", w:19, l:11, pins:13190, hgs:739, hss:1383, pts:38 },
  { rank:5, name:"PLAYMASTERS RISING",   w:12, l:18, pins:12512, hgs:739, hss:1361, pts:24 },
  { rank:6, name:"BALLBARIANS STRIKERS", w:8,  l:22, pins:12211, hgs:758, hss:1431, pts:16 },
  { rank:7, name:"MAHADEV STRIKERS",     w:8,  l:22, pins:11825, hgs:661, hss:1254, pts:16 },
  { rank:8, name:"NDOVU STRIKERS",       w:3,  l:27, pins:11056, hgs:645, hss:1181, pts:6  },
];

const TUE_STANDINGS = [
  { rank:1, name:"EASTLINE STARS",       w:22, l:8,  pins:13608, hgs:840, hss:1532, pts:44 },
  { rank:2, name:"AMIGOS ESTRELLA",      w:22, l:5,  pins:12265, hgs:774, hss:1437, pts:44 },
  { rank:3, name:"THE UNBOWLIVABLES",    w:20, l:10, pins:13416, hgs:778, hss:1487, pts:40 },
  { rank:4, name:"254 BOWLERS",          w:19, l:11, pins:13447, hgs:772, hss:1486, pts:38 },
  { rank:5, name:"NOISY KINGS",          w:16, l:14, pins:13259, hgs:786, hss:1521, pts:32 },
  { rank:6, name:"UNBOWLIVABLE STRIK",   w:8,  l:19, pins:10912, hgs:731, hss:1325, pts:16 },
  { rank:7, name:"TEAM 55",              w:4,  l:20, pins:9165,  hgs:687, hss:1244, pts:8  },
  { rank:8, name:"AMIGOS SENORAS",       w:3,  l:27, pins:11381, hgs:684, hss:1278, pts:6  },
];

const OVERPERFORMERS_MON = [
  { name:"DUFLA",  team:"AMIGOS SEGUNDO",    delta:"+31.85", avg:177 },
  { name:"IAN",    team:"PLAYMASTERS MAVERICK", delta:"+23.37", avg:174 },
  { name:"JOSLINE",team:"4BAGGERZ NATION",   delta:"+22.56", avg:172 },
  { name:"DEEPEN", team:"PLAYMASTERS MAV.",  delta:"+17.75", avg:180 },
  { name:"HARSH",  team:"4BAGGERZ NATION",   delta:"+17.31", avg:174 },
];

const WOMEN_MON = [
  { name:"DOROTHY", team:"PLAYMASTERS RISING", avg:159 },
  { name:"DARSHI",  team:"PLAYMASTERS MAV.",   avg:138 },
];
const WOMEN_TUE = [
  { name:"SONIKA",  team:"AMIGOS SENORAS",   avg:156 },
  { name:"JUSTINE", team:"AMIGOS SENORAS",   avg:146 },
  { name:"ROSE",    team:"AMIGOS SENORAS",   avg:143 },
  { name:"NILMA",   team:"UNBOWLIVABLE STR.",avg:135 },
  { name:"DARSHI",  team:"PLAYMASTERS MAV.", avg:138 },
  { name:"DASHNI",  team:"AMIGOS SENORAS",   avg:134 },
  { name:"AMRIT",   team:"AMIGOS SENORAS",   avg:133 },
];

// frame heatmap data (simulated from known averages)
function makeHeatmap(avg) {
  return Array.from({length:10}, (_,f) =>
    Array.from({length:4}, () => {
      const base = avg / 10;
      const v = Math.max(0, Math.min(30, Math.round(base + (Math.random()-0.5)*8)));
      return v;
    })
  );
}

// ── Hooks ─────────────────────────────────────────────────────────────────────
function useCounter(target, duration=1200, trigger=true) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, trigger]);
  return val;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function LiveDot() {
  return (
    <span style={{display:"inline-flex",alignItems:"center",gap:6}}>
      <span style={{
        width:8,height:8,borderRadius:"50%",
        background:T.ballPink,
        boxShadow:`0 0 0 0 ${T.ballPink}`,
        animation:"livePulse 2s ease-in-out infinite",
        display:"inline-block"
      }}/>
      <span style={{fontFamily:"'Teko',sans-serif",fontSize:12,letterSpacing:3,textTransform:"uppercase",color:T.ballPink}}>LIVE</span>
    </span>
  );
}

function StatBadge({label, value, highlight=false, size="md"}) {
  const fontSize = size === "lg" ? 42 : size === "sm" ? 20 : 30;
  const padding = size === "lg" ? "20px 24px" : "12px 16px";
  return (
    <div style={{
      background: highlight ? `linear-gradient(135deg,${T.ballPurple},${T.ballPink})` : `rgba(255,255,255,0.04)`,
      border: `1px solid ${highlight ? "transparent" : "rgba(255,255,255,0.07)"}`,
      borderTop: highlight ? "none" : `3px solid ${T.red}`,
      borderRadius:6, padding, minWidth:100, flex:1,
    }}>
      <div style={{fontFamily:"'Anton',Impact,sans-serif",fontSize,color:highlight?T.white:T.ballPink,lineHeight:1}}>{value}</div>
      <div style={{fontFamily:"'Teko',sans-serif",fontSize:11,letterSpacing:2,textTransform:"uppercase",color:T.grayMid,marginTop:4}}>{label}</div>
    </div>
  );
}

function SectionLabel({children}) {
  return <div style={{fontFamily:"'Teko',sans-serif",fontSize:11,fontWeight:600,letterSpacing:4,textTransform:"uppercase",color:T.red,marginBottom:6}}>{children}</div>;
}
function SectionTitle({children,light=false}) {
  return <div style={{fontFamily:"'Anton',Impact,sans-serif",fontSize:26,textTransform:"uppercase",color:light?T.white:T.navy,letterSpacing:1,marginBottom:4}}>{children}</div>;
}
function SRule() {
  return <div style={{width:32,height:3,background:T.red,marginBottom:20,borderRadius:1}}/>;
}

function Card({children, style={}}) {
  return (
    <div style={{
      background:`rgba(14,18,96,0.55)`,
      border:`1px solid rgba(255,255,255,0.07)`,
      borderRadius:10,
      backdropFilter:"blur(8px)",
      overflow:"hidden",
      ...style
    }}>
      {children}
    </div>
  );
}

function CardHeader({children, accent=T.red}) {
  return (
    <div style={{
      borderBottom:`1px solid rgba(255,255,255,0.07)`,
      borderTop:`3px solid ${accent}`,
      padding:"12px 16px",
      display:"flex",alignItems:"center",gap:8
    }}>
      {children}
    </div>
  );
}

// ── Player Hub ─────────────────────────────────────────────────────────────────
function PlayerHub() {
  const [selected, setSelected] = useState(PLAYERS[0]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(()=>setMounted(true),100); }, []);

  const avgCount   = useCounter(selected.avg, 900, mounted);
  const hssCount   = useCounter(selected.hss, 900, mounted);
  const wk10Count  = useCounter(selected.wk10||0, 900, mounted);

  const heatmap = makeHeatmap(selected.avg);
  const maxCell = 28;

  function cellColor(v) {
    if (v === 0) return "rgba(255,255,255,0.04)";
    const pct = v / maxCell;
    if (pct > 0.85) return T.ballPink;
    if (pct > 0.65) return T.red;
    if (pct > 0.40) return T.batBlue;
    return T.navyMid;
  }

  const g1Avg = selected.g1 || 0;
  const g2Avg = selected.g2 || 0;
  const splitType = (g2Avg - g1Avg) > 12 ? "STRONG FINISHER" : (g2Avg - g1Avg) < -12 ? "STARTER" : "CONSISTENT";
  const splitColor = splitType === "STRONG FINISHER" ? T.ballPink : splitType === "STARTER" ? T.red : T.batLight;

  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 300px",gap:16,padding:"0 0 24px"}}>

      {/* ── LEFT COLUMN ── */}
      <div style={{display:"flex",flexDirection:"column",gap:14}}>

        {/* Active Player Card */}
        <Card>
          <CardHeader accent={T.ballPink}>
            <div style={{fontFamily:"'Teko',sans-serif",fontSize:11,letterSpacing:3,textTransform:"uppercase",color:T.grayMid}}>ACTIVE PROFILE</div>
          </CardHeader>
          <div style={{padding:"16px 18px",display:"flex",alignItems:"center",gap:14}}>
            <div style={{
              width:56,height:56,borderRadius:8,flexShrink:0,
              background:`linear-gradient(135deg,${T.ballPurple},${T.ballPink})`,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontFamily:"'Anton',sans-serif",fontSize:22,color:T.white,
            }}>
              {selected.name.slice(0,2)}
            </div>
            <div>
              <div style={{fontFamily:"'Anton',sans-serif",fontSize:28,textTransform:"uppercase",color:T.white,lineHeight:1}}>{selected.name}</div>
              <div style={{fontFamily:"'Teko',sans-serif",fontSize:13,letterSpacing:2,textTransform:"uppercase",color:T.batLight,marginTop:2}}>{selected.team}</div>
            </div>
            {selected.improved && (
              <div style={{marginLeft:"auto",background:`rgba(${parseInt(T.ballPink.slice(1,3),16)},${parseInt(T.ballPink.slice(3,5),16)},${parseInt(T.ballPink.slice(5,7),16)},0.15)`,
                border:`1px solid ${T.ballPink}`,borderRadius:4,padding:"4px 10px",textAlign:"center"}}>
                <div style={{fontFamily:"'Anton',sans-serif",fontSize:18,color:T.ballPink}}>+{selected.improved}</div>
                <div style={{fontFamily:"'Teko',sans-serif",fontSize:10,letterSpacing:1,textTransform:"uppercase",color:T.grayMid}}>IMPROVED</div>
              </div>
            )}
          </div>
        </Card>

        {/* Focus Engine */}
        <Card style={{flex:1}}>
          <CardHeader accent={T.red}>
            <span style={{fontSize:14}}>⚡</span>
            <span style={{fontFamily:"'Anton',sans-serif",fontSize:16,color:T.white,letterSpacing:1}}>FOCUS ENGINE</span>
            <div style={{marginLeft:"auto"}}>
              <select
                value={selected.id}
                onChange={e => { const p = PLAYERS.find(x=>x.id===+e.target.value); if(p){setSelected(p);setMounted(false);setTimeout(()=>setMounted(true),50);}}}
                style={{background:T.navyDark,color:T.white,border:`1px solid ${T.border}`,borderRadius:4,padding:"4px 10px",
                  fontFamily:"'Teko',sans-serif",fontSize:14,letterSpacing:1,cursor:"pointer"}}
              >
                {PLAYERS.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </CardHeader>
          <div style={{padding:"18px",display:"flex",gap:10}}>
            <StatBadge label="Average"    value={avgCount}  size="lg" />
            <StatBadge label="High Series" value={hssCount} size="lg" highlight />
            <StatBadge label="Handicap"   value={selected.handicap} size="lg" />
            <StatBadge label="Last Week"  value={selected.lastWk}   size="lg" />
          </div>

          {/* Game split bar */}
          <div style={{padding:"0 18px 18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontFamily:"'Teko',sans-serif",fontSize:12,letterSpacing:3,textTransform:"uppercase",color:T.grayMid}}>G1 VS G2 SPLIT</div>
              <div style={{background:`rgba(255,255,255,0.05)`,border:`1px solid ${splitColor}`,borderRadius:3,padding:"2px 10px",
                fontFamily:"'Teko',sans-serif",fontSize:11,letterSpacing:2,textTransform:"uppercase",color:splitColor}}>{splitType}</div>
            </div>
            <div style={{display:"flex",gap:10,alignItems:"flex-end",height:52}}>
              {["G1","G2"].map((label,i)=>{
                const val = i===0?g1Avg:g2Avg;
                const pct = Math.max(10,((val-130)/80)*100);
                const col = i===0 ? T.batBlue : (g2Avg>g1Avg ? T.ballPink : T.red);
                return (
                  <div key={label} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                    <div style={{fontFamily:"'Anton',sans-serif",fontSize:14,color:col}}>{val||"—"}</div>
                    <div style={{width:"100%",borderRadius:3,background:col,transition:"height 0.8s ease",height:`${pct}%`}}/>
                    <div style={{fontFamily:"'Teko',sans-serif",fontSize:10,letterSpacing:2,color:T.grayMid}}>{label}</div>
                  </div>
                );
              })}
              <div style={{flex:2,display:"flex",flexDirection:"column",gap:4,paddingBottom:18}}>
                {[
                  ["Wk10 Series", selected.wk10||"—", T.white],
                  ["Wk9 Series",  selected.wk9||"—",  T.grayMid],
                  ["Games",       selected.games,      T.batLight],
                ].map(([lbl,val,col])=>(
                  <div key={lbl} style={{display:"flex",justifyContent:"space-between",borderBottom:`1px solid rgba(255,255,255,0.06)`,paddingBottom:3}}>
                    <span style={{fontFamily:"'Teko',sans-serif",fontSize:12,letterSpacing:1,textTransform:"uppercase",color:T.grayMid}}>{lbl}</span>
                    <span style={{fontFamily:"'Anton',sans-serif",fontSize:14,color:col}}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ── CENTRE COLUMN: Heatmap ── */}
      <Card>
        <CardHeader accent={T.ballPurple}>
          <span style={{fontSize:14}}>🔥</span>
          <span style={{fontFamily:"'Anton',sans-serif",fontSize:16,color:T.white,letterSpacing:1}}>FRAME CONSISTENCY HEATMAP</span>
        </CardHeader>
        <div style={{padding:"14px 16px"}}>
          {/* Column labels */}
          <div style={{display:"grid",gridTemplateColumns:"22px repeat(10,1fr)",gap:3,marginBottom:6}}>
            <div/>
            {Array.from({length:10},(_,i)=>(
              <div key={i} style={{fontFamily:"'Teko',sans-serif",fontSize:10,letterSpacing:1,textAlign:"center",color:T.grayMid}}>F{i+1}</div>
            ))}
          </div>
          {/* Rows (games) */}
          {heatmap.map((row, gi)=>(
            <div key={gi} style={{display:"grid",gridTemplateColumns:"22px repeat(10,1fr)",gap:3,marginBottom:3}}>
              <div style={{fontFamily:"'Teko',sans-serif",fontSize:10,color:T.grayMid,display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:4}}>G{gi+1}</div>
              {row.map((v,fi)=>(
                <div key={fi} style={{
                  background: cellColor(v),
                  borderRadius:3,
                  aspectRatio:"1",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontFamily:"'Anton',sans-serif",fontSize:10,
                  color: v > 18 ? T.white : "rgba(255,255,255,0.5)",
                  transition:"background 0.3s",
                  cursor:"pointer",
                  minHeight:32,
                }}>{v>0?v:""}</div>
              ))}
            </div>
          ))}
          {/* Legend */}
          <div style={{display:"flex",gap:12,marginTop:14,justifyContent:"center"}}>
            {[[T.navyMid,"Low"],[T.batBlue,"Mid"],[T.red,"High"],[T.ballPink,"Peak"]].map(([c,l])=>(
              <div key={l} style={{display:"flex",alignItems:"center",gap:4}}>
                <div style={{width:10,height:10,borderRadius:2,background:c}}/>
                <span style={{fontFamily:"'Teko',sans-serif",fontSize:10,letterSpacing:1,textTransform:"uppercase",color:T.grayMid}}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* ── RIGHT COLUMN ── */}
      <div style={{display:"flex",flexDirection:"column",gap:14}}>

        {/* Squad Profile */}
        <Card>
          <CardHeader accent={T.batBlue}>
            <span style={{fontFamily:"'Teko',sans-serif",fontSize:11,letterSpacing:3,textTransform:"uppercase",color:T.grayMid}}>SQUAD PROFILE</span>
          </CardHeader>
          <div style={{padding:"12px 14px"}}>
            <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>
              {PLAYERS.slice(0,8).map(p=>(
                <div key={p.id}
                  onClick={()=>{setSelected(p);setMounted(false);setTimeout(()=>setMounted(true),50);}}
                  title={p.name}
                  style={{
                    width:28,height:28,borderRadius:4,cursor:"pointer",
                    background: p.id===selected.id ? `linear-gradient(135deg,${T.ballPurple},${T.ballPink})` : T.navyMid,
                    border: p.id===selected.id ? `2px solid ${T.ballPink}` : `1px solid rgba(255,255,255,0.1)`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontFamily:"'Teko',sans-serif",fontSize:9,color:T.white,letterSpacing:0,
                    transition:"all 0.2s",
                  }}>{p.name.slice(0,2)}</div>
              ))}
            </div>
            <div style={{fontFamily:"'Teko',sans-serif",fontSize:11,letterSpacing:2,textTransform:"uppercase",color:T.grayMid}}>22 ACTIVE PLAYMASTERS</div>
          </div>
        </Card>

        {/* Achievement Unit */}
        <Card style={{flex:1}}>
          <CardHeader accent={T.ballPink}>
            <span style={{fontFamily:"'Teko',sans-serif",fontSize:11,letterSpacing:3,textTransform:"uppercase",color:T.grayMid}}>ACHIEVEMENT UNIT</span>
          </CardHeader>
          <div style={{padding:"14px"}}>
            {[
              {icon:"🎖️", name:"VERIFIED",    sub:"CORE PLAYMASTER",   unlocked:true  },
              {icon:"🏅", name:"SQUAD",        sub:"UNIT MEMBER",       unlocked:true  },
              {icon:"⏳", name:"CHALLENGER",   sub:"SYNC 5 MATCHES",    unlocked:false },
              {icon:"🔥", name:"ON FIRE",       sub:"+20 THIS SEASON",   unlocked: (selected.improved||0)>20 },
              {icon:"⚡", name:"HIGH SERIES",  sub:"BOWLED 400+",        unlocked: selected.hss>=400 },
            ].map(a=>(
              <div key={a.name} style={{
                display:"flex",alignItems:"center",gap:10,
                padding:"8px 10px",borderRadius:6,marginBottom:6,
                background: a.unlocked ? "rgba(212,32,128,0.1)" : "rgba(255,255,255,0.03)",
                border:`1px solid ${a.unlocked ? T.ballMid : "rgba(255,255,255,0.06)"}`,
                opacity: a.unlocked ? 1 : 0.4,
              }}>
                <span style={{fontSize:18}}>{a.icon}</span>
                <div>
                  <div style={{fontFamily:"'Teko',sans-serif",fontSize:13,fontWeight:600,letterSpacing:1,textTransform:"uppercase",color:a.unlocked?T.ballPink:T.grayMid}}>{a.name}</div>
                  <div style={{fontFamily:"'Teko',sans-serif",fontSize:10,letterSpacing:1,textTransform:"uppercase",color:"rgba(138,142,187,0.6)"}}>{a.sub}</div>
                </div>
                {a.unlocked && <div style={{marginLeft:"auto",fontSize:14}}>✓</div>}
              </div>
            ))}
          </div>
        </Card>

        {/* Sync Scores */}
        <Card>
          <CardHeader accent={T.navyMid}>
            <span style={{fontFamily:"'Teko',sans-serif",fontSize:11,letterSpacing:3,textTransform:"uppercase",color:T.grayMid}}>SYNC SCORES</span>
          </CardHeader>
          <div style={{padding:"14px",textAlign:"center"}}>
            <div style={{
              border:`2px dashed rgba(255,255,255,0.12)`,borderRadius:8,
              padding:"20px 14px",
              background:"rgba(255,255,255,0.02)",
            }}>
              <div style={{fontSize:28,marginBottom:8}}>⬆️</div>
              <div style={{fontFamily:"'Teko',sans-serif",fontSize:13,fontWeight:600,letterSpacing:2,textTransform:"uppercase",color:T.batLight}}>SELECT CSV DATA</div>
              <div style={{fontFamily:"'Teko',sans-serif",fontSize:10,letterSpacing:1,color:T.grayMid,marginTop:4}}>Upload from Westgate sessions</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── Competition HQ ─────────────────────────────────────────────────────────────
function CompetitionHQ() {
  const [division, setDivision] = useState("monday");
  const standings = division === "monday" ? MON_STANDINGS : TUE_STANDINGS;
  const overperformers = division === "monday" ? OVERPERFORMERS_MON : [
    {name:"SAM",   team:"AMIGOS ESTRELLA",  delta:"+83", avg:176},
    {name:"HARI",  team:"AMIGOS ESTRELLA",  delta:"+70", avg:185},
    {name:"SAID",  team:"EASTLINE STARS",   delta:"+52", avg:180},
    {name:"SUMANT",team:"TEAM 55",          delta:"+44", avg:148},
    {name:"NILMA", team:"UNBOWLIVABLE STR.",delta:"+44", avg:135},
  ];
  const women = division === "monday" ? WOMEN_MON : WOMEN_TUE;

  const leader = standings[0];
  const topPts = leader.pts;

  const titleRace = standings.slice(0,6).map(t=>({
    ...t,
    maxPts: t.pts + 12,
    gap: topPts - t.pts,
    status: t.pts + 12 >= topPts ? (t.gap <= 2 ? "IN CONTENTION" : t.gap <= 6 ? "POSSIBLE" : "SLIM CHANCE") : "ELIMINATED",
  }));

  // Consistency (simulate stddev from pins)
  const consistTeams = standings.slice(0,4).map(t=>({
    name:t.name,
    variance:Math.round(Math.random()*100+30),
    stddev:Math.round(Math.random()*40+25),
    status:Math.random()>0.5?"VOLATILE":"STABLE",
  }));

  function titleStatusColor(s) {
    if(s==="IN CONTENTION") return T.ballPink;
    if(s==="POSSIBLE") return T.batLight;
    if(s==="SLIM CHANCE") return T.grayMid;
    return "rgba(255,255,255,0.2)";
  }
  function rankColor(r) {
    if(r===1) return T.ballPink;
    if(r===2) return T.batLight;
    if(r===3) return T.batBlue;
    return T.white;
  }
  const isPlaymasters = (name) => name.toUpperCase().includes("PLAYMASTERS");

  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:16,paddingBottom:24}}>
      <div style={{display:"flex",flexDirection:"column",gap:16}}>

        {/* Standings */}
        <Card>
          <CardHeader accent={T.red}>
            <span style={{fontSize:14}}>🏆</span>
            <span style={{fontFamily:"'Anton',sans-serif",fontSize:16,color:T.white,letterSpacing:1}}>DIVISION STANDINGS</span>
          </CardHeader>
          <div style={{padding:"0 6px 6px"}}>
            {/* Header row */}
            <div style={{display:"grid",gridTemplateColumns:"36px 1fr 60px 60px 90px 60px 70px",gap:8,padding:"10px 12px 6px",
              borderBottom:`1px solid rgba(255,255,255,0.07)`}}>
              {["#","TEAM","WON","LOST","PINS","HGS","POINTS"].map(h=>(
                <div key={h} style={{fontFamily:"'Teko',sans-serif",fontSize:10,letterSpacing:2,textTransform:"uppercase",color:T.grayMid}}>{h}</div>
              ))}
            </div>
            {standings.map((t,i)=>(
              <div key={t.name} style={{
                display:"grid",gridTemplateColumns:"36px 1fr 60px 60px 90px 60px 70px",gap:8,
                padding:"10px 12px",
                borderBottom:`1px solid rgba(255,255,255,0.04)`,
                background: isPlaymasters(t.name) ? "rgba(26,34,128,0.4)" : "transparent",
                borderLeft: isPlaymasters(t.name) ? `3px solid ${T.batBlue}` : "3px solid transparent",
                transition:"background 0.2s",
                cursor:"default",
              }}>
                <div style={{fontFamily:"'Anton',sans-serif",fontSize:20,color:rankColor(t.rank)}}>{t.rank}</div>
                <div style={{fontFamily:"'Teko',sans-serif",fontSize:14,fontWeight:600,color:T.white,display:"flex",alignItems:"center",gap:6}}>
                  {t.name}
                  {isPlaymasters(t.name) && <span style={{background:T.batBlue,color:T.white,fontSize:9,padding:"1px 5px",borderRadius:2,letterSpacing:1}}>PM</span>}
                </div>
                <div style={{fontFamily:"'Anton',sans-serif",fontSize:14,color:"#4ade80"}}>{t.w}</div>
                <div style={{fontFamily:"'Anton',sans-serif",fontSize:14,color:T.red}}>{t.l}</div>
                <div style={{fontFamily:"'Teko',sans-serif",fontSize:13,color:T.grayMid}}>{t.pins.toLocaleString()}</div>
                <div style={{fontFamily:"'Teko',sans-serif",fontSize:13,color:T.batLight}}>{t.hgs}</div>
                <div style={{fontFamily:"'Anton',sans-serif",fontSize:18,color:t.rank===1?T.ballPink:T.white}}>{t.pts}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Title Race */}
        <Card>
          <CardHeader accent={T.ballPurple}>
            <span style={{fontSize:14}}>🎯</span>
            <span style={{fontFamily:"'Anton',sans-serif",fontSize:16,color:T.white,letterSpacing:1}}>TITLE RACE PROJECTIONS</span>
          </CardHeader>
          <div style={{padding:"14px",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            {titleRace.slice(0,6).map(t=>{
              const barPct = Math.min(100,(t.pts/48)*100);
              const maxPct = Math.min(100,(t.maxPts/48)*100);
              const sc = titleStatusColor(t.status);
              return (
                <div key={t.name} style={{
                  background:`rgba(255,255,255,0.03)`,
                  border:`1px solid rgba(255,255,255,0.08)`,
                  borderTop:`2px solid ${sc}`,
                  borderRadius:8, padding:"12px",
                }}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                    <div style={{background:`rgba(${sc==="rgba(255,255,255,0.2)"?"255,255,255,0.1":`${parseInt(T.ballPink.slice(1,3),16)},${parseInt(T.ballPink.slice(3,5),16)},${parseInt(T.ballPink.slice(5,7),16)},0.15`})`,
                      border:`1px solid ${sc}`,borderRadius:3,padding:"1px 6px",
                      fontFamily:"'Teko',sans-serif",fontSize:9,letterSpacing:1,textTransform:"uppercase",color:sc}}>
                      {t.status}
                    </div>
                    <div style={{fontFamily:"'Teko',sans-serif",fontSize:10,color:T.grayMid}}>POS #{t.rank}</div>
                  </div>
                  <div style={{fontFamily:"'Anton',sans-serif",fontSize:14,color:T.white,marginBottom:2,lineHeight:1.2}}>{t.name.split(" ").slice(0,2).join(" ")}</div>
                  {/* progress bar */}
                  <div style={{marginTop:10,marginBottom:6}}>
                    <div style={{height:4,background:"rgba(255,255,255,0.08)",borderRadius:2,overflow:"hidden",position:"relative"}}>
                      <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${maxPct}%`,background:"rgba(255,255,255,0.12)",borderRadius:2}}/>
                      <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${barPct}%`,background:`linear-gradient(90deg,${T.batBlue},${sc})`,borderRadius:2,transition:"width 1s ease"}}/>
                    </div>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    <span style={{fontFamily:"'Teko',sans-serif",fontSize:10,color:T.grayMid}}>GAP TO LEAD</span>
                    <span style={{fontFamily:"'Anton',sans-serif",fontSize:12,color:t.gap===0?T.ballPink:T.grayMid}}>
                      {t.gap===0?"LEADER":`-${t.gap} WIN${t.gap!==1?"S":""}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Consistency Matrix */}
        <Card>
          <CardHeader accent={T.batBlue}>
            <span style={{fontSize:14}}>📊</span>
            <span style={{fontFamily:"'Anton',sans-serif",fontSize:16,color:T.white,letterSpacing:1}}>CONSISTENCY MATRIX</span>
          </CardHeader>
          <div style={{padding:"14px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {standings.slice(0,4).map((t,i)=>{
              const variance = [63,84,77,100][i];
              const stddev   = [32,41,38,52][i];
              const status   = variance < 70 ? "STABLE" : "VOLATILE";
              const barW     = Math.min(100,(variance/120)*100);
              return (
                <div key={t.name} style={{
                  background:"rgba(255,255,255,0.03)",
                  border:"1px solid rgba(255,255,255,0.07)",
                  borderRadius:8, padding:"12px"
                }}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <div style={{fontFamily:"'Teko',sans-serif",fontSize:12,fontWeight:600,letterSpacing:1,textTransform:"uppercase",color:T.white}}>{t.name.split(" ").slice(0,2).join(" ")}</div>
                    <div style={{background:status==="STABLE"?"rgba(74,210,99,0.15)":"rgba(232,32,48,0.15)",
                      border:`1px solid ${status==="STABLE"?"#4ade80":T.red}`,borderRadius:3,
                      padding:"1px 6px",fontFamily:"'Teko',sans-serif",fontSize:9,letterSpacing:1,
                      color:status==="STABLE"?"#4ade80":T.red}}>{status}</div>
                  </div>
                  <div style={{height:3,background:"rgba(255,255,255,0.08)",borderRadius:2,overflow:"hidden",marginBottom:6}}>
                    <div style={{height:"100%",width:`${barW}%`,background:status==="STABLE"?T.batBlue:T.red,borderRadius:2}}/>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    <span style={{fontFamily:"'Teko',sans-serif",fontSize:10,color:T.grayMid}}>VARIANCE {variance} PINS</span>
                    <span style={{fontFamily:"'Teko',sans-serif",fontSize:10,color:T.grayMid}}>σ {stddev}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* RIGHT PANEL */}
      <div style={{display:"flex",flexDirection:"column",gap:14}}>

        {/* Overperformers */}
        <Card>
          <CardHeader accent={T.ballPink}>
            <span style={{fontSize:14}}>🚀</span>
            <span style={{fontFamily:"'Anton',sans-serif",fontSize:14,color:T.white,letterSpacing:1}}>OVERPERFORMERS</span>
          </CardHeader>
          <div style={{padding:"10px 14px"}}>
            {overperformers.map((p,i)=>(
              <div key={i} style={{
                display:"flex",alignItems:"center",gap:10,padding:"8px 0",
                borderBottom:"1px solid rgba(255,255,255,0.05)"
              }}>
                <div style={{
                  width:28,height:28,borderRadius:4,flexShrink:0,
                  background:`linear-gradient(135deg,${T.ballPurple},${T.ballPink})`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontFamily:"'Teko',sans-serif",fontSize:10,color:T.white,
                }}>{p.name.slice(0,2)}</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Anton',sans-serif",fontSize:13,color:T.white}}>{p.name}</div>
                  <div style={{fontFamily:"'Teko',sans-serif",fontSize:9,letterSpacing:1,textTransform:"uppercase",color:T.grayMid}}>{p.team}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"'Anton',sans-serif",fontSize:16,color:T.ballPink}}>{p.delta}</div>
                  <div style={{fontFamily:"'Teko',sans-serif",fontSize:9,letterSpacing:1,color:T.grayMid}}>PINS OVER AVG</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Women's Elite */}
        <Card style={{flex:1}}>
          <CardHeader accent={T.batLight}>
            <span style={{fontSize:14}}>👑</span>
            <span style={{fontFamily:"'Anton',sans-serif",fontSize:14,color:T.white,letterSpacing:1}}>WOMEN'S ELITE</span>
          </CardHeader>
          <div style={{padding:"10px 14px"}}>
            {women.map((w,i)=>(
              <div key={i} style={{
                display:"flex",alignItems:"center",gap:10,padding:"8px 0",
                borderBottom:"1px solid rgba(255,255,255,0.05)"
              }}>
                <div style={{
                  width:22,height:22,borderRadius:"50%",flexShrink:0,
                  background:i===0?`linear-gradient(135deg,${T.ballPurple},${T.ballPink})`:`linear-gradient(135deg,${T.navyMid},${T.batBlue})`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontFamily:"'Anton',sans-serif",fontSize:10,color:T.white,
                }}>{i+1}</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Anton',sans-serif",fontSize:13,color:T.white}}>{w.name}</div>
                  <div style={{fontFamily:"'Teko',sans-serif",fontSize:9,letterSpacing:1,textTransform:"uppercase",color:T.grayMid}}>{w.team}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"'Anton',sans-serif",fontSize:16,color:T.batLight}}>{w.avg}</div>
                  <div style={{fontFamily:"'Teko',sans-serif",fontSize:9,letterSpacing:1,color:T.grayMid}}>AVG</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function PlaymastersDashboard() {
  const [page, setPage] = useState("player");
  const [division, setDivision] = useState("monday");

  return (
    <div style={{
      minHeight:"100vh",
      background: `${T.navyDark}`,
      backgroundImage: `
        radial-gradient(ellipse 70% 60% at 80% 20%, rgba(212,32,128,0.08) 0%, transparent 60%),
        radial-gradient(ellipse 50% 50% at 10% 80%, rgba(74,82,184,0.10) 0%, transparent 60%),
        repeating-linear-gradient(90deg, transparent 0px, transparent 38px, rgba(255,255,255,0.012) 38px, rgba(255,255,255,0.012) 40px)
      `,
      fontFamily:"'Inter',system-ui,sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Teko:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:6px; } ::-webkit-scrollbar-track { background:transparent; } ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.15); border-radius:3px; }
        @keyframes livePulse { 0%,100%{box-shadow:0 0 0 0 rgba(212,32,128,0.8)} 50%{box-shadow:0 0 0 8px rgba(212,32,128,0)} }
        @keyframes slideIn { from{transform:translateY(12px);opacity:0} to{transform:translateY(0);opacity:1} }
      `}</style>

      {/* NAV */}
      <nav style={{
        position:"sticky",top:0,zIndex:100,
        background:`rgba(8,11,58,0.92)`,
        backdropFilter:"blur(16px)",
        borderBottom:`1px solid rgba(255,255,255,0.07)`,
        borderLeft:`4px solid ${T.red}`,
        padding:"0 28px",
        display:"flex",alignItems:"center",gap:0,height:56,
      }}>
        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginRight:40}}>
          <div style={{
            width:28,height:28,borderRadius:4,
            background:`linear-gradient(135deg,${T.navyMid},${T.batBlue})`,
            border:`1px solid ${T.batBlue}`,
            display:"flex",alignItems:"center",justifyContent:"center",
          }}>
            <span style={{fontSize:14}}>🎳</span>
          </div>
          <div>
            <div style={{fontFamily:"'Anton',Impact,sans-serif",fontSize:16,letterSpacing:2,textTransform:"uppercase",color:T.white,lineHeight:1}}>PLAYMASTERS</div>
            <div style={{fontFamily:"'Teko',sans-serif",fontSize:9,letterSpacing:3,textTransform:"uppercase",color:T.ballPink,lineHeight:1}}>SEASON XVI</div>
          </div>
        </div>

        {/* Nav items */}
        {[
          {id:"player",      label:"PLAYER HUB"},
          {id:"competition", label:"COMPETITION HQ"},
          {id:"log",         label:"LOG SCORE"},
        ].map(item=>(
          <button key={item.id} onClick={()=>setPage(item.id)} style={{
            background:"transparent",border:"none",cursor:"pointer",
            padding:"0 18px",height:"100%",
            fontFamily:"'Teko',sans-serif",fontSize:13,fontWeight:600,letterSpacing:3,textTransform:"uppercase",
            color: page===item.id ? T.white : T.grayMid,
            borderBottom: page===item.id ? `2px solid ${T.red}` : "2px solid transparent",
            transition:"all 0.2s",
            position:"relative",
          }}>{item.label}</button>
        ))}

        {/* Right side */}
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:16}}>
          {page==="competition" && (
            <div style={{display:"flex",gap:4,background:"rgba(255,255,255,0.05)",borderRadius:4,padding:3}}>
              {["monday","tuesday"].map(d=>(
                <button key={d} onClick={()=>setDivision(d)} style={{
                  background:division===d?T.red:"transparent",
                  border:"none",cursor:"pointer",
                  padding:"4px 12px",borderRadius:3,
                  fontFamily:"'Teko',sans-serif",fontSize:12,fontWeight:700,letterSpacing:2,textTransform:"uppercase",
                  color: division===d ? T.white : T.grayMid,
                  transition:"all 0.18s",
                }}>{d.toUpperCase()}</button>
              ))}
            </div>
          )}
          <LiveDot/>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <div style={{padding:"24px 28px",maxWidth:1280,margin:"0 auto",animation:"slideIn 0.4s ease-out"}}>

        {/* Page Title */}
        <div style={{marginBottom:24,borderBottom:`1px solid rgba(255,255,255,0.07)`,paddingBottom:20}}>
          <h1 style={{fontFamily:"'Anton',Impact,sans-serif",fontSize:40,textTransform:"uppercase",color:T.white,letterSpacing:2,lineHeight:1}}>
            {page === "player"      && "PLAYER HUB"}
            {page === "competition" && "COMPETITION HQ"}
            {page === "log"         && "LOG SCORE"}
          </h1>
          <p style={{fontFamily:"'Teko',sans-serif",fontSize:13,letterSpacing:3,textTransform:"uppercase",color:T.grayMid,marginTop:4}}>
            {page === "player"      && "STRIKE LIKE PLAYMASTERS // SYSTEM ONLINE"}
            {page === "competition" && "LEAGUE-WIDE ANALYTICS // REAL-TIME THREAT ANALYSIS"}
            {page === "log"         && "RECORD YOUR SESSION // WESTGATE STRIKEZ"}
          </p>
        </div>

        {page === "player"      && <PlayerHub />}
        {page === "competition" && <CompetitionHQ division={division} />}
        {page === "log"         && (
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:300}}>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:48,marginBottom:16}}>🎳</div>
              <div style={{fontFamily:"'Anton',sans-serif",fontSize:24,color:T.white,letterSpacing:2}}>LOG SCORE</div>
              <div style={{fontFamily:"'Teko',sans-serif",fontSize:12,letterSpacing:2,color:T.grayMid,marginTop:4}}>CONNECT TO SUPABASE TO ENABLE SCORE LOGGING</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
