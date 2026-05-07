export function CircuitBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <style>{`
            @keyframes pcb-signal-a {
              0%   { stroke-dashoffset: 900;  opacity: 0; }
              6%   { opacity: 0.85; }
              94%  { opacity: 0.85; }
              100% { stroke-dashoffset: -160; opacity: 0; }
            }
            @keyframes pcb-signal-b {
              0%   { stroke-dashoffset: 1100; opacity: 0; }
              6%   { opacity: 0.65; }
              94%  { opacity: 0.65; }
              100% { stroke-dashoffset: -160; opacity: 0; }
            }
            @keyframes pcb-blink {
              0%, 100% { opacity: 0.12; }
              50%      { opacity: 0.55; }
            }
          `}</style>
        </defs>

        {/* ── Base traces ── */}

        {/* Top-left cluster */}
        <g stroke="#d4e157" strokeWidth="1.5" fill="none" strokeOpacity="0.13">
          <path d="M 0,90 H 180 V 40 H 440 V 130 H 340 V 230" />
          <path d="M 180,90 V 180 H 80 V 280 H 260 V 360" />
          <path d="M 440,40 H 640 V 170 H 520 V 290" />
          <path d="M 640,170 H 780 V 100" />
        </g>

        {/* Top-right cluster */}
        <g stroke="#d4e157" strokeWidth="1.5" fill="none" strokeOpacity="0.13">
          <path d="M 1440,70 H 1240 V 150 H 1080 V 90 H 960" />
          <path d="M 1240,150 V 270 H 1120 V 210 H 980 V 310" />
          <path d="M 1080,90 V 30 H 1320" />
          <path d="M 1320,30 H 1440" />
        </g>

        {/* Left mid */}
        <g stroke="#d4e157" strokeWidth="1.5" fill="none" strokeOpacity="0.11">
          <path d="M 0,400 H 140 V 310 H 300 V 430 H 200 V 550 H 80 V 640" />
          <path d="M 300,430 H 460 V 350 H 580" />
          <path d="M 460,350 V 250" />
        </g>

        {/* Right mid */}
        <g stroke="#d4e157" strokeWidth="1.5" fill="none" strokeOpacity="0.11">
          <path d="M 1440,410 H 1320 V 320 H 1180 V 450 H 1080 V 550" />
          <path d="M 1180,450 H 1040 V 370" />
          <path d="M 1320,450 V 560 H 1440" />
        </g>

        {/* Center (faint — behind text) */}
        <g stroke="#d4e157" strokeWidth="1" fill="none" strokeOpacity="0.07">
          <path d="M 520,290 H 660 V 380 H 820 V 300 H 960" />
          <path d="M 820,380 V 480 H 700 V 560" />
          <path d="M 960,300 H 1080 V 370" />
        </g>

        {/* Bottom cluster */}
        <g stroke="#d4e157" strokeWidth="1.5" fill="none" strokeOpacity="0.13">
          <path d="M 0,720 H 220 V 640 H 400 V 760 H 580 V 700" />
          <path d="M 220,720 V 840 H 360" />
          <path d="M 360,840 H 520 V 900" />
          <path d="M 580,700 H 740 V 780 H 920 V 720 H 1060" />
          <path d="M 740,780 V 900" />
          <path d="M 1440,740 H 1300 V 660 H 1140 V 800 H 980 V 880 H 820" />
          <path d="M 1300,800 V 900" />
        </g>

        {/* ── Animated signal pulses ── */}
        <g fill="none" strokeDasharray="75 2000">
          <path d="M 0,90 H 180 V 40 H 440 V 130 H 340 V 230"
            stroke="#d4e157" strokeWidth="2"
            style={{ animation: 'pcb-signal-a 4.8s ease-in-out 0s infinite' }} />
          <path d="M 440,40 H 640 V 170 H 780 V 100"
            stroke="#d4e157" strokeWidth="2"
            style={{ animation: 'pcb-signal-b 5.2s ease-in-out 1.4s infinite' }} />
          <path d="M 1440,70 H 1240 V 150 H 1080 V 90 H 960"
            stroke="#d4e157" strokeWidth="2"
            style={{ animation: 'pcb-signal-a 5.8s ease-in-out 0.7s infinite' }} />
          <path d="M 0,400 H 140 V 310 H 300 V 430 H 200 V 550"
            stroke="#d4e157" strokeWidth="2"
            style={{ animation: 'pcb-signal-b 6.2s ease-in-out 2.6s infinite' }} />
          <path d="M 1440,410 H 1320 V 320 H 1180 V 450 H 1080 V 550"
            stroke="#d4e157" strokeWidth="2"
            style={{ animation: 'pcb-signal-a 5.4s ease-in-out 1.1s infinite' }} />
          <path d="M 0,720 H 220 V 640 H 400 V 760 H 580 V 700 H 740"
            stroke="#d4e157" strokeWidth="2"
            style={{ animation: 'pcb-signal-b 7s ease-in-out 3.4s infinite' }} />
          <path d="M 1440,740 H 1300 V 660 H 1140 V 800 H 980"
            stroke="#d4e157" strokeWidth="2"
            style={{ animation: 'pcb-signal-a 6s ease-in-out 2s infinite' }} />
          <path d="M 520,290 H 660 V 380 H 820 V 300 H 960 H 1080 V 370"
            stroke="#d4e157" strokeWidth="1.5"
            style={{ animation: 'pcb-signal-b 8s ease-in-out 4s infinite' }} />
        </g>

        {/* ── Vias ── */}
        {([
          [180,90],[440,40],[440,130],[640,170],[780,100],
          [1240,150],[1080,90],[1180,450],[1080,550],
          [140,310],[300,430],[200,550],[460,350],
          [220,720],[400,760],[580,700],[740,780],
          [1300,660],[1140,800],[980,720],
          [660,380],[820,380],[820,480],[700,560],
          [460,250],[80,640],[360,840],
        ] as [number,number][]).map(([cx,cy],i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="5.5"
              fill="none" stroke="#d4e157" strokeWidth="1.2" strokeOpacity="0.28" />
            <circle cx={cx} cy={cy} r="2.5"
              fill="#d4e157" fillOpacity="0.22" />
          </g>
        ))}

        {/* ── Solder pads ── */}
        {([
          [164,24],[424,24],[772,84],
          [1224,134],[1064,74],[1312,14],
          [124,294],[164,534],[192,624],
          [1312,304],[1064,534],
          [204,628],[564,688],[1292,648],[964,708],
          [344,828],[804,864],
        ] as [number,number][]).map(([x,y],i) => (
          <rect key={i} x={x} y={y} width="16" height="16" rx="2"
            fill="#d4e157" fillOpacity="0.18" />
        ))}

        {/* ── IC chip outlines ── */}
        {/* IC-1: top-left */}
        <g stroke="#d4e157" strokeOpacity="0.16" fill="none" strokeWidth="1">
          <rect x="240" y="210" width="100" height="64" rx="3" />
          {([0,1,2,3] as number[]).map(i=>(
            <line key={i} x1={256+i*24} y1="210" x2={256+i*24} y2="194" strokeWidth="1.5"/>
          ))}
          {([0,1,2,3] as number[]).map(i=>(
            <line key={i} x1={256+i*24} y1="274" x2={256+i*24} y2="290" strokeWidth="1.5"/>
          ))}
          <circle cx="248" cy="218" r="3" fill="#d4e157" fillOpacity="0.25" stroke="none"/>
        </g>

        {/* IC-2: top-right */}
        <g stroke="#d4e157" strokeOpacity="0.14" fill="none" strokeWidth="1">
          <rect x="988" y="170" width="80" height="120" rx="3" />
          {([0,1,2] as number[]).map(i=>(
            <line key={i} x1="988" y1={190+i*38} x2="972" y2={190+i*38} strokeWidth="1.5"/>
          ))}
          {([0,1,2] as number[]).map(i=>(
            <line key={i} x1="1068" y1={190+i*38} x2="1084" y2={190+i*38} strokeWidth="1.5"/>
          ))}
          <circle cx="996" cy="178" r="3" fill="#d4e157" fillOpacity="0.25" stroke="none"/>
        </g>

        {/* IC-3: left-mid */}
        <g stroke="#d4e157" strokeOpacity="0.13" fill="none" strokeWidth="1">
          <rect x="80" y="460" width="120" height="70" rx="3" />
          {([0,1,2,3] as number[]).map(i=>(
            <line key={i} x1={96+i*28} y1="460" x2={96+i*28} y2="444" strokeWidth="1.5"/>
          ))}
          {([0,1,2,3] as number[]).map(i=>(
            <line key={i} x1={96+i*28} y1="530" x2={96+i*28} y2="546" strokeWidth="1.5"/>
          ))}
          <circle cx="88" cy="468" r="3" fill="#d4e157" fillOpacity="0.22" stroke="none"/>
        </g>

        {/* IC-4: bottom-center */}
        <g stroke="#d4e157" strokeOpacity="0.13" fill="none" strokeWidth="1">
          <rect x="648" y="708" width="120" height="56" rx="3" />
          {([0,1,2,3] as number[]).map(i=>(
            <line key={i} x1={664+i*28} y1="708" x2={664+i*28} y2="692" strokeWidth="1.5"/>
          ))}
          {([0,1,2,3] as number[]).map(i=>(
            <line key={i} x1={664+i*28} y1="764" x2={664+i*28} y2="780" strokeWidth="1.5"/>
          ))}
          <circle cx="656" cy="716" r="3" fill="#d4e157" fillOpacity="0.22" stroke="none"/>
        </g>

        {/* IC-5: right-bottom */}
        <g stroke="#d4e157" strokeOpacity="0.13" fill="none" strokeWidth="1">
          <rect x="1100" y="640" width="80" height="120" rx="3" />
          {([0,1,2] as number[]).map(i=>(
            <line key={i} x1="1100" y1={660+i*38} x2="1084" y2={660+i*38} strokeWidth="1.5"/>
          ))}
          {([0,1,2] as number[]).map(i=>(
            <line key={i} x1="1180" y1={660+i*38} x2="1196" y2={660+i*38} strokeWidth="1.5"/>
          ))}
          <circle cx="1108" cy="648" r="3" fill="#d4e157" fillOpacity="0.22" stroke="none"/>
        </g>

        {/* ── Status LEDs (blinking) ── */}
        {([
          [60,44, '2.1s','0s'],
          [1404,44,'2.9s','0.8s'],
          [44,858,'2.4s','1.6s'],
          [1404,858,'3.2s','0.4s'],
        ] as [number,number,string,string][]).map(([cx,cy,dur,delay],i) => (
          <circle key={i} cx={cx} cy={cy} r="4.5"
            fill="#d4e157" fillOpacity="0.3"
            style={{ animation: `pcb-blink ${dur} ease-in-out ${delay} infinite` }} />
        ))}

        {/* ── Gradient overlay: darken centre for text legibility ── */}
        <defs>
          <radialGradient id="centre-fade" cx="40%" cy="60%" r="55%">
            <stop offset="0%"   stopColor="#0a0a0a" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1440" height="900" fill="url(#centre-fade)" />
      </svg>
    </div>
  );
}
