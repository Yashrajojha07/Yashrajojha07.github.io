import React, { useState, useEffect, useRef, useCallback } from "react";

/* ============================================================
   YASH RAJ OJHA - Silicon Foundry Dark v2
   Engineering case-study portfolio. Single-file React artifact.
   No external libraries. All diagrams are hand-built SVG/Canvas.
   ============================================================ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Google+Sans+Code:wght@400;500;700&family=Roboto+Flex:opsz,wght@8..144,400..700&family=Roboto:wght@400;500;700&display=swap');

.yro *{box-sizing:border-box;margin:0;padding:0}
.yro{
  --bg:#131314; --surface:#1E1F20; --line:#37393B; --line2:rgba(55,57,59,.6);
  --cyan:#8AB4F8; --phos:var(--violet); --violet:#C58AF9;
  --gold:#FDD663; --red:#F28B82; --t1:#E8EAED; --t2:#9AA0A6;
  --card:#18191B; --cell:#161719; --onfill:#202124;
  --elev-1:none; --elev-2:none; /* dark elevation = tone+border, not shadow */
  /* diagram tokens - dark values are the original literals, so dark mode is pixel-identical */
  --dg-bg:#0E0F10; --dg-border:#37393B;
  --dg-box:#1B1C1E; --dg-box2:#202124;
  --dg-t1:#E8EAED; --dg-t2:#9AA0A6;
  --dg-blue:#8AB4F8; --dg-stroke:rgba(138,180,248,.4); --dg-stroke2:rgba(138,180,248,.45); --dg-stroke3:rgba(138,180,248,.55); --dg-arrow:rgba(138,180,248,.6);
  --dg-frame1:rgba(138,180,248,.25); --dg-frame2:rgba(129,201,149,.28);
  --dg-green:#81C995; --dg-green-stroke:rgba(129,201,149,.4); --dg-green-stroke2:rgba(129,201,149,.45); --dg-green-grant:rgba(129,201,149,.7);
  --dg-glow:rgba(129,201,149,.55); --dg-glow-soft:rgba(129,201,149,.3); --dg-glowb:rgba(138,180,248,.35);
  --dg-gold:#FDD663; --dg-gold-stroke:rgba(253,214,99,.5);
  --dg-violet:#C58AF9; --dg-violet-stroke:rgba(197,138,249,.45); --dg-violet-dash:rgba(197,138,249,.4);
  --disp:'Google Sans','Roboto Flex','Roboto',sans-serif; --body:'Roboto','Roboto Flex',sans-serif; --mono:'Google Sans Code','Roboto Mono',monospace;
  background:var(--bg); color:var(--t1); font-family:var(--body);
  line-height:1.6; -webkit-font-smoothing:antialiased; overflow-x:hidden;
  position:relative; min-height:100vh;
}
.yro a{color:inherit;text-decoration:none}
.yro ::selection{background:rgba(138,180,248,.25);color:#fff}
.yro :focus-visible{outline:2px solid var(--cyan);outline-offset:3px;border-radius:4px}
.skip{position:fixed;top:-100px;left:1rem;z-index:100;background:var(--surface);color:var(--t1);border:1px solid var(--cyan);border-radius:8px;padding:.65rem 1.1rem;font-family:var(--mono);font-size:.8rem;transition:top .2s}
.skip:focus{top:1rem}

.bg-lattice{position:fixed;inset:0;z-index:0;pointer-events:none}
.wrap{position:relative;z-index:1}

.eyebrow{font-family:var(--mono);font-size:.72rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:var(--cyan);display:inline-block}
.eyebrow .cs{color:var(--phos)}
.sec-title{font-family:var(--disp);font-weight:700;font-size:clamp(1.7rem,3.6vw,2.6rem);letter-spacing:-.02em;margin:.5rem 0 0}
.sec-sub{color:var(--t2);max-width:64ch;margin-top:.8rem;font-size:1.02rem}
.section{max-width:1180px;margin:0 auto;padding:6.5rem 1.5rem}
.section-head{margin-bottom:2.8rem}

/* ---------- navbar ---------- */
.nav{position:fixed;top:0;left:0;right:0;z-index:50;transition:background .3s,border-color .3s,backdrop-filter .3s}
.nav-in{display:flex;align-items:center;justify-content:space-between;max-width:1180px;margin:0 auto;padding:1rem 1.5rem;border-bottom:1px solid transparent}
.nav.scrolled{background:rgba(19,19,20,.85);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)}
.nav.scrolled .nav-in{border-bottom:1px solid var(--line)}
.mono-logo{font-family:var(--disp);font-weight:700;font-size:1.12rem;letter-spacing:.12em;color:var(--cyan)}
.mono-logo .dot{color:var(--phos)}
.nav-links{display:flex;gap:1.7rem;align-items:center;list-style:none}
.nav-links a{font-size:.86rem;color:var(--t2);position:relative;transition:color .2s;padding:.2rem 0}
.nav-links a:hover{color:var(--t1)}
.nav-links a.active{color:var(--cyan)}
.nav-links a.active::after{content:'';position:absolute;left:0;right:0;bottom:-4px;height:2px;background:var(--cyan);box-shadow:0 0 8px var(--cyan)}
/* selector must out-rank .nav-links a, which otherwise overrides font/padding */
.nav-links a.nav-cta,.nav-cta{display:inline-flex;align-items:center;gap:.5rem;font-family:var(--mono);font-size:.72rem;line-height:1;padding:.6rem 1.15rem;border:1px solid rgba(197,138,249,.35);border-radius:999px;color:var(--phos)!important;transition:.2s}
.nav-links a.nav-cta:hover,.nav-cta:hover{background:rgba(197,138,249,.08)}
.nav-links a.nav-cta:active,.nav-cta:active{background:rgba(197,138,249,.14)}
.burger{display:none;flex-direction:column;gap:5px;background:none;border:0;cursor:pointer;padding:6px}
.burger span{width:24px;height:2px;background:var(--t1);transition:.3s}
.burger.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.burger.open span:nth-child(2){opacity:0}
.burger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
.overlay{position:fixed;inset:0;z-index:45;background:rgba(19,19,20,.97);backdrop-filter:blur(10px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.6rem;opacity:0;pointer-events:none;transition:opacity .3s}
.overlay.open{opacity:1;pointer-events:auto}
.overlay a{font-family:var(--disp);font-size:1.45rem;color:var(--t1)}
.overlay a:hover{color:var(--cyan)}

/* ---------- hero ---------- */
.hero{position:relative;min-height:100vh;display:flex;align-items:center;overflow:hidden}
.hero-canvas{position:absolute;inset:0;z-index:0}
.hero-grid{position:relative;z-index:2;max-width:1180px;margin:0 auto;padding:0 1.5rem;display:grid;grid-template-columns:1.05fr .95fr;grid-template-areas:"copy die" "actions die";gap:0 3rem;align-items:center;width:100%}
.hero-copy{grid-area:copy}
.hero-actions{grid-area:actions}
.hero-id{display:flex;align-items:center;gap:1.15rem;margin-bottom:1.5rem}
.hero-avatar{width:clamp(84px,9vw,116px);height:clamp(84px,9vw,116px);border-radius:18px;object-fit:cover;border:1px solid var(--line);box-shadow:var(--elev-1);display:block;flex:none}
.hero-name{font-family:var(--disp);font-weight:700;font-size:clamp(1.45rem,2.6vw,1.95rem);letter-spacing:-.02em;line-height:1.15;margin:.35rem 0 0}
.hero .kicker{font-family:var(--mono);font-size:.78rem;letter-spacing:.16em;text-transform:uppercase;color:var(--phos);display:inline-flex;align-items:center;gap:.55rem}
.hero .kicker::before{content:'';width:7px;height:7px;border-radius:50%;background:var(--phos);box-shadow:0 0 10px var(--phos);animation:blip 2.2s ease-in-out infinite}
@keyframes blip{50%{opacity:.35}}
.hero-state{font-family:var(--disp);font-weight:700;font-size:clamp(2.6rem,6vw,4.4rem);line-height:.98;letter-spacing:-.03em;margin:.7rem 0 .5rem;color:var(--t1)}
.hero .subhead{font-family:var(--disp);font-weight:500;font-size:clamp(1.05rem,2.2vw,1.45rem);color:var(--cyan);margin-bottom:1.1rem}
.hero .bio{color:var(--t2);max-width:38ch;font-size:1rem}
.hero .bio b{color:var(--t1);font-weight:600}
.hero-fade{background:linear-gradient(180deg,transparent,var(--bg) 96%);position:absolute;bottom:0;left:0;right:0;height:120px;z-index:1;pointer-events:none}
.cta-row{display:flex;flex-wrap:wrap;gap:.85rem;margin-top:1.8rem}
.btn{font-family:var(--mono);font-size:.84rem;letter-spacing:.03em;padding:.72rem 1.35rem;border-radius:999px;cursor:pointer;border:1px solid var(--line);background:transparent;color:var(--t1);transition:.22s;display:inline-flex;align-items:center;gap:.5rem}
.btn:hover{border-color:var(--cyan);color:var(--cyan);transform:translateY(-2px)}
.btn.fill{background:var(--cyan);color:var(--onfill);border-color:var(--cyan);font-weight:700}
.btn.fill:hover{color:var(--onfill);box-shadow:0 8px 26px rgba(138,180,248,.35)}
.hero-proof{display:flex;gap:1.6rem;margin-top:2.1rem;flex-wrap:wrap}
.hero-proof .hp{font-family:var(--mono);font-size:.7rem;color:var(--t2)}
.hero-proof .hp b{display:block;font-size:1.05rem;color:var(--cyan);font-weight:700;letter-spacing:0}

/* chip die (baseline, kept) */
.die-scene{perspective:1400px;display:flex;justify-content:center;align-items:center;position:relative}
/* ambient bounce light off the PCB beneath the chip - not the chip emitting
   light. Deliberately underpowered: a floor-level glow, not a halo. */
.die-glow{position:absolute;left:50%;top:57%;transform:translate(-50%,-50%);width:min(430px,86vw);height:min(220px,44vw);background:radial-gradient(ellipse at center,rgba(138,180,248,.19) 0%,rgba(138,180,248,.075) 55%,rgba(138,180,248,0) 78%);filter:blur(70px);pointer-events:none;z-index:0;animation:dieGlowBreathe 13s ease-in-out infinite}
@keyframes dieGlowBreathe{0%,100%{opacity:.94}50%{opacity:1}}
.die{position:relative;z-index:1;width:min(390px,78vw);height:min(390px,78vw);transform-style:preserve-3d;animation:dieSpin 20s ease-in-out infinite}
.die:hover{animation-play-state:paused}
@keyframes dieSpin{0%,100%{transform:rotateX(52deg) rotateZ(-22deg)}50%{transform:rotateX(52deg) rotateZ(22deg)}}
.die-face{position:absolute;inset:0;background:linear-gradient(135deg,#202124,#1A1B24);border:1px solid var(--line);border-radius:10px;box-shadow:0 0 0 1px rgba(138,180,248,.12),inset 0 0 60px rgba(138,180,248,.055),0 40px 80px rgba(0,0,0,.6);display:grid;grid-template-columns:repeat(6,1fr);grid-template-rows:repeat(6,1fr);gap:6px;padding:16px}
.die-face::before{content:'';position:absolute;inset:6px;border:1px solid rgba(138,180,248,.14);border-radius:6px;pointer-events:none}
.block{border:1px solid rgba(138,180,248,.21);border-radius:4px;background:rgba(138,180,248,.035);display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:.5rem;color:var(--t2);letter-spacing:.04em;position:relative;transition:.22s;cursor:default}
.block:hover{background:rgba(138,180,248,.14);border-color:var(--cyan);color:var(--cyan);box-shadow:0 0 18px rgba(138,180,248,.4);z-index:5}
.block .tip{position:absolute;bottom:118%;left:50%;transform:translateX(-50%) scale(.9);background:var(--surface);border:1px solid var(--cyan);color:var(--cyan);font-size:.6rem;white-space:nowrap;padding:.25rem .55rem;border-radius:5px;opacity:0;pointer-events:none;transition:.2s}
.block:hover .tip{opacity:1;transform:translateX(-50%) scale(1)}
.die-core{grid-column:3/5;grid-row:3/5;background:rgba(197,138,249,.06);border-color:rgba(197,138,249,.3)}
.die-core:hover{background:rgba(197,138,249,.16);border-color:var(--phos);color:var(--phos);box-shadow:0 0 22px rgba(197,138,249,.4)}
.die-pins{position:absolute;display:flex;gap:5px}
.die-pins.top{top:-9px;left:16px;right:16px;justify-content:space-around}
.die-pins.bot{bottom:-9px;left:16px;right:16px;justify-content:space-around}
.die-pins i{width:5px;height:9px;background:linear-gradient(var(--cyan),transparent);border-radius:2px;opacity:.55}

/* ---------- about ---------- */
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:2.5rem;align-items:start}
.terminal{background:#0E0F10;border:1px solid var(--line);border-radius:10px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.5)}
.term-bar{display:flex;align-items:center;gap:.5rem;padding:.7rem 1rem;background:var(--surface);border-bottom:1px solid var(--line)}
.term-bar i{width:11px;height:11px;border-radius:50%;display:inline-block}
.term-bar .r{background:#ff5f56}.term-bar .y{background:#ffbd2e}.term-bar .g{background:#27c93f}
.term-bar span{font-family:var(--mono);font-size:.72rem;color:var(--t2);margin-left:.6rem}
.term-body{padding:1.2rem 1.3rem;font-family:var(--mono);font-size:.8rem;line-height:1.85;white-space:pre-wrap}
.term-body .cmd{color:var(--phos)}.term-body .cmd::before{content:'$ ';color:var(--cyan)}
.term-body .out{color:var(--t1)}.term-body .dim{color:var(--t2)}.term-body .hl{color:var(--gold)}
.term-cursor{display:inline-block;width:8px;height:1.05em;background:var(--phos);vertical-align:-2px;animation:blink 1.1s step-end infinite}
@keyframes blink{50%{opacity:0}}
.about-prose p{color:var(--t2);font-size:1.04rem;margin-bottom:1.05rem}
.about-prose strong{color:var(--t1);font-weight:600}
.about-prose .num{color:var(--cyan);font-family:var(--mono);font-weight:500}
.statbar{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;margin-top:3rem;background:var(--line);border:1px solid var(--line);border-radius:10px;overflow:hidden}
.stat{background:var(--surface);padding:1.5rem 1.1rem;text-align:center}
.stat .v{font-family:var(--disp);font-weight:700;font-size:clamp(1.3rem,2.5vw,1.9rem);color:var(--cyan);letter-spacing:-.02em}
.stat .l{font-family:var(--mono);font-size:.64rem;letter-spacing:.1em;text-transform:uppercase;color:var(--t2);margin-top:.35rem}

/* ---------- case studies ---------- */
.cs-wrap{border:1px solid var(--line);border-radius:16px;background:linear-gradient(170deg,rgba(30,31,32,.85),rgba(19,19,20,.9));overflow:hidden;margin-top:.5rem}
.cs-head{padding:2.2rem 2.2rem 1.6rem;border-bottom:1px solid var(--line);position:relative}
.cs-head::after{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(var(--cyan),var(--violet))}
.cs-id{font-family:var(--mono);font-size:.68rem;letter-spacing:.16em;text-transform:uppercase;color:var(--phos)}
.cs-head h3{font-family:var(--disp);font-weight:700;font-size:clamp(1.4rem,2.8vw,2rem);letter-spacing:-.02em;margin:.45rem 0 .5rem}
.cs-head .role{color:var(--t2);font-size:.95rem;max-width:72ch}
.cs-meta{display:flex;flex-wrap:wrap;gap:1.6rem;margin-top:1.2rem}
.cs-meta .m{font-family:var(--mono);font-size:.66rem;color:var(--t2);letter-spacing:.06em}
.cs-meta .m b{display:block;font-size:.92rem;color:var(--cyan);letter-spacing:0;margin-top:.1rem}
.cs-body{padding:2rem 2.2rem 2.4rem}
.cs-sec{margin-bottom:2.6rem}
.cs-sec:last-child{margin-bottom:0}
.cs-label{font-family:var(--mono);font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:var(--t2);display:flex;align-items:center;gap:.7rem;margin-bottom:1.1rem}
.cs-label::before{content:'';width:22px;height:1px;background:var(--cyan)}
.cs-sec p{color:var(--t2);font-size:.97rem;max-width:80ch;margin-bottom:.8rem}
.cs-sec p b, .cs-sec li b{color:var(--t1);font-weight:600}
.cs-sec .mono{font-family:var(--mono);font-size:.88em;color:var(--cyan)}
.dec-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.dec{background:rgba(19,19,20,.6);border:1px solid var(--line);border-radius:10px;padding:1.15rem 1.25rem;transition:border-color .25s}
.dec:hover{border-color:rgba(138,180,248,.35)}
.dec .dt{font-family:var(--disp);font-weight:600;font-size:.98rem;margin-bottom:.4rem;color:var(--t1)}
.dec .dd{color:var(--t2);font-size:.88rem}
.dec .dd .mono{font-family:var(--mono);font-size:.86em;color:var(--cyan)}
.tags{display:flex;flex-wrap:wrap;gap:.4rem}
.tag{font-family:var(--mono);font-size:.66rem;padding:.26rem .58rem;border-radius:5px;background:rgba(197,138,249,.06);border:1px solid rgba(197,138,249,.18);color:var(--phos)}

/* progressive-disclosure project cards - 15-second scan, full depth on demand */
.pcard{position:relative;border:1px solid var(--line);border-radius:16px;background:linear-gradient(170deg,rgba(30,31,32,.85),rgba(19,19,20,.9));overflow:hidden;transition:border-color .25s}
.pcard::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(var(--cyan),var(--violet));z-index:1}
.pcard:hover{border-color:rgba(138,180,248,.3)}
.pcard + .pcard{margin-top:1.5rem}
.pc-head{padding:1.9rem 2.2rem}
.pc-meta{display:flex;align-items:center;gap:1rem;flex-wrap:wrap}
.pc-org{font-family:var(--mono);font-size:.62rem;letter-spacing:.13em;text-transform:uppercase;border:1px solid;border-radius:999px;padding:.24rem .75rem;white-space:nowrap}
.pc-org.ind{color:var(--phos);border-color:rgba(197,138,249,.3);background:rgba(197,138,249,.05)}
.pc-org.res{color:var(--violet);border-color:rgba(197,138,249,.3);background:rgba(197,138,249,.05)}
.pc-domain{font-family:var(--mono);font-size:.64rem;letter-spacing:.12em;text-transform:uppercase;color:var(--t2)}
.pc-title{font-family:var(--disp);font-weight:700;font-size:clamp(1.35rem,2.6vw,1.85rem);letter-spacing:-.02em;margin:.9rem 0 .45rem}
.pc-role{color:var(--t2);font-size:.93rem;max-width:76ch}
.pc-impact{font-family:var(--mono);font-size:.78rem;color:var(--cyan);margin-top:.75rem;letter-spacing:.02em}
.pc-sum{color:var(--t2);font-size:.95rem;max-width:80ch;margin-top:.55rem}
.pc-tags{margin-top:1.05rem}
.pc-btn{margin-top:1.35rem}
.pc-chev{display:inline-block;transition:transform .3s;margin-left:.15rem}
.pcard.open .pc-chev{transform:rotate(90deg)}
.pc-body{display:grid;grid-template-rows:0fr;visibility:hidden;transition:grid-template-rows .55s cubic-bezier(.2,.7,.3,1),visibility 0s .55s}
.pcard.open .pc-body{grid-template-rows:1fr;visibility:visible;transition:grid-template-rows .55s cubic-bezier(.2,.7,.3,1)}
.pc-body-in{overflow:hidden;min-height:0}
.pcard .cs-wrap{border:0;border-top:1px solid var(--line);border-radius:0;background:transparent;margin-top:0}
.pcard .cs-head::after{display:none}

/* metric strip inside case study */
.mstrip{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:1px;background:var(--line);border:1px solid var(--line);border-radius:10px;overflow:hidden}
.mstrip .ms{background:var(--card);padding:1rem .8rem;text-align:center}
.mstrip .ms b{display:block;font-family:var(--mono);font-weight:700;font-size:1.02rem;color:var(--phos)}
.mstrip .ms span{font-family:var(--mono);font-size:.6rem;letter-spacing:.08em;text-transform:uppercase;color:var(--t2)}

/* diagrams */
.diagram{background:var(--dg-bg);border:1px solid var(--dg-border);border-radius:12px;padding:1.2rem;overflow-x:auto}
.diagram svg{display:block;min-width:640px;width:100%;height:auto}
.dg-note{font-family:var(--mono);font-size:.66rem;color:var(--t2);margin-top:.7rem;letter-spacing:.03em}
.dg-note em{color:var(--cyan);font-style:normal}

/* debug log - SIGNATURE ELEMENT */
.dbg{border:1px solid var(--line);border-radius:12px;overflow:hidden}
.dbg-head{display:flex;align-items:center;gap:.7rem;background:var(--card);border-bottom:1px solid var(--line);padding:.75rem 1.1rem;font-family:var(--mono);font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:var(--t2)}
.dbg-head i{width:8px;height:8px;border-radius:50%;background:var(--red);box-shadow:0 0 8px rgba(242,139,130,.7)}
.dbg-item{border-bottom:1px solid var(--line2)}
.dbg-item:last-child{border-bottom:0}
.dbg-btn{width:100%;display:flex;align-items:center;gap:1rem;background:transparent;border:0;color:var(--t1);text-align:left;padding:1rem 1.15rem;cursor:pointer;font-family:var(--body);transition:background .2s}
.dbg-btn:hover{background:rgba(138,180,248,.03)}
.dbg-btn .bug-id{font-family:var(--mono);font-size:.66rem;color:var(--red);white-space:nowrap;letter-spacing:.06em}
.dbg-btn .bug-t{flex:1;font-size:.93rem;font-weight:500}
.dbg-btn .chev{font-family:var(--mono);color:var(--t2);transition:transform .25s;font-size:.8rem}
.dbg-item.open .chev{transform:rotate(90deg);color:var(--cyan)}
.dbg-detail{max-height:0;overflow:hidden;transition:max-height .4s ease}
.dbg-item.open .dbg-detail{max-height:560px}
.dbg-cols{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--line2);border-top:1px solid var(--line2)}
.dbg-cell{background:var(--cell);padding:.95rem 1.15rem}
.dbg-cell .k{font-family:var(--mono);font-size:.6rem;letter-spacing:.12em;text-transform:uppercase;display:block;margin-bottom:.35rem}
.dbg-cell .k.rc{color:var(--red)}.dbg-cell .k.fx{color:var(--phos)}.dbg-cell .k.vf{color:var(--cyan)}.dbg-cell .k.sy{color:var(--gold)}
.dbg-cell p{color:var(--t2);font-size:.85rem;margin:0}
.dbg-cell p code{font-family:var(--mono);font-size:.82em;color:var(--cyan);background:rgba(138,180,248,.06);padding:.05em .3em;border-radius:3px}
.falsified{margin-top:1rem;border:1px dashed rgba(253,214,99,.3);border-radius:10px;padding:1rem 1.2rem;background:rgba(253,214,99,.02)}
.falsified .fk{font-family:var(--mono);font-size:.64rem;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-bottom:.5rem}
.falsified p{font-size:.86rem;color:var(--t2);margin-bottom:.5rem}
.falsified p:last-child{margin-bottom:0}
.falsified b{color:var(--t1)}
.falsified .x{color:var(--red);font-family:var(--mono)}

/* validation checklist */
.val-list{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:.6rem 1.6rem}
.val-list li{position:relative;padding-left:1.7rem;color:var(--t2);font-size:.9rem}
.val-list li::before{content:'✓';position:absolute;left:0;top:0;color:var(--phos);font-family:var(--mono);font-weight:700}
.val-list li b{color:var(--t1)}
.val-list li .mono{font-family:var(--mono);font-size:.85em;color:var(--cyan)}

/* GDS flow (kept) */
.gdsflow{display:flex;align-items:stretch;gap:0;flex-wrap:wrap;margin-top:.4rem}
.gstage{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;position:relative;opacity:.32;transition:opacity .45s,color .45s;color:var(--t2)}
.gdsflow.lit .gstage{opacity:1}
.gnode{width:100%;text-align:center;font-family:var(--mono);font-size:.6rem;letter-spacing:.03em;padding:.5rem .2rem;border:1px solid var(--line);border-radius:6px;background:var(--surface);transition:border-color .45s,box-shadow .45s,color .45s;cursor:default;position:relative}
.gdsflow.lit .gstage .gnode{border-color:rgba(138,180,248,.35);color:var(--cyan)}
.gdsflow.lit .gstage.last .gnode{border-color:var(--phos);color:var(--phos);box-shadow:0 0 16px rgba(197,138,249,.3)}
.gnode .gtip{position:absolute;bottom:120%;left:50%;transform:translateX(-50%);white-space:nowrap;background:var(--surface);border:1px solid var(--cyan);color:var(--cyan);font-size:.58rem;padding:.2rem .5rem;border-radius:4px;opacity:0;pointer-events:none;transition:.2s;z-index:5}
.gnode:hover .gtip{opacity:1}
.garrow{align-self:center;color:var(--line);font-size:.7rem;padding:0 .2rem;margin-top:-.2rem;transition:color .45s}
.gdsflow.lit .garrow{color:var(--cyan)}
.miniterm{background:#0E0F10;border:1px solid var(--line);border-radius:8px;padding:.9rem 1rem;font-family:var(--mono);font-size:.7rem;line-height:1.7;color:var(--t2);white-space:pre;overflow-x:auto}
.miniterm .k{color:var(--phos)}.miniterm .v{color:var(--cyan)}

/* skills (kept) */
.skgroup{margin-bottom:2.4rem}
.skgroup h3{font-family:var(--mono);font-size:.82rem;color:var(--t2);margin-bottom:1rem}
.skgroup h3::before{content:'// ';color:var(--violet)}
.skgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:.4rem 2rem}
.skrow{display:flex;align-items:center;gap:1rem;padding:.5rem .2rem;border-bottom:1px solid var(--line2)}
.skrow .name{flex:1;font-size:.9rem;color:var(--t1);min-width:0}
.skrow .tier{font-family:var(--mono);font-size:.56rem;letter-spacing:.08em;padding:.12rem .45rem;border-radius:4px;white-space:nowrap}
.tier.e{color:var(--phos);background:rgba(197,138,249,.08);border:1px solid rgba(197,138,249,.25)}
.tier.p{color:var(--cyan);background:rgba(138,180,248,.07);border:1px solid rgba(138,180,248,.2)}
.tier.f{color:var(--t2);background:rgba(154,160,166,.06);border:1px solid rgba(154,160,166,.2)}
.scope{width:118px;height:32px;flex:none;background:#0E0F10;border:1px solid var(--line);border-radius:5px}
.scope polyline.grid{stroke:rgba(138,180,248,.06);stroke-width:1}
.scope polyline.trace{fill:none;stroke:var(--phos);stroke-width:1.6;stroke-linejoin:round;stroke-linecap:round;opacity:.4;stroke-dasharray:100;stroke-dashoffset:0}
.skrow:hover .trace{opacity:1;filter:drop-shadow(0 0 3px rgba(197,138,249,.7));animation:draw .8s ease-out}
@keyframes draw{from{stroke-dashoffset:100}to{stroke-dashoffset:0}}

/* education (kept) */
.edu-grid{display:grid;grid-template-columns:1.4fr 1fr;gap:1.6rem;margin-bottom:1.6rem}
.edu-card{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:1.8rem}
.edu-card .deg{font-family:var(--disp);font-weight:600;font-size:1.3rem}
.edu-card .inst{color:var(--cyan);font-size:.95rem;margin-top:.2rem}
.edu-card .yr{font-family:var(--mono);font-size:.76rem;color:var(--t2);margin-top:.4rem}
.edu-card .cw{margin-top:1.1rem;display:flex;flex-wrap:wrap;gap:.4rem}
.csp{position:relative;overflow:hidden;background:linear-gradient(150deg,rgba(253,214,99,.08),rgba(30,31,32,.9));border:1px solid rgba(253,214,99,.3);border-radius:14px;padding:1.8rem;display:flex;flex-direction:column;justify-content:center}
.csp::after{content:'';position:absolute;top:0;left:-60%;width:40%;height:100%;background:linear-gradient(105deg,transparent,rgba(253,214,99,.22),transparent);animation:shimmer 4.5s ease-in-out infinite}
@keyframes shimmer{0%{left:-60%}55%,100%{left:130%}}
.csp .badge{font-family:var(--mono);font-size:.64rem;letter-spacing:.14em;text-transform:uppercase;color:var(--gold)}
.csp .t{font-family:var(--disp);font-weight:700;font-size:1.5rem;color:var(--gold);margin:.4rem 0;position:relative;z-index:2}
.csp .d{color:var(--t2);font-size:.86rem;position:relative;z-index:2}
.lead-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}
.lead{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:1.4rem;transition:.25s}
.lead:hover{border-color:rgba(197,138,249,.4);transform:translateY(-3px)}
.lead .role{font-family:var(--mono);font-size:.64rem;letter-spacing:.1em;text-transform:uppercase;color:var(--violet)}
.lead .ti{font-family:var(--disp);font-weight:600;font-size:1rem;margin:.4rem 0 .5rem}
.lead .de{color:var(--t2);font-size:.85rem}

/* ---------- journey (the longer arc) ---------- */
.jny-intro{margin-bottom:3.4rem}
.jny-prose p{color:var(--t2);font-size:1.02rem;margin-bottom:1.05rem;max-width:64ch}
.jny-prose strong{color:var(--t1);font-weight:600}
/* unified professional hyperlink - used for professor links, the RPVV film link,
   and any future inline link. Underline brightens + thickens subtly on hover. */
.yro .plink{color:var(--cyan);font-weight:500;text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px;text-decoration-color:rgba(138,180,248,.5);transition:color .2s,text-decoration-color .2s}
.yro .plink:hover{text-decoration-color:currentColor;text-decoration-thickness:2px}
.yro.light .plink{text-decoration-color:rgba(26,115,232,.45)}
.yro.light .plink:hover{text-decoration-color:currentColor}
.fig{background:var(--surface);border:1px solid var(--line);border-radius:14px;overflow:hidden}
.fig-img{width:100%;display:block;object-fit:cover}
.fig-fallback{display:flex;align-items:center;justify-content:center;text-align:center;padding:2rem;font-family:var(--mono);font-size:.66rem;letter-spacing:.12em;text-transform:uppercase;color:var(--t2);background:repeating-linear-gradient(45deg,transparent 0 12px,rgba(154,160,166,.05) 12px 24px)}
.fig-cap{display:flex;align-items:baseline;justify-content:space-between;gap:1rem;padding:.7rem 1rem;border-top:1px solid var(--line);font-family:var(--mono);font-size:.62rem;letter-spacing:.09em;text-transform:uppercase;color:var(--t2)}
.fig-cap b{color:var(--cyan);font-weight:500;white-space:nowrap}
.tl{position:relative;list-style:none;margin-bottom:3.2rem}
.tl::before{content:'';position:absolute;left:7px;top:8px;bottom:8px;width:2px;background:linear-gradient(180deg,rgba(138,180,248,.5),rgba(197,138,249,.5))}
.tl-item{position:relative;padding:0 0 2.3rem 2.3rem}
.tl-item:last-child{padding-bottom:0}
.tl-item::before{content:'';position:absolute;left:2px;top:.28rem;width:12px;height:12px;border-radius:4px;background:var(--bg);border:2px solid var(--cyan);box-shadow:0 0 12px rgba(138,180,248,.45)}
.tl-item.gold::before{border-color:var(--gold);box-shadow:0 0 12px rgba(253,214,99,.45)}
.tl-item.last::before{border-color:var(--phos);box-shadow:0 0 12px rgba(197,138,249,.5)}
.tl-yr{font-family:var(--mono);font-size:.74rem;font-weight:700;letter-spacing:.12em;color:var(--cyan)}
.tl-item.gold .tl-yr{color:var(--gold)}
.tl-item.last .tl-yr{color:var(--phos)}
.tl-tag{font-family:var(--mono);font-size:.6rem;letter-spacing:.15em;text-transform:uppercase;color:var(--t2);margin-left:.85rem}
.tl-ti{font-family:var(--disp);font-weight:600;font-size:1.12rem;margin:.35rem 0 .4rem}
.tl-de{color:var(--t2);font-size:.93rem;max-width:72ch}
.tl-de b{color:var(--t1);font-weight:600}
.tl-award{display:inline-flex;align-items:center;gap:.5rem;margin-top:.85rem;font-family:var(--mono);font-size:.66rem;letter-spacing:.06em;color:var(--gold);border:1px dashed rgba(253,214,99,.4);border-radius:999px;padding:.32rem .85rem;background:rgba(253,214,99,.03)}
.tl-photos{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,320px));gap:1rem;margin-top:1.15rem}
.duo-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.2rem}
.side-card{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:1.7rem;display:flex;flex-direction:column;gap:.85rem;transition:border-color .25s,transform .25s}
.side-card:hover{border-color:rgba(138,180,248,.4);transform:translateY(-3px)}
.side-card .sc-tag{font-family:var(--mono);font-size:.62rem;letter-spacing:.15em;text-transform:uppercase;color:var(--violet)}
.side-card h3{font-family:var(--disp);font-weight:600;font-size:1.18rem}
.side-card p{color:var(--t2);font-size:.92rem}
.side-card p b{color:var(--t1);font-weight:600}
.side-card .sc-cta{margin-top:auto;align-self:flex-start}
.wave{display:flex;align-items:center;gap:3px;height:36px}
.wave i{flex:none;width:3px;height:100%;border-radius:2px;background:var(--cyan);transform-origin:center;animation:wv 1.6s ease-in-out infinite}
@keyframes wv{0%,100%{transform:scaleY(.35);opacity:.55}50%{transform:scaleY(1);opacity:1}}
.apt{color:var(--phos);transition:transform .6s cubic-bezier(.2,.7,.3,1)}
.side-card:hover .apt{transform:rotate(30deg)}

/* contact (kept) */
.contact{text-align:center}
.contact h2{font-family:var(--disp);font-weight:700;font-size:clamp(1.9rem,4.5vw,3rem);letter-spacing:-.02em}
.pill{display:inline-flex;gap:.5rem;align-items:center;font-family:var(--mono);font-size:.76rem;color:var(--phos);background:rgba(197,138,249,.06);border:1px solid rgba(197,138,249,.2);border-radius:999px;padding:.5rem 1.1rem;margin:1.2rem 0 .3rem}
.contact .sub{color:var(--t2);max-width:56ch;margin:.4rem auto 2.4rem}
.cc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.2rem;max-width:760px;margin:0 auto}
.cc{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:1.5rem 1.2rem;transition:.25s;display:block}
.cc:hover{border-color:var(--cyan);transform:translateY(-4px);box-shadow:0 14px 34px rgba(138,180,248,.12)}
.cc .ico{color:var(--cyan);margin-bottom:.7rem;display:flex;justify-content:center}
.cc .lab{font-family:var(--mono);font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;color:var(--t2)}
.cc .val{font-size:.9rem;margin-top:.25rem;word-break:break-word}

.footer{border-top:1px solid transparent;position:relative;margin-top:2.5rem}
.footer::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--cyan),transparent);opacity:.5}
.footer-in{max-width:1180px;margin:0 auto;padding:1.7rem 1.5rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;font-family:var(--mono);font-size:.74rem;color:var(--t2)}
.footer-in .mid{display:flex;gap:1.3rem;flex-wrap:wrap}
.footer-in a:hover{color:var(--cyan)}

.reveal{opacity:0;transform:translateY(28px);transition:opacity .5s ease-out,transform .5s ease-out}
.reveal.in{opacity:1;transform:none}

/* long-form body copy is justified; headings, labels, badges, buttons and metrics are not */
.about-prose p,.sec-sub,.cs-sec p,.dec .dd,.pc-role,.pc-sum,.jny-prose p,.tl-de,.side-card p,.dbg-cell p,.falsified p,.contact .sub{text-align:justify}

/* diagram animations */
@keyframes pxPulse{0%{offset-distance:0%}100%{offset-distance:100%}}
.flowdot{animation:dash 3.4s linear infinite}
@keyframes dash{to{stroke-dashoffset:-200}}
.spiflow{stroke-width:2.4;stroke-linecap:round;stroke-dasharray:3 26;animation:dash 2.1s linear infinite;pointer-events:none}
.spiflow.tx{stroke:#8AB4F8;filter:drop-shadow(0 0 3px rgba(138,180,248,.8))}
.spiflow.rx{stroke:#81C995;filter:drop-shadow(0 0 3px rgba(129,201,149,.8));animation-duration:1.6s}

/* ---------- theme toggle ---------- */
.nav-right{display:flex;align-items:center;gap:1.2rem}
.theme-btn{display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;border:1px solid var(--line);background:transparent;color:var(--t2);cursor:pointer;transition:color .2s,border-color .2s,transform .2s}
.theme-btn:hover{color:var(--cyan);border-color:var(--cyan);transform:rotate(18deg)}

/* ---------- light theme (Google light palette) ----------
   Terminals, diagrams, miniterms, scopes, and the chip die stay
   dark by design - instrument screens embedded in a light page. */
.yro.light{
  --bg:#FFFFFF; --surface:#F8F9FA; --line:#DADCE0; --line2:#E8EAED;
  --cyan:#1A73E8; --phos:var(--violet); --violet:#8430CE;
  --gold:#B06000; --red:#D93025; --t1:#202124; --t2:#5F6368;
  --card:#F8F9FA; --cell:#FFFFFF; --onfill:#FFFFFF;
  /* light elevation = shadow (Google elevation curves); dark keeps tone+border */
  --elev-1:0 1px 2px rgba(60,64,67,.3),0 1px 3px 1px rgba(60,64,67,.15);
  --elev-2:0 1px 3px rgba(60,64,67,.3),0 4px 8px 3px rgba(60,64,67,.15);
  /* light diagrams: approved blue/white engineering palette */
  --dg-bg:#F8FBFF; --dg-border:#D8E7FF;
  --dg-box:#FFFFFF; --dg-box2:#EEF5FF;
  --dg-t1:#202124; --dg-t2:#5F6368;
  --dg-blue:#2563EB; --dg-stroke:rgba(37,99,235,.45); --dg-stroke2:rgba(37,99,235,.5); --dg-stroke3:rgba(37,99,235,.6); --dg-arrow:rgba(37,99,235,.65);
  --dg-frame1:rgba(37,99,235,.3); --dg-frame2:rgba(29,78,216,.3);
  --dg-green:#1D4ED8; --dg-green-stroke:rgba(29,78,216,.45); --dg-green-stroke2:rgba(29,78,216,.5); --dg-green-grant:rgba(29,78,216,.7);
  --dg-glow:rgba(37,99,235,.35); --dg-glow-soft:rgba(37,99,235,.25); --dg-glowb:rgba(37,99,235,.3);
  --dg-gold:#B06000; --dg-gold-stroke:rgba(176,96,0,.5);
  --dg-violet:#8430CE; --dg-violet-stroke:rgba(132,48,206,.45); --dg-violet-dash:rgba(132,48,206,.4);
}
.yro.light .cs-wrap,.yro.light .edu-card,.yro.light .csp,.yro.light .lead,.yro.light .pcard,
.yro.light .side-card,.yro.light .cc,.yro.light .fig,.yro.light .statbar{box-shadow:var(--elev-1)}
.yro.light .pcard{background:var(--surface)}
.yro.light .pcard .cs-wrap{background:transparent;box-shadow:none}
.yro.light .lead:hover,.yro.light .side-card:hover,.yro.light .cc:hover{box-shadow:var(--elev-2)}
.yro.light ::selection{background:rgba(26,115,232,.18);color:#202124}
.yro.light .nav.scrolled{background:rgba(255,255,255,.85)}
.yro.light .overlay{background:rgba(255,255,255,.97)}
.yro.light .nav-cta{border-color:rgba(132,48,206,.45)}
.yro.light .cs-wrap{background:var(--surface)}
.yro.light .dec{background:#FFFFFF}
.yro.light .tl-award{border-color:rgba(227,116,0,.45);background:rgba(227,116,0,.04)}
.yro.light .falsified{border-color:rgba(227,116,0,.4);background:rgba(227,116,0,.03)}
.yro.light .csp{background:linear-gradient(150deg,rgba(227,116,0,.07),#FFFFFF);border-color:rgba(227,116,0,.35)}
.yro.light .csp::after{background:linear-gradient(105deg,transparent,rgba(227,116,0,.12),transparent)}
/* terminals keep their original dark readout colors (they are instruments, not chrome) */
.yro.light .term-bar{background:#1E1F20;border-color:#37393B}
.yro.light .term-bar span{color:#9AA0A6}
.yro.light .term-body .cmd{color:#C58AF9}
.yro.light .term-body .cmd::before{color:#8AB4F8}
.yro.light .term-body .out{color:#E8EAED}
.yro.light .term-body .dim{color:#9AA0A6}
.yro.light .term-body .hl{color:#FDD663}
.yro.light .term-cursor{background:#C58AF9}
.yro.light .miniterm{color:#9AA0A6}
.yro.light .miniterm .k{color:#C58AF9}
.yro.light .miniterm .v{color:#8AB4F8}
/* light-theme waveforms: approved blue/white scope design */
.yro.light .scope{background:#F8FBFF;border-color:#D8E7FF;transition:background .2s,border-color .2s,box-shadow .2s}
.yro.light .scope polyline.grid{stroke:rgba(59,130,246,.12)}
.yro.light .scope polyline.trace{stroke:#3B82F6;opacity:.75}
.yro.light .skrow:hover .scope{background:#EEF5FF;border-color:#8AB9FF;box-shadow:0 0 18px rgba(37,99,235,.28)}
.yro.light .skrow:hover .trace{stroke:#2563EB;opacity:1;filter:drop-shadow(0 0 3px rgba(37,99,235,.35));animation:draw .45s ease-out}
/* light-theme SPI flow pulses ride the blue palette */
.yro.light .spiflow.tx{stroke:#2563EB;filter:drop-shadow(0 0 3px rgba(37,99,235,.55))}
.yro.light .spiflow.rx{stroke:#1D4ED8;filter:drop-shadow(0 0 3px rgba(29,78,216,.55))}
/* light-theme hero chip die: same geometry/animation, blue/white body.
   Flat #F8FBFF body (no gradient per spec); blue borders, labels, shadows. */
.yro.light .die-face{background:#F8FBFF;border-color:#D8E7FF;box-shadow:0 0 0 1px rgba(37,99,235,.08),inset 0 0 60px rgba(37,99,235,.05),0 30px 60px rgba(37,99,235,.18)}
.yro.light .die-face::before{border-color:rgba(37,99,235,.14)}
.yro.light .block{background:#FFFFFF;border-color:#D8E7FF;color:#3B82F6}
.yro.light .block:hover{background:#EEF5FF;border-color:#3B82F6;color:#2563EB;box-shadow:0 0 18px rgba(37,99,235,.28)}
.yro.light .block .tip{background:#FFFFFF;border-color:#2563EB;color:#2563EB;box-shadow:var(--elev-1)}
.yro.light .die-core{background:#EEF5FF;border-color:#8AB9FF}
.yro.light .die-core:hover{background:#DCEAFF;border-color:#1D4ED8;color:#1D4ED8;box-shadow:0 0 22px rgba(29,78,216,.3)}
.yro.light .die-pins i{background:linear-gradient(#3B82F6,transparent)}

/* ---------- resume viewer modal ---------- */
.rmodal-backdrop{position:fixed;inset:0;z-index:80;background:rgba(0,0,0,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:1.2rem;animation:rmFade .2s ease-out}
@keyframes rmFade{from{opacity:0}to{opacity:1}}
.yro.light .rmodal-backdrop{background:rgba(32,33,36,.45)}
.rmodal{width:min(900px,100%);height:min(88vh,1100px);display:flex;flex-direction:column;background:var(--surface);border:1px solid var(--line);border-radius:14px;overflow:hidden;box-shadow:0 40px 90px rgba(0,0,0,.5)}
.yro.light .rmodal{box-shadow:0 24px 70px rgba(32,33,36,.3)}
.rmodal-bar{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.7rem 1rem;border-bottom:1px solid var(--line);background:var(--card)}
.rmodal-title{font-family:var(--mono);font-size:.74rem;color:var(--t2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rmodal-actions{display:flex;align-items:center;gap:.6rem;flex:none}
.rm-btn{padding:.45rem .9rem;font-size:.72rem}
.rmodal-x{width:38px;height:38px;flex:none;border-radius:50%;border:1px solid var(--line);background:transparent;color:var(--t1);font-size:1.35rem;line-height:1;cursor:pointer;transition:color .2s,border-color .2s}
.rmodal-x:hover{border-color:var(--red);color:var(--red)}
.rmodal-frame{flex:1;width:100%;border:0;background:#525659}
@media(max-width:640px){
  .rmodal{height:92vh}
  .rmodal-backdrop{padding:.6rem}
  .rm-btn{padding:.4rem .7rem;font-size:.62rem}
  .rmodal-title{display:none}
}

/* ---------- recruiter notes: edge tab + drawer ---------- */
.rq-trigger{position:fixed;top:50%;right:0;transform:translateY(-50%);z-index:40;display:flex;align-items:center;gap:.6rem;padding:1.1rem .68rem;background:linear-gradient(180deg,rgba(197,138,249,.16),rgba(197,138,249,.06));border:1px solid rgba(197,138,249,.5);border-right:0;border-radius:12px 0 0 12px;color:var(--violet);font-family:var(--mono);font-size:.72rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;writing-mode:vertical-rl;cursor:pointer;box-shadow:-6px 0 26px rgba(0,0,0,.35),0 0 20px rgba(197,138,249,.18);transition:padding .25s,box-shadow .25s,border-color .25s,background .25s;animation:rqPulse 26s ease-in-out infinite}
.rq-trigger:hover{padding-right:1.05rem;border-color:rgba(197,138,249,.8);background:linear-gradient(180deg,rgba(197,138,249,.24),rgba(197,138,249,.1));box-shadow:-8px 0 34px rgba(0,0,0,.4),0 0 30px rgba(197,138,249,.4)}
.rq-trigger:focus-visible{outline:2px solid var(--cyan);outline-offset:2px}
.rq-trigger i{width:6px;height:6px;border-radius:50%;background:var(--violet);box-shadow:0 0 9px var(--violet);flex:none}
@keyframes rqPulse{0%,92%,100%{box-shadow:-6px 0 26px rgba(0,0,0,.35),0 0 20px rgba(197,138,249,.18)}96%{box-shadow:-6px 0 26px rgba(0,0,0,.35),0 0 34px rgba(197,138,249,.6)}}
.yro.light .rq-trigger{background:linear-gradient(180deg,rgba(132,48,206,.12),rgba(132,48,206,.04));border-color:rgba(132,48,206,.45);box-shadow:-6px 0 26px rgba(32,33,36,.15),0 0 16px rgba(132,48,206,.18)}
.yro.light .rq-trigger:hover{border-color:rgba(132,48,206,.7);background:linear-gradient(180deg,rgba(132,48,206,.18),rgba(132,48,206,.07));box-shadow:-8px 0 30px rgba(32,33,36,.18),0 0 26px rgba(132,48,206,.35)}
.yro.light .rq-trigger i{box-shadow:0 0 9px rgba(132,48,206,.7)}

.rdrawer-backdrop{position:fixed;inset:0;z-index:80;background:rgba(0,0,0,.5);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);opacity:0;pointer-events:none;transition:opacity .3s}
.rdrawer-backdrop.open{opacity:1;pointer-events:auto}
.yro.light .rdrawer-backdrop{background:rgba(32,33,36,.4)}
.rdrawer{position:fixed;top:0;right:0;bottom:0;z-index:81;width:min(460px,92vw);display:flex;flex-direction:column;background:var(--surface);border-left:1px solid var(--line);box-shadow:-30px 0 80px rgba(0,0,0,.5);transform:translateX(100%);visibility:hidden;transition:transform .4s cubic-bezier(.2,.7,.3,1),visibility 0s .4s}
.rdrawer.open{transform:translateX(0);visibility:visible;transition:transform .4s cubic-bezier(.2,.7,.3,1)}
.yro.light .rdrawer{box-shadow:-24px 0 70px rgba(32,33,36,.25)}
.rdrawer-head{position:sticky;top:0;z-index:2;background:var(--card);border-bottom:1px solid var(--line);padding:1.35rem 1.5rem;display:flex;align-items:flex-start;justify-content:space-between;gap:1rem}
.rdrawer-head h2{font-family:var(--disp);font-weight:700;font-size:1.28rem;letter-spacing:-.01em}
.rdrawer-head p{color:var(--t2);font-size:.82rem;margin-top:.4rem;max-width:30ch}
.rdrawer-x{width:36px;height:36px;flex:none;border-radius:50%;border:1px solid var(--line);background:transparent;color:var(--t1);font-size:1.3rem;line-height:1;cursor:pointer;transition:color .2s,border-color .2s}
.rdrawer-x:hover{border-color:var(--red);color:var(--red)}
.rdrawer-body{flex:1;overflow-y:auto;padding:1.5rem}
.rq-section{margin-bottom:1.8rem}
.rq-section:last-child{margin-bottom:0}
.rq-section .cs-label{margin-bottom:.75rem}
.rq-list{display:flex;flex-direction:column;gap:.7rem}
.rq-list .dec .dt{font-size:.92rem}
.rq-list .dec .dd{font-size:.86rem}
.rdrawer-foot{border-top:1px solid var(--line);padding:1.15rem 1.5rem;display:flex;gap:.6rem;flex-wrap:wrap;flex:none}
/* below 1300px the hero's die illustration can reach close enough to the
   viewport edge that the vertical edge-tab risks overlapping it - drop to
   the compact corner pill well before that gets tight, not just on mobile */
@media(max-width:1300px){
  .rq-trigger{top:auto;bottom:1.1rem;right:1.1rem;transform:none;writing-mode:horizontal-tb;border-radius:999px;padding:.72rem 1.2rem;box-shadow:0 12px 32px rgba(0,0,0,.4),0 0 20px rgba(197,138,249,.25);animation:none}
  .rq-trigger:hover{padding-right:1.2rem}
  .yro.light .rq-trigger{box-shadow:0 12px 32px rgba(32,33,36,.3),0 0 18px rgba(132,48,206,.3)}
}
@media(max-width:940px){
  .rdrawer{width:100vw}
}

@media(max-width:940px){
  .hero-grid{grid-template-columns:1fr;grid-template-areas:"copy" "die" "actions";gap:2rem;padding-top:6.5rem}
  .about-grid,.dec-grid,.edu-grid,.dbg-cols{grid-template-columns:1fr}
  .skgrid,.val-list{grid-template-columns:1fr}
  .lead-grid,.cc-grid{grid-template-columns:1fr}
  .duo-grid,.tl-photos{grid-template-columns:1fr}
  .nav-links{display:none}
  .burger{display:flex;padding:10px}
  .theme-btn{width:44px;height:44px}
  .statbar{grid-template-columns:repeat(2,1fr)}
  .cs-head,.cs-body,.pc-head{padding-left:1.3rem;padding-right:1.3rem}
}
@media(max-width:480px){
  .section{padding:4.2rem 1.15rem}
  .footer-in{flex-direction:column;text-align:center}
}
@media(prefers-reduced-motion:reduce){
  .rmodal-backdrop{animation:none;backdrop-filter:none;-webkit-backdrop-filter:none}
  .pc-body,.pcard.open .pc-body{transition:visibility 0s}
  .pc-chev{transition:none}
  .die{animation:none;transform:rotateX(52deg) rotateZ(0)}
  .die-glow{animation:none;opacity:.97}
  .csp::after,.term-cursor,.hero .kicker::before{animation:none}
  .reveal{opacity:1;transform:none;transition:none}
  .skrow:hover .trace{animation:none}
  .flowdot,.spiflow{animation:none;display:none}
  .wave i{animation:none;transform:scaleY(.7)}
  .side-card:hover .apt{transform:none}
  .rq-trigger{animation:none}
  .rdrawer,.rdrawer-backdrop{transition:none}
}

/* ---------- print ---------- */
@media print{
  .bg-lattice,.hero-canvas,.nav,.overlay,.burger,.theme-btn,.skip,.rmodal-backdrop,.hero-fade,.die-scene,.rq-trigger,.rdrawer-backdrop,.rdrawer{display:none!important}
  .yro{background:#fff!important;color:#111!important}
  .yro,.yro *{box-shadow:none!important;text-shadow:none!important;animation:none!important;transition:none!important}
  .section{padding:1.2rem 0;max-width:100%}
  .cs-wrap,.pcard,.edu-card,.csp,.side-card,.cc,.fig,.terminal,.dbg{border:1px solid #ccc!important;background:#fff!important;break-inside:avoid}
  .pc-body,.pcard.open .pc-body{grid-template-rows:1fr!important;visibility:visible!important}
  .pc-btn{display:none}
  .dbg-detail{max-height:none!important}
  a[href]::after{content:" (" attr(href) ")";font-size:.7em;color:#555}
  a[href^="#"]::after{content:""}
}
`;

/* ============================================================
   SHARED PRIMITIVES
   ============================================================ */
function Reveal({ children, delay = 0, className = "", as: Tag = "div", ...rest }) {
  const ref = useRef(null);
  /* revealed state must live in React state, not an imperative classList.add -
     otherwise any re-render that changes className (e.g. CaseStudy toggling
     "open") rewrites the attribute and silently wipes the "in" class. */
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { setSeen(true); io.unobserve(el); } }),
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal${seen ? " in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}

function LatticeCanvas({ light }) {
  const ref = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cv = ref.current, ctx = cv.getContext("2d");
    /* dark: soft glow-blue; light: Google blue at lower alpha (dark-on-light reads stronger) */
    const rgb = light ? "26,115,232" : "138,180,248";
    const lineA = light ? 0.04 : 0.05, dotA = light ? 0.12 : 0.18;
    let w, h, dpr, pts = [], raf = 0, running = false;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.width = innerWidth * dpr; h = cv.height = innerHeight * dpr;
      cv.style.width = innerWidth + "px"; cv.style.height = innerHeight + "px";
      const n = Math.min(66, Math.round((innerWidth * innerHeight) / 27000));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.12 * dpr, vy: (Math.random() - 0.5) * 0.12 * dpr,
      }));
    };
    resize(); addEventListener("resize", resize);
    const link = 140 * dpr;
    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.hypot(dx, dy);
          if (d < link) {
            ctx.strokeStyle = `rgba(${rgb},${lineA * (1 - d / link)})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
          }
        }
        ctx.fillStyle = `rgba(${rgb},${dotA})`;
        ctx.beginPath(); ctx.arc(pts[i].x, pts[i].y, 1.1 * dpr, 0, 7); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(draw); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    start();
    return () => { stop(); document.removeEventListener("visibilitychange", onVis); removeEventListener("resize", resize); };
  }, [light]);
  return <canvas ref={ref} className="bg-lattice" aria-hidden="true" />;
}

function PcbCanvas({ light }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rgb = light ? "26,115,232" : "138,180,248";
    const traceA = light ? 0.12 : 0.15, nodeA = light ? 0.35 : 0.5, pulseA = light ? 0.75 : 0.9;
    let w, h, dpr, nodes = [], traces = [], raf = 0, t = 0, running = false, inView = true;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const p = cv.parentElement;
      w = cv.width = p.clientWidth * dpr; h = cv.height = p.clientHeight * dpr;
      cv.style.width = p.clientWidth + "px"; cv.style.height = p.clientHeight + "px";
      const n = Math.min(54, Math.round((p.clientWidth * p.clientHeight) / 23000));
      nodes = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h }));
      traces = [];
      nodes.forEach((a) => {
        let best = null, bd = Infinity;
        nodes.forEach((b) => {
          if (b === a) return;
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < bd && d > 30 * dpr) { bd = d; best = b; }
        });
        if (best && bd < 320 * dpr) {
          const horizFirst = Math.random() > 0.5;
          const corner = horizFirst ? { x: best.x, y: a.y } : { x: a.x, y: best.y };
          traces.push({ a, corner, b: best, phase: Math.random(), speed: 0.002 + Math.random() * 0.004 });
        }
      });
    };
    resize(); addEventListener("resize", resize);
    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1.1 * dpr;
      for (const tr of traces) {
        ctx.strokeStyle = `rgba(${rgb},${traceA})`;
        ctx.beginPath(); ctx.moveTo(tr.a.x, tr.a.y); ctx.lineTo(tr.corner.x, tr.corner.y); ctx.lineTo(tr.b.x, tr.b.y); ctx.stroke();
      }
      for (const nd of nodes) {
        ctx.fillStyle = `rgba(${rgb},${nodeA})`;
        ctx.beginPath(); ctx.arc(nd.x, nd.y, 2 * dpr, 0, 7); ctx.fill();
      }
    };
    if (reduce) { drawStatic(); return () => removeEventListener("resize", resize); }
    const draw = () => {
      if (!running) return;
      t += 1;
      drawStatic();
      for (const tr of traces) {
        tr.phase += tr.speed;
        if (tr.phase > 1.4) tr.phase = -Math.random() * 0.6;
        if (tr.phase < 0 || tr.phase > 1) continue;
        const seg1 = Math.abs(tr.a.x - tr.corner.x) + Math.abs(tr.a.y - tr.corner.y);
        const seg2 = Math.abs(tr.corner.x - tr.b.x) + Math.abs(tr.corner.y - tr.b.y);
        const total = seg1 + seg2 || 1;
        const dist = tr.phase * total;
        let px, py;
        if (dist <= seg1) { const r = seg1 ? dist / seg1 : 0; px = tr.a.x + (tr.corner.x - tr.a.x) * r; py = tr.a.y + (tr.corner.y - tr.a.y) * r; }
        else { const r = seg2 ? (dist - seg1) / seg2 : 0; px = tr.corner.x + (tr.b.x - tr.corner.x) * r; py = tr.corner.y + (tr.b.y - tr.corner.y) * r; }
        const g = ctx.createRadialGradient(px, py, 0, px, py, 6 * dpr);
        g.addColorStop(0, `rgba(${rgb},${pulseA})`); g.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, 6 * dpr, 0, 7); ctx.fill();
      }
      for (let i = 0; i < nodes.length; i++) {
        const nd = nodes[i];
        const pulse = (Math.sin(t * 0.03 + i) + 1) / 2;
        const g = ctx.createRadialGradient(nd.x, nd.y, 0, nd.x, nd.y, (5 + pulse * 6) * dpr);
        g.addColorStop(0, `rgba(${rgb},${(light ? 0.09 : 0.12) + pulse * (light ? 0.11 : 0.14)})`); g.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(nd.x, nd.y, (5 + pulse * 6) * dpr, 0, 7); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    const start = () => { if (!running && inView && !document.hidden) { running = true; raf = requestAnimationFrame(draw); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    /* pause the loop when the hero is scrolled away or the tab is hidden */
    const io = new IntersectionObserver((es) => { inView = es[0].isIntersecting; inView ? start() : stop(); });
    io.observe(cv);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    start();
    return () => { stop(); io.disconnect(); document.removeEventListener("visibilitychange", onVis); removeEventListener("resize", resize); };
  }, [light]);
  return <canvas ref={ref} className="hero-canvas" aria-hidden="true" />;
}

function Scope({ tier }) {
  const W = 118, H = 32, hi = 7, lo = 25;
  const cfg = { EXPERT: { duty: 0.72, periods: 5 }, PROFICIENT: { duty: 0.5, periods: 4 }, FAMILIAR: { duty: 0.3, periods: 3 } }[tier];
  const per = W / cfg.periods;
  let pts = `2,${lo}`;
  for (let i = 0; i < cfg.periods; i++) {
    const x0 = 2 + i * per, xr = x0 + per * cfg.duty, x1 = x0 + per;
    pts += ` ${x0},${lo} ${x0},${hi} ${xr},${hi} ${xr},${lo} ${x1},${lo}`;
  }
  return (
    <svg className="scope" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" preserveAspectRatio="none">
      <polyline className="grid" points={`0,16 ${W},16`} />
      <polyline className="trace" points={pts} pathLength="100" />
    </svg>
  );
}

/* Annotated photograph - engineering-doc figure, not a profile card.
   Falls back to a hatched frame (caption intact) if the file is absent. */
function Photo({ src, alt, cap, sub, ratio = "3 / 2", pos = "50% 50%", className = "" }) {
  const [failed, setFailed] = useState(false);
  return (
    <figure className={`fig ${className}`}>
      {failed ? (
        <div className="fig-fallback" style={{ aspectRatio: ratio }}>{alt}</div>
      ) : (
        <img className="fig-img" src={src} alt={alt} loading="lazy" style={{ aspectRatio: ratio, objectPosition: pos }} onError={() => setFailed(true)} />
      )}
      <figcaption className="fig-cap"><b>{cap}</b><span>{sub}</span></figcaption>
    </figure>
  );
}

const WAVE_BARS = [38, 72, 55, 90, 62, 100, 48, 80, 34, 66, 88, 52, 74, 40, 96, 58, 82, 44, 70, 30];
function PodWave() {
  return (
    <div className="wave" aria-hidden="true">
      {WAVE_BARS.map((h, i) => <i key={i} style={{ height: `${h}%`, animationDelay: `${i * 0.09}s` }} />)}
    </div>
  );
}

/* Progressive-disclosure project card: the ~15-second summary by default,
   the complete case study revealed in place. Deep links (#id) auto-expand. */
function CaseStudy({ id, org, orgTone = "ind", domain, title, role, impact, summary, tags, children }) {
  const [open, setOpen] = useState(false);
  const linked = useRef(false);
  useEffect(() => {
    if (window.location.hash === `#${id}` && !linked.current) {
      linked.current = true;
      setOpen(true);
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 80);
    }
  }, [id]);
  return (
    <Reveal as="article" className={`pcard ${open ? "open" : ""}`} id={id}>
      <div className="pc-head">
        <div className="pc-meta">
          <span className={`pc-org ${orgTone}`}>{org}</span>
          <span className="pc-domain">{domain}</span>
        </div>
        <h3 className="pc-title">{title}</h3>
        <p className="pc-role">{role}</p>
        <p className="pc-impact">{impact}</p>
        <p className="pc-sum">{summary}</p>
        <div className="tags pc-tags">{tags.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
        <button className="btn pc-btn" aria-expanded={open} aria-controls={`${id}-body`} onClick={() => setOpen((o) => !o)}>
          {open ? "Collapse case study" : "Read the full case study"} <span className="pc-chev" aria-hidden="true">▸</span>
        </button>
      </div>
      <div className="pc-body" id={`${id}-body`}>
        <div className="pc-body-in">{children}</div>
      </div>
    </Reveal>
  );
}

/* In-page resume viewer. Focus is moved into the dialog on open, trapped
   with Tab, and returned to the invoking button on close; Escape and
   backdrop clicks close; background scroll is locked while open. */
const RESUME_PDF = "/resume/YASH_RAJ_IIIT-Delhi.pdf";
function ResumeModal({ open, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const prevFocus = useRef(null);
  useEffect(() => {
    if (!open) return;
    prevFocus.current = document.activeElement;
    const prevBody = document.body.style.overflow, prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "Tab" && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll("a[href],button");
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
      prevFocus.current?.focus?.();
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="rmodal-backdrop" onClick={onClose}>
      <div className="rmodal" role="dialog" aria-modal="true" aria-label="Résumé - Yash Raj Ojha" ref={dialogRef} onClick={(e) => e.stopPropagation()}>
        <div className="rmodal-bar">
          <span className="rmodal-title">YASH_RAJ_IIIT-Delhi.pdf</span>
          <div className="rmodal-actions">
            <a className="btn rm-btn" href={RESUME_PDF} download="YASH_RAJ_IIIT-Delhi.pdf">↓ Download PDF</a>
            <a className="btn rm-btn" href={RESUME_PDF} target="_blank" rel="noopener noreferrer">Open in New Tab ↗</a>
            <button ref={closeRef} className="rmodal-x" aria-label="Close résumé viewer" onClick={onClose}>×</button>
          </div>
        </div>
        <iframe className="rmodal-frame" src={RESUME_PDF} title="Résumé - Yash Raj Ojha (PDF)" />
      </div>
    </div>
  );
}

/* ============================================================
   DIAGRAMS (SVG, hand-built)
   ============================================================ */

/* -- shared svg helpers --
   Colors come from the --dg-* tokens via inline style (var() works in style
   declarations, not SVG presentation attributes) so both themes resolve. */
const BoxT = { fontFamily: "'Google Sans Code','Roboto Mono',monospace", fill: "var(--dg-t1)" };
const SubT = { fontFamily: "'Google Sans Code','Roboto Mono',monospace", fill: "var(--dg-t2)" };

function DBox({ x, y, w, h, title, sub, stroke = "var(--dg-stroke)", fill = "var(--dg-box)", tcolor = "var(--dg-blue)" }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="7" style={{ fill, stroke }} strokeWidth="1" />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 3 : h / 2 + 3)} textAnchor="middle" style={{ ...BoxT, fill: tcolor }} fontSize="10.5" fontWeight="700">{title}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 11} textAnchor="middle" style={SubT} fontSize="7.5">{sub}</text>}
    </g>
  );
}
function DArrow({ x1, y1, x2, y2, label, up }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} style={{ stroke: "var(--dg-stroke2)" }} strokeWidth="1.2" markerEnd="url(#arr)" />
      {label && <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 + (up ? -6 : 12)} textAnchor="middle" style={SubT} fontSize="7">{label}</text>}
    </g>
  );
}
const Defs = () => (
  <defs>
    <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" style={{ fill: "var(--dg-arrow)" }} />
    </marker>
  </defs>
);

/* -- SD controller architecture: LIVE arbitration demo --
   Cycles CTRL_INIT → CTRL_READ → CTRL_WRITE. The granted FSM glows,
   command bytes flow down MOSI (cyan), responses/data flow back up
   MISO (green), and BRAM traffic animates in the correct direction. -- */
const SD_PHASES = [
  { key: "CTRL_INIT",  fsm: 0, cap: "arbiter grant → sd_init_fsm · CMD0→CMD8→ACMD41→CMD58 @ 200 kHz", buf: null },
  { key: "CTRL_READ",  fsm: 1, cap: "arbiter grant → sd_read_fsm · CMD17 → 0xFE token → 512 B into BRAM @ 12.5 MHz", buf: "in" },
  { key: "CTRL_WRITE", fsm: 2, cap: "arbiter grant → sd_write_fsm · payload out of BRAM → CMD24 → busy poll @ 12.5 MHz", buf: "out" },
];
const FSM_GEOM = [
  { bx: 55,  cx: 135, gx1: 290, gy: 132 }, // init
  { bx: 270, cx: 350, gx1: 350, gy: 132 }, // read
  { bx: 485, cx: 565, gx1: 410, gy: 132 }, // write
];
function SdArchDiagram() {
  const [ph, setPh] = useState(0);
  const [anim, setAnim] = useState(true);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setAnim(false); return; }
    const id = setInterval(() => setPh((p) => (p + 1) % SD_PHASES.length), 3200);
    return () => clearInterval(id);
  }, []);
  const P = SD_PHASES[ph];
  const G = FSM_GEOM[P.fsm];
  const on = "var(--dg-green)", onGlow = "drop-shadow(0 0 7px var(--dg-glow))";
  const fsmStroke = (i) => (anim && i === P.fsm ? on : "var(--dg-stroke)");
  const fsmText = (i) => (anim && i === P.fsm ? on : "var(--dg-blue)");
  return (
    <div className="diagram">
      <svg viewBox="0 0 700 348" role="img" aria-label="Live SD controller architecture: sd_controller cycles SPI ownership between the init, read, and write FSMs; command traffic animates down MOSI and response data returns on MISO into the shared BRAM buffer">
        <Defs />
        <DBox x={250} y={12} w={200} h={44} title="sd_top.v" sub="reset · preload · sequencing · LED status" tcolor="var(--dg-green)" stroke="var(--dg-green-stroke)" />
        <DArrow x1={350} y1={56} x2={350} y2={84} />
        {/* controller shows the live ctrl_state */}
        <g style={anim ? { filter: "drop-shadow(0 0 6px var(--dg-glowb))" } : undefined}>
          <rect x={215} y={86} width={270} height={46} rx="7" style={{ fill: "var(--dg-box)", stroke: "var(--dg-stroke3)" }} strokeWidth="1.1" />
          <text x={350} y={104} textAnchor="middle" style={{ ...BoxT, fill: "var(--dg-blue)" }} fontSize="10.5" fontWeight="700">sd_controller.v</text>
          <text x={350} y={118} textAnchor="middle" style={SubT} fontSize="7.5">
            ctrl_state = <tspan style={{ fill: anim ? "var(--dg-green)" : "var(--dg-t2)" }} fontWeight="700">{anim ? P.key : "CTRL_IDLE"}</tspan> · request gating · buffer mux
          </text>
        </g>
        {/* grant arrows: only the granted one is lit */}
        {FSM_GEOM.map((g, i) => (
          <g key={i} opacity={anim && i !== P.fsm ? 0.28 : 1}>
            <line x1={g.gx1} y1={g.gy} x2={g.cx} y2={162} style={{ stroke: anim && i === P.fsm ? "var(--dg-green-grant)" : "var(--dg-stroke2)" }} strokeWidth="1.2" markerEnd="url(#arr)" />
          </g>
        ))}
        {/* FSM boxes, granted one glows */}
        {[["sd_init_fsm", "CMD0→CMD8→ACMD41→CMD58"], ["sd_read_fsm", "CMD17 · 0xFE token · 512 B"], ["sd_write_fsm", "CMD24 · stuff byte · busy poll"]].map((t, i) => (
          <g key={t[0]} style={anim && i === P.fsm ? { filter: onGlow } : undefined} opacity={anim && i !== P.fsm ? 0.45 : 1}>
            <rect x={FSM_GEOM[i].bx} y={164} width={160} height={42} rx="7" style={{ fill: "var(--dg-box)", stroke: fsmStroke(i) }} strokeWidth={anim && i === P.fsm ? 1.4 : 1} />
            <text x={FSM_GEOM[i].bx + 80} y={182} textAnchor="middle" style={{ ...BoxT, fill: fsmText(i) }} fontSize="10.5" fontWeight="700">{t[0]}</text>
            <text x={FSM_GEOM[i].bx + 80} y={196} textAnchor="middle" style={SubT} fontSize="7.5">{t[1]}</text>
          </g>
        ))}
        {/* FSM → SPI master routes; granted path carries moving command bytes */}
        {FSM_GEOM.map((g, i) => {
          const x2 = i === 0 ? 310 : i === 1 ? 350 : 390;
          const granted = anim && i === P.fsm;
          return (
            <g key={`r${i}`} opacity={anim && !granted ? 0.22 : 1}>
              <line x1={g.cx} y1={206} x2={x2} y2={238} style={{ stroke: "var(--dg-stroke2)" }} strokeWidth="1.2" markerEnd="url(#arr)" />
              {granted && <line className="spiflow tx" x1={g.cx} y1={206} x2={x2} y2={238} />}
            </g>
          );
        })}
        <g style={anim ? { filter: "drop-shadow(0 0 6px var(--dg-glow-soft))" } : undefined}>
          <DBox x={235} y={240} w={230} h={42} title="spi_master_universal" sub={anim ? (P.fsm === 0 ? "clk_div=250 · ~200 kHz" : "clk_div=4 · 12.5 MHz") + " · Mode 0 · cs_hold/LAST" : "1 instance · Mode 0 · runtime clk_div · cs_hold/LAST"} tcolor="var(--dg-green)" stroke="var(--dg-green-stroke)" />
        </g>
        {/* SPI bus to the card: MOSI down (cyan), MISO up (green) */}
        <line x1={343} y1={282} x2={343} y2={306} style={{ stroke: "var(--dg-stroke2)" }} strokeWidth="1.2" markerEnd="url(#arr)" />
        <line x1={357} y1={306} x2={357} y2={282} style={{ stroke: "var(--dg-green-stroke2)" }} strokeWidth="1.2" markerEnd="url(#arr)" />
        {anim && <line className="spiflow tx" x1={343} y1={282} x2={343} y2={306} />}
        {anim && <line className="spiflow rx" x1={357} y1={306} x2={357} y2={282} />}
        <text x={332} y={297} textAnchor="end" style={SubT} fontSize="6.6">MOSI · SCK · CS_n</text>
        <text x={368} y={297} style={SubT} fontSize="6.6">MISO</text>
        <text x={350} y={326} textAnchor="middle" style={{ ...BoxT, fill: "var(--dg-gold)" }} fontSize="10" fontWeight="700">microSDXC · SPI Mode 0 · 3.3 V</text>
        {/* buffer + uart; BRAM traffic animates per phase */}
        <DBox x={20} y={240} w={150} h={42} title="sd_rx_buffer" sub="512×8 BRAM · 1-cy read latency" stroke="var(--dg-violet-stroke)" tcolor="var(--dg-violet)" />
        <DBox x={530} y={240} w={150} h={42} title="uart_dump → uart_tx" sub="ASCII hex · 115200 8-N-1" stroke="var(--dg-violet-stroke)" tcolor="var(--dg-violet)" />
        <line x1={170} y1={261} x2={235} y2={261} style={{ stroke: "var(--dg-violet-dash)" }} strokeWidth="1.1" strokeDasharray="4 3" />
        <line x1={465} y1={261} x2={530} y2={261} style={{ stroke: "var(--dg-violet-dash)" }} strokeWidth="1.1" strokeDasharray="4 3" />
        {anim && P.buf === "in" && <line className="spiflow rx" x1={235} y1={261} x2={170} y2={261} />}
        {anim && P.buf === "out" && <line className="spiflow tx" x1={170} y1={261} x2={235} y2={261} />}
        {/* live caption */}
        {anim && (
          <text x={350} y={344} textAnchor="middle" style={{ ...SubT, fill: "var(--dg-green)" }} fontSize="7.4">▸ {P.cap}</text>
        )}
      </svg>
      <div className="dg-note">One physical SPI interface → <em>one SPI master</em>. Watch the arbiter: <em>sd_controller</em> grants ownership to exactly one FSM at a time - command bytes flow down MOSI, responses return on MISO, and BRAM traffic reverses direction between read and write. Chip-select is state-gated (<em>cs_force_high</em>) so inactive logic can never disturb a live transfer.</div>
    </div>
  );
}

/* -- SD init sequence, lights up on scroll -- */
const INIT_STEPS = [
  ["PWR", "~1 ms power wait"],
  ["80 CLK", "10× 0xFF, CS high"],
  ["CMD0", "0x95 CRC → R1=0x01"],
  ["CMD8", "0x1AA echo verified"],
  ["ACMD41", "HCS=1 · loop ≤1 s"],
  ["CMD58", "OCR read → CCS=1"],
  ["READY", "block addressing"],
];
function InitSeq() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { el.classList.add("lit"); io.unobserve(el); } });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className="gdsflow" ref={ref} aria-label="SPI-mode initialization sequence">
      {INIT_STEPS.map((s, i) => (
        <React.Fragment key={s[0]}>
          <div className={`gstage ${i === INIT_STEPS.length - 1 ? "last" : ""}`} style={{ transitionDelay: `${i * 110}ms` }}>
            <div className="gnode" style={{ transitionDelay: `${i * 110}ms` }}>
              {s[0]}
              <span className="gtip">{s[1]}</span>
            </div>
          </div>
          {i < INIT_STEPS.length - 1 && <span className="garrow" style={{ transitionDelay: `${i * 110}ms` }}>→</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

/* -- CMOS image-sensor dual-clock pipeline with animated CDC crossing -- */
function CdcPipeline() {
  return (
    <div className="diagram">
      <svg viewBox="0 0 700 290" role="img" aria-label="CMOS image-sensor pipeline: pixel-clock domain stages, one asynchronous FIFO clock-domain crossing, USB-clock domain serializer to FX3">
        <Defs />
        {/* domain frames */}
        <rect x={10} y={30} width={392} height={190} rx="10" fill="none" style={{ stroke: "var(--dg-frame1)" }} strokeDasharray="6 4" />
        <text x={22} y={50} style={{ ...BoxT, fill: "var(--dg-blue)" }} fontSize="9" fontWeight="700">PIXEL CLOCK DOMAIN · ~50 MHz</text>
        <rect x={492} y={30} width={198} height={190} rx="10" fill="none" style={{ stroke: "var(--dg-frame2)" }} strokeDasharray="6 4" />
        <text x={504} y={50} style={{ ...BoxT, fill: "var(--dg-green)" }} fontSize="9" fontWeight="700">USB DOMAIN · 100 MHz</text>
        {/* pixel-domain chain */}
        <DBox x={24} y={66} w={110} h={46} title="CMOS SENSOR" sub="12-bit Bayer GRBG" />
        <DArrow x1={134} y1={89} x2={152} y2={89} />
        <DBox x={154} y={66} w={116} h={46} title="DEMOSAIC" sub="5-stage · no FSM" />
        <DArrow x1={270} y1={89} x2={288} y2={89} />
        <DBox x={290} y={66} w={100} h={46} title="WB GAIN" sub="Q8 · clamp 3840" />
        <DArrow x1={340} y1={112} x2={340} y2={140} />
        <DBox x={240} y={142} w={150} h={46} title="RGB→YUV422" sub="BT.601 Q12 · YUYV" />
        {/* FIFO on the boundary - evenly spaced 16px text rhythm inside the same 86×92 block */}
        <g>
          <rect x={404} y={120} width={86} height={92} rx="8" style={{ fill: "var(--dg-box2)", stroke: "var(--dg-gold)" }} strokeWidth="1.1" />
          <text x={447} y={138} textAnchor="middle" style={{ ...BoxT, fill: "var(--dg-gold)" }} fontSize="9.5" fontWeight="700">ASYNC FIFO</text>
          <text x={447} y={154} textAnchor="middle" style={SubT} fontSize="7">18-bit × 1025</text>
          <text x={447} y={170} textAnchor="middle" style={SubT} fontSize="7">FWFT</text>
          <text x={447} y={186} textAnchor="middle" style={{ ...SubT, fill: "var(--dg-gold)" }} fontSize="6.6">{`{vsync,hsync,yuv[15:0]}`}</text>
          <text x={447} y={202} textAnchor="middle" style={{ ...SubT, fill: "var(--dg-gold)" }} fontSize="6.6">THE ONLY CDC POINT</text>
        </g>
        <DArrow x1={390} y1={165} x2={404} y2={165} />
        <text x={315} y={205} textAnchor="middle" style={SubT} fontSize="7">wr @ pix_clk · 1 word / 2 pixels · sync bits ride with data</text>
        {/* USB side */}
        <DArrow x1={490} y1={165} x2={510} y2={165} />
        <DBox x={512} y={142} w={112} h={46} title="SERIALIZER" sub="2-state FSM · rd-valid keyed" stroke="var(--dg-green-stroke)" tcolor="var(--dg-green)" />
        <DArrow x1={624} y1={165} x2={648} y2={165} />
        <DBox x={506} y={66} w={124} h={46} title="FX3 · UVC" sub="8-bit bus · USB 3.0" stroke="var(--dg-green-stroke)" tcolor="var(--dg-green)" />
        <DArrow x1={568} y1={142} x2={568} y2={112} label="2 bytes / word" />
        {/* animated data pulses: slow rail (pixel) & fast rail (usb) */}
        <line className="flowdot" x1={24} y1={240} x2={402} y2={240} strokeWidth="2.4" strokeDasharray="3 47" strokeLinecap="round" opacity=".9" style={{ stroke: "var(--dg-blue)" }} />
        <line className="flowdot" x1={492} y1={240} x2={690} y2={240} strokeWidth="2.4" strokeDasharray="3 22" strokeLinecap="round" opacity=".9" style={{ stroke: "var(--dg-green)", animationDuration: "1.7s" }} />
        <rect x={404} y={230} width={86} height={20} rx="5" style={{ fill: "var(--dg-box2)", stroke: "var(--dg-gold-stroke)" }} />
        <text x={447} y={243} textAnchor="middle" style={{ ...SubT, fill: "var(--dg-gold)" }} fontSize="7">CDC</text>
        <text x={24} y={266} style={SubT} fontSize="7.5">fPIX - 1 word per 2 pixels</text>
        <text x={690} y={266} textAnchor="end" style={SubT} fontSize="7.5">fUSB = 2·fPIX - 1 byte per clock, matched long-run rate</text>
      </svg>
      <div className="dg-note">Sync signals travel <em>inside the FIFO word</em> (18 bits, not 16) - frame/line valid cross the boundary in lockstep with their pixel data, eliminating a separate sync-synchronizer and any skew between the two.</div>
    </div>
  );
}

/* -- Debug log (signature) -- */
function DebugLog({ title, bugs, falsified }) {
  const [open, setOpen] = useState(0);
  return (
    <div>
      <div className="dbg">
        <div className="dbg-head"><i />{title}</div>
        {bugs.map((b, i) => (
          <div className={`dbg-item ${open === i ? "open" : ""}`} key={b.id}>
            <button className="dbg-btn" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
              <span className="bug-id">{b.id}</span>
              <span className="bug-t">{b.title}</span>
              <span className="chev">▸</span>
            </button>
            <div className="dbg-detail">
              <div className="dbg-cols">
                <div className="dbg-cell"><span className="k sy">Symptom</span><p>{b.symptom}</p></div>
                <div className="dbg-cell"><span className="k rc">Root cause</span><p>{b.cause}</p></div>
                <div className="dbg-cell"><span className="k fx">Fix</span><p>{b.fix}</p></div>
                <div className="dbg-cell"><span className="k vf">Verified by</span><p>{b.verify}</p></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {falsified && (
        <div className="falsified">
          <div className="fk">◆ Theories tested & falsified - recorded so they are never re-chased</div>
          {falsified.map((f, i) => (
            <p key={i}><span className="x">✗</span> <b>{f.name}:</b> {f.text}</p>
          ))}
        </div>
      )}
    </div>
  );
}

/* -- GDSII flow (kept) -- */
const GDS_STAGES = [
  ["RTL", "Verilog HDL"], ["SIM", "Cadence Xcelium"], ["SYNTH", "Cadence Genus · 90 nm"],
  ["LEC", "Cadence Conformal"], ["FLOOR", "Cadence Innovus"], ["CTS", "Clock Tree Synthesis"],
  ["ROUTE", "9-layer · Innovus"], ["STA", "Cadence Tempus"], ["GDSII", "Clean tape-out"],
];
function GdsFlow() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { el.classList.add("lit"); io.unobserve(el); } });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className="gdsflow" ref={ref}>
      {GDS_STAGES.map((s, i) => (
        <React.Fragment key={s[0]}>
          <div className={`gstage ${i === GDS_STAGES.length - 1 ? "last" : ""}`} style={{ transitionDelay: `${i * 90}ms` }}>
            <div className="gnode" style={{ transitionDelay: `${i * 90}ms` }}>
              {s[0]}
              <span className="gtip">{s[1]}</span>
            </div>
          </div>
          {i < GDS_STAGES.length - 1 && <span className="garrow" style={{ transitionDelay: `${i * 90}ms` }}>→</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

/* -- Derma AI: one preprocessed dataset feeding three competing approaches -- */
function MlPipelineDiagram() {
  return (
    <div className="diagram">
      <svg viewBox="0 0 700 300" role="img" aria-label="Derma AI pipeline: a 10-class dermatology dataset flows through preprocessing and augmentation into three model families - a from-scratch sequential CNN, HOG features with a random forest, and six pretrained transfer-learning networks - all scored by the same class-wise evaluation">
        <Defs />
        {/* data chain */}
        <DBox x={20} y={36} w={170} h={46} title="DATASET" sub="10 classes · 6,877 / 1,743" stroke="var(--dg-violet-stroke)" tcolor="var(--dg-violet)" />
        <DArrow x1={190} y1={59} x2={248} y2={59} />
        <DBox x={250} y={36} w={170} h={46} title="PREPROCESS" sub="224×224 · [0,1] · brightness" />
        <DArrow x1={420} y1={59} x2={478} y2={59} />
        <DBox x={480} y={36} w={200} h={46} title="AUGMENT + RESAMPLE" sub="rotate · zoom · flip · crop" stroke="var(--dg-gold-stroke)" tcolor="var(--dg-gold)" />
        {/* one balanced dataset fans out to all three approaches */}
        <line x1={580} y1={82} x2={580} y2={108} style={{ stroke: "var(--dg-stroke2)" }} strokeWidth="1.2" />
        <line x1={115} y1={108} x2={580} y2={108} style={{ stroke: "var(--dg-stroke2)" }} strokeWidth="1.2" />
        <line x1={115} y1={108} x2={115} y2={134} style={{ stroke: "var(--dg-stroke2)" }} strokeWidth="1.2" markerEnd="url(#arr)" />
        <line x1={350} y1={108} x2={350} y2={134} style={{ stroke: "var(--dg-stroke2)" }} strokeWidth="1.2" markerEnd="url(#arr)" />
        <line x1={580} y1={108} x2={580} y2={134} style={{ stroke: "var(--dg-stroke2)" }} strokeWidth="1.2" markerEnd="url(#arr)" />
        {/* three model families */}
        <DBox x={25} y={136} w={180} h={46} title="SEQUENTIAL CNN" sub="conv 32·64·128 · FC 128 · softmax" />
        <DBox x={260} y={136} w={180} h={46} title="HOG + RANDOM FOREST" sub="9-orient HOG + color hist · 100 trees" />
        <DBox x={490} y={136} w={180} h={46} title="TRANSFER LEARNING ×6" sub="ResNet-50 · VGG16 · EfficientNetB0 …" stroke="var(--dg-green-stroke)" tcolor="var(--dg-green)" />
        {/* convergence on a single judging stage */}
        <DArrow x1={115} y1={182} x2={245} y2={228} />
        <DArrow x1={350} y1={182} x2={350} y2={228} />
        <DArrow x1={580} y1={182} x2={455} y2={228} />
        <DBox x={190} y={230} w={320} h={46} title="CLASS-WISE EVALUATION" sub="accuracy · precision · recall · F1 · confusion matrix" stroke="var(--dg-gold-stroke)" tcolor="var(--dg-gold)" />
        <text x={350} y={294} textAnchor="middle" style={SubT} fontSize="7.4">best of the field: ResNet-50 · 68.38% validation accuracy</text>
      </svg>
      <div className="dg-note">One augmentation-balanced dataset feeds <em>three competing approaches</em> - a from-scratch CNN, a classical HOG + Random-Forest pipeline, and six pretrained networks - all judged by the same class-wise metrics, so the comparison is between models, not data.</div>
    </div>
  );
}

/* -- Derma AI benchmark: every figure as reported, drawn to scale.
   Deep models rank on the validation set; SVM/KNN report on their own
   held-out split, so they sit in a separate group, not one leaderboard. -- */
const ML_DEEP = [
  { name: "ResNet-50", v: 68.38, train: 89.59, best: true },
  { name: "EfficientNetB0", v: 53.98 },
  { name: "VGG16", v: 38.64 },
  { name: "CNN (from scratch)", v: 30.89 },
  { name: "MobileNetV2", v: 16.01 },
  { name: "NASNetMobile", v: 15.72 },
  { name: "MobileNetV3Small", v: 7.06 },
];
const ML_CLASSICAL = [
  { name: "SVM", v: 33.87, auc: "0.7483" },
  { name: "KNN", v: 19.7, auc: "0.6016" },
];
function MlBenchmarkChart() {
  const X0 = 140, S = 5;
  const Row = ({ y, m, tone }) => (
    <g>
      <text x={X0 - 10} y={y + 8.5} textAnchor="end" style={{ ...SubT, fill: m.best ? "var(--dg-green)" : "var(--dg-t2)" }} fontSize="8" fontWeight={m.best ? 700 : 400}>{m.name}</text>
      <rect x={X0} y={y} width={m.v * S} height={10} rx="2" style={{ fill: m.best ? "var(--dg-green)" : tone }} fillOpacity={m.best ? 1 : 0.45} />
      {m.best ? (
        <text x={X0 + m.v * S - 7} y={y + 8.5} textAnchor="end" style={{ ...BoxT, fill: "var(--dg-bg)" }} fontSize="8" fontWeight="700">{m.v.toFixed(2)}%</text>
      ) : (
        <text x={X0 + m.v * S + 8} y={y + 8.5} style={BoxT} fontSize="8">{m.v.toFixed(2)}%{m.auc && <tspan style={{ fill: "var(--dg-t2)" }} fontSize="7">  ·  ROC AUC {m.auc}</tspan>}</text>
      )}
      {m.train && (
        <>
          <rect x={X0 + m.v * S} y={y} width={(m.train - m.v) * S} height={10} rx="2" style={{ fill: "none", stroke: "var(--dg-gold-stroke)" }} strokeWidth="1" strokeDasharray="3 3" />
          <text x={X0 + m.train * S + 8} y={y + 8.5} style={{ ...SubT, fill: "var(--dg-gold)" }} fontSize="7">train {m.train.toFixed(2)}%</text>
        </>
      )}
    </g>
  );
  return (
    <div className="diagram">
      <svg viewBox="0 0 700 272" role="img" aria-label="Benchmark chart drawn to scale from the reported figures. Validation accuracy: ResNet-50 68.38 percent, best, with a dashed extension to its 89.59 percent training accuracy marking the overfitting gap; EfficientNetB0 53.98; VGG16 38.64; from-scratch CNN 30.89; MobileNetV2 16.01; NASNetMobile 15.72; MobileNetV3Small 7.06. Classical baselines on their own held-out split: SVM 33.87 percent, ROC AUC 0.7483; KNN 19.70 percent, ROC AUC 0.6016">
        {[0, 25, 50, 75, 100].map((p) => (
          <g key={p}>
            <line x1={X0 + p * S} y1={24} x2={X0 + p * S} y2={250} style={{ stroke: "var(--dg-border)" }} strokeWidth="1" strokeDasharray="2 5" />
            <text x={X0 + p * S} y={264} textAnchor="middle" style={SubT} fontSize="7">{p}{p === 100 ? "%" : ""}</text>
          </g>
        ))}
        <text x={X0} y={16} style={{ ...BoxT, fill: "var(--dg-blue)" }} fontSize="8" fontWeight="700">DEEP MODELS · VALIDATION ACCURACY · 1,743 IMAGES</text>
        {ML_DEEP.map((m, i) => <Row key={m.name} y={28 + i * 22} m={m} tone="var(--dg-blue)" />)}
        <text x={X0} y={198} style={{ ...BoxT, fill: "var(--dg-violet)" }} fontSize="8" fontWeight="700">CLASSICAL BASELINES · SEPARATE HELD-OUT SPLIT</text>
        {ML_CLASSICAL.map((m, i) => <Row key={m.name} y={210 + i * 22} m={m} tone="var(--dg-violet)" />)}
      </svg>
      <div className="dg-note">Drawn to scale from the reported figures. The dashed extension on <em>ResNet-50</em> is its 89.59% training accuracy - the overfitting gap made visible instead of footnoted. SVM and KNN sit in their own group because they report accuracy on a separate held-out split, with <em>ROC AUC</em> alongside.</div>
    </div>
  );
}

/* -- Derma AI from-scratch CNN, lights up on scroll (same rig as InitSeq) -- */
const CNN_STAGES = [
  ["INPUT", "224×224 · [0,1] normalized"],
  ["CONV 32", "3×3 · ReLU → 2×2 maxpool"],
  ["CONV 64", "3×3 · ReLU → 2×2 maxpool"],
  ["CONV 128", "3×3 · ReLU → 2×2 maxpool"],
  ["FC 128", "flatten → dense"],
  ["SOFTMAX", "10-class output"],
];
function CnnFlow() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { el.classList.add("lit"); io.unobserve(el); } });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className="gdsflow" ref={ref} aria-label="Sequential CNN architecture">
      {CNN_STAGES.map((s, i) => (
        <React.Fragment key={s[0]}>
          <div className={`gstage ${i === CNN_STAGES.length - 1 ? "last" : ""}`} style={{ transitionDelay: `${i * 110}ms` }}>
            <div className="gnode" style={{ transitionDelay: `${i * 110}ms` }}>
              {s[0]}
              <span className="gtip">{s[1]}</span>
            </div>
          </div>
          {i < CNN_STAGES.length - 1 && <span className="garrow" style={{ transitionDelay: `${i * 110}ms` }}>→</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ============================================================
   CONTENT DATA (extracted from resume + engineering docs)
   ============================================================ */
const SD_BUGS = [
  { id: "SD-01", title: "Init hung: startup clocks never completed",
    symptom: "Card refused to enter SPI mode; CMD0 never got R1=0x01.",
    cause: "Dummy-clock send index wrapped early - fewer than the 80 required startup clocks were issued before CMD0.",
    fix: <>Widened the counter so all 10× <code>0xFF</code> bytes transmit with CS forced high - the full 80-clock preamble the spec requires.</>,
    verify: "Hardware: init_done=1, ccs_out=1 on the SanDisk SDXC after fix; bounded CMD0 retry (max 2) retained." },
  { id: "SD-02", title: "CMD24 write rejected: missing mandatory gap byte",
    symptom: "Write path failed after a valid R1 - card never accepted the data token.",
    cause: "FSM jumped from R1 straight to the 0xFE token; the SD spec's mandatory stuff byte between response and data was absent.",
    fix: <>Added a dedicated <code>S_STUFF_BYTE</code> state - one <code>0xFF</code> gap byte before the token.</>,
    verify: "Data-response token decoded as 'accepted'; write completes through busy-poll and clean CS release." },
  { id: "SD-03", title: "First payload byte corrupt on every write",
    symptom: "Byte 0 of the 512-byte payload transmitted wrong; rest of block fine.",
    cause: "sd_rx_buffer is a registered BRAM with 1-cycle read latency - the FSM sampled buf_rdata the same cycle it applied the address.",
    fix: <>Pipelined the addressing: <code>buf_raddr=0</code> is presented during the stuff-byte state, and read addresses advance one byte early for the whole burst.</>,
    verify: "Pre-write UART dump vs. post-readback dump: byte-for-byte match across all 512 bytes." },
  { id: "SD-04", title: "Reject response crashed the busy phase",
    symptom: "On a CRC/write reject, the FSM bailed immediately and the next transaction started against a busy card.",
    cause: "Failure was reported before the card's mandatory busy phase completed - CS released mid-busy.",
    fix: <>Deferred-failure handling: complete busy cleanup first (<code>spi_rx != 0x00</code>, 500 ms bound), then raise the sticky <code>wr_error</code> with its 3-bit code.</>,
    verify: "Error codes distinguish reject types (3'd4/5/6) on LEDs; card remains recoverable without power cycle." },
  { id: "SD-05", title: "Write launched against stale buffer data",
    symptom: "Readback occasionally matched the previous test pattern, not the new one.",
    cause: "buf_valid persisted from the preload phase - a write could start before fresh data had fully landed.",
    fix: <>Made <code>buf_valid=1</code> a hard write-gating condition and cleared it explicitly before both preload and readback phases.</>,
    verify: "wr_req_gated only fires with a complete 512-byte payload; sequence LEDs confirm ordering." },
  { id: "SD-06", title: "Random FSM lockups traced to reset metastability",
    symptom: "Rare, unreproducible hangs after pressing the reset button.",
    cause: "btn0 is asynchronous to the 100 MHz clock - reset release could violate setup on state registers.",
    fix: <>2-flip-flop reset synchronizer in <code>sd_top</code> plus an XDC false-path on <code>btn0</code>; power-on reset held 1000 cycles for clean startup.</>,
    verify: "All FSMs start from a clock-aligned boundary; hangs never reproduced after the change." },
];

const CAM_BUGS = [
  { id: "CAM-01", title: "Diagonal color banding drifting across the frame",
    symptom: "Banding visible even on a flat green test frame - dotted diagonal lines with no scene content, so it wasn't image-dependent.",
    cause: "Active-width mismatch: demosaic wrap boundary was set wider than the sensor's true 1284 active pixels (raw line = 1288). A few-pixel drift per line accumulated down the frame → diagonal signature.",
    fix: <>Corrected <code>ACTIVE_WIDTH</code> to the hardware-measured pixel count per line.</>,
    verify: "ILA column-counter readback: zero drift at every line start; banding absent on a uniform target." },
  { id: "CAM-02", title: "Fixing CAM-01 produced a black screen",
    symptom: "Video died completely the moment the timing bug was corrected.",
    cause: "A last-row 'flush replay' mechanism - never triggered while the old timing error masked it - began firing, injecting sync pulses during blanking and corrupting frame-boundary detection.",
    fix: <>Disabled the flush-replay activation; redesign deferred and documented rather than patched blind.</>,
    verify: "Frame and line byte counts returned to expected values via direct counter readback; video restored." },
  { id: "CAM-03", title: "Luma/chroma swap: every color rendered wrong",
    symptom: "Magenta/green cast; drawn shapes appeared in swapped colors.",
    cause: "One-cycle skew between the line-sync pin and the data byte on the bus - the FX3 misread the first byte of every line, shifting YUYV byte alignment.",
    fix: <>One extra register stage on the line-sync output path only - deliberately asymmetric; the FIFO data path was left untouched.</>,
    verify: "Raw channel readings matched real-world object colors for the first time; image structure correct." },
  { id: "CAM-04", title: "Intermittent USB de-enumeration at correct WB gains",
    symptom: "Full USB disconnect - not a stream restart - whenever color-correct gains ran under bright light.",
    cause: "Not definitively isolated. Working theory: a channel saturating at 12-bit max produces a sustained bus pattern the FX3 capture logic mishandles.",
    fix: <>Containment, stated as such: all three channels clamped uniformly at <code>3840</code> - below the empirical stability limit, uniform so highlights don't tint.</>,
    verify: "Stable across repeated bright/dark transitions at the clamp value. Flagged 'monitor' - behavioral evidence, not signal-level proof." },
  { id: "CAM-05", title: "Bright garbage pixels at the top frame edge",
    symptom: "Sparkling bright pixels along the top edge of dark frames.",
    cause: "Frame-edge validity check disabled in the demosaic output - border pixels lacking full 3×3 neighbor data were marked valid and shipped.",
    fix: <>BORDER=3 mask: perimeter pixels forced black in the output stage. Containment - the disabled check is documented as the open structural fix.</>,
    verify: "Artifact no longer visible; root cause tracked in the bug registry rather than silently forgotten." },
];

const CAM_FALSIFIED = [
  { name: "Power-supply / clock-lock droop", text: <>proposed that switching activity at correct gains caused a rail or PLL dip. <b>Disproven by measurement</b> - ILA showed no loss of clock lock during a confirmed disconnect, and bench current was <b>lower</b> during the failing condition, not higher.</> },
  { name: "Bad-pixel-value crash", text: <>proposed an invalid pixel value faulted the serializer or FX3. <b>Disproven by review + firmware behavior</b> - serializer state depends only on FIFO status, never pixel value; and the UVC firmware restarts the stream on data errors rather than fully de-enumerating, which doesn't match the symptom.</> },
];

const SKILL_GROUPS = [
  { h: "HDLs & Languages", items: [["Verilog", "EXPERT"], ["SystemVerilog", "PROFICIENT"], ["C++", "PROFICIENT"], ["Python", "PROFICIENT"], ["Tcl Scripting", "PROFICIENT"], ["MATLAB", "FAMILIAR"]] },
  { h: "Digital Design", items: [["FSM Design", "EXPERT"], ["Pipelining", "EXPERT"], ["SPI", "EXPERT"], ["UART", "EXPERT"], ["CDC (Clock Domain Crossing)", "PROFICIENT"], ["FIFO Design", "PROFICIENT"], ["Fixed-Point Arithmetic", "PROFICIENT"], ["I2C", "PROFICIENT"], ["AMBA (AXI, APB)", "PROFICIENT"], ["Low Power Design", "FAMILIAR"]] },
  { h: "Verification", items: [["Directed Testbenches", "PROFICIENT"], ["Functional Simulation", "PROFICIENT"], ["Formal Equivalence Checking", "PROFICIENT"]] },
  { h: "ASIC Flow & Tools", items: [["RTL-to-GDSII", "PROFICIENT"], ["Synthesis - Genus", "PROFICIENT"], ["STA - Tempus", "PROFICIENT"], ["Place & Route - Innovus", "PROFICIENT"], ["Clock Tree Synthesis", "PROFICIENT"], ["Xcelium", "PROFICIENT"], ["Conformal", "PROFICIENT"]] },
  { h: "FPGA & Debug", items: [["Xilinx Vivado", "EXPERT"], ["Xilinx Spartan-7", "EXPERT"], ["Integrated Logic Analyzer (ILA)", "PROFICIENT"], ["Keysight DSO", "FAMILIAR"]] },
];

const DIE_BLOCKS = [
  "I/O", "PLL", "SPI", "I/O", "UART", "I2C",
  "FIFO", "", "", "", "", "CDC",
  "SRAM", "", "RTL CORE", "", "", "DSP",
  "BRAM", "", "", "", "", "ALU",
  "FSM", "", "", "", "", "MUX",
  "I/O", "CTS", "STA", "I/O", "P&R", "I/O",
];
const DIE_TIPS = { "RTL CORE": "RTL Design", DSP: "Fixed-Point DSP", CDC: "Clock Domain Crossing", STA: "Static Timing Analysis", "P&R": "Place & Route", CTS: "Clock Tree Synthesis", SPI: "SD Controller", FSM: "FSM Design" };

/* journey photographs - served from /photos in the site's public dir */
const PHOTOS = {
  portrait: "/photos/portrait.jpg",
  award: "/photos/best-volunteer-award-2023.jpg",
  keynote: "/photos/keynote-2025.jpg",
  convocation: "/photos/convocation-2025.jpg",
};

const LINKS = {
  podcast: "https://www.youtube.com/watch?v=8rrmP5fdmwQ&t=3077s",
  schoolFilm: "https://www.youtube.com/watch?v=PnfobVMqO7s",
  instagram: "https://www.instagram.com/yrjverse",
};

const JOURNEY = [
  { yr: "2016", tag: "Participant", cls: "", title: "The camp that set the trajectory",
    text: <>A school student from RPVV Lajpat Nagar spends a summer inside IIIT-Delhi's labs at the institute's Summer Camp - the first time engineering looks like something you <b>do</b>, not just study for.</> },
  { yr: "2021", tag: "Undergraduate", cls: "", title: "Back through the front gate",
    text: <>Admitted to IIIT-Delhi - B.Tech in Electronics &amp; Communication Engineering. The campus from the summer camp becomes home for the next four years.</> },
  { yr: "2023", tag: "Volunteer · Teaching Mentor", cls: "gold", title: "The other side of the desk",
    text: <>Returned to the same summer camp to teach - running sessions and mentoring school students who were exactly where I'd been in 2016.</>,
    award: "◆ Special Mention - Best Volunteer Award",
    photos: [{ src: PHOTOS.award, alt: "With summer-camp students in the IIIT-Delhi auditorium", cap: "Best Volunteer", sub: "Special Mention · 2023", ratio: "4 / 3" }] },
  { yr: "2024", tag: "Mentor", cls: "", title: "Owning the room",
    text: <>Back for another summer, now mentoring end to end - shaping sessions, guiding projects, and coaching the volunteers doing what I did the year before.</> },
  { yr: "2025", tag: "Keynote Speaker", cls: "last", title: "Same hall, other side of the podium",
    text: <>Delivered the keynote at the camp where the story began - nine years after sitting in the audience. The same year, the degree closed its own loop: <b>B.Tech ECE, IIIT-Delhi, Graduating Batch of 2025</b>.</>,
    photos: [
      { src: PHOTOS.keynote, alt: "Keynote address at the IIIT-Delhi Summer Camp 2025", cap: "Keynote", sub: "IIIT-Delhi Summer Camp · 2025" },
      { src: PHOTOS.convocation, alt: "Convocation at IIIT-Delhi, graduating batch of 2025", cap: "Convocation", sub: "B.Tech ECE · Batch of 2025" },
    ] },
];

/* ============================================================
   RECRUITER NOTES - structured Q&A config
   Edit this list to add/change questions - no UI code required.
   Every answer must be traceable to the site's verified content
   or something explicitly provided by Yash; if neither exists yet,
   leave the value as null rather than guessing.
   ============================================================ */
const RECRUITER_NOTES = [
  { section: "Availability", items: [
    { q: "When can you start?", a: "Currently at OrVis Semi (Oct 2025 - present). A 30-day notice period applies once an offer is accepted." },
  ] },
  { section: "Work Authorization", items: [
    { q: "Where are you eligible to work?", a: "India. No existing work authorization elsewhere - a role outside India would require sponsorship." },
  ] },
  { section: "Location & Work Mode", items: [
    { q: "Where are you based, and onsite or remote?", a: "New Delhi, India. Open to relocation. Prefer onsite." },
  ] },
  { section: "Role Fit", items: [
    { q: "What roles are you targeting?", a: "RTL / Digital Design, FPGA Engineering, and Physical Design - teams that tape out." },
  ] },
  { section: "Experience", items: [
    { q: "What's the fastest way to evaluate you?", a: "Three systems validated on real hardware: a real-time FPGA imaging pipeline, a bare-metal SDXC controller, and a full Cadence RTL-to-GDSII flow on a 2×2 NoC. Full architecture, decisions, bugs, and proof are in the case studies above." },
  ] },
  { section: "Engineering Approach", items: [
    { q: "How do you validate your work?", a: "No claim in the design record rests on simulation alone - ILA capture, counter readback, bench current, and live video are the authorities. Two failure theories were disproven by measurement, not assumed away." },
  ] },
  { section: "AI-Assisted Workflow", items: [
    { q: "How do you use AI in your engineering process?", a: "To accelerate engineering thinking, not to replace engineering judgment: brainstorming architectures, debating trade-offs, exploring debugging hypotheses, and getting up to speed on unfamiliar protocols faster - not asking AI to write RTL. Every design decision is still validated through engineering fundamentals, simulation, and hardware testing." },
  ] },
];

/* Focus is trapped and returned on close, background scroll is locked
   while open, matching ResumeModal's pattern - see that component for
   the rationale. Stays mounted (visibility toggle, not unmount) so the
   slide transition can play in both directions. */
function RecruiterDrawer({ open, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const prevFocus = useRef(null);
  useEffect(() => {
    if (!open) return;
    prevFocus.current = document.activeElement;
    const prevBody = document.body.style.overflow, prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "Tab" && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll("a[href],button");
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
      prevFocus.current?.focus?.();
    };
  }, [open, onClose]);
  return (
    <>
      <div className={`rdrawer-backdrop ${open ? "open" : ""}`} onClick={onClose} aria-hidden="true" />
      <div className={`rdrawer ${open ? "open" : ""}`} role="dialog" aria-modal="true" aria-label="Recruiter Notes" ref={dialogRef}>
        <div className="rdrawer-head">
          <div>
            <h2>Recruiter Notes</h2>
            <p>Everything you need before scheduling an interview.</p>
          </div>
          <button ref={closeRef} className="rdrawer-x" aria-label="Close recruiter notes" onClick={onClose}>×</button>
        </div>
        <div className="rdrawer-body">
          {RECRUITER_NOTES.map((sec) => (
            <div className="rq-section" key={sec.section}>
              <div className="cs-label">{sec.section}</div>
              <div className="rq-list">
                {sec.items.map((it) => (
                  <div className="dec" key={it.q}>
                    <div className="dt">{it.q}</div>
                    <div className="dd">{it.a}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="rdrawer-foot">
          <a className="btn fill" href="mailto:yashrajojha07@gmail.com">Email</a>
          <a className="btn" href="https://www.linkedin.com/in/yrjojha/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          <a className="btn" href={RESUME_PDF} target="_blank" rel="noopener noreferrer">↓ Résumé</a>
        </div>
      </div>
    </>
  );
}

/* ============================================================
   APP
   ============================================================ */
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState("");
  /* saved preference wins; otherwise follow the system (and keep following it
     until the user explicitly toggles — only the toggle writes localStorage) */
  const [light, setLight] = useState(() => {
    try {
      const saved = localStorage.getItem("yro-theme");
      if (saved) return saved === "light";
      return window.matchMedia("(prefers-color-scheme: light)").matches;
    } catch { return false; }
  });
  const toggleTheme = () => {
    try { localStorage.setItem("yro-theme", light ? "dark" : "light"); } catch { /* private mode */ }
    setLight((l) => !l);
  };
  const [resumeOpen, setResumeOpen] = useState(false);
  const openResume = (e) => { e.preventDefault(); setResumeOpen(true); };
  const [recruiterOpen, setRecruiterOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.background = light ? "#FFFFFF" : "#131314";
    document.documentElement.style.colorScheme = light ? "light" : "dark";
  }, [light]);

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = STYLES; document.head.appendChild(s);
    return () => { document.head.removeChild(s); };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.55);
    onScroll(); addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  const navIds = ["about", "industry", "research", "skills", "education", "journey", "contact"];
  const navLabels = { "about": "About", "industry": "Industry", "research": "Research", "skills": "Skills", "education": "Education", "journey": "Journey", "contact": "Contact" };

  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-40% 0px -55% 0px" });
    navIds.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  const go = (id) => { setMenu(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <div className={`yro${light ? " light" : ""}`}>
      <a className="skip" href="#main">Skip to content</a>
      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
      <RecruiterDrawer open={recruiterOpen} onClose={() => setRecruiterOpen(false)} />
      <button
        className="rq-trigger"
        onClick={() => setRecruiterOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={recruiterOpen}
      >
        <i aria-hidden="true" />Recruiter Notes
      </button>
      <LatticeCanvas light={light} />

      {/* NAV */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-in">
          <a href="#top" className="mono-logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Yrj<span className="dot">Ojha</span></a>
          <div className="nav-right">
            <ul className="nav-links">
              {navIds.map((n) => (
                <li key={n}><a href={`#${n}`} className={active === n ? "active" : ""} onClick={(e) => { e.preventDefault(); go(n); }}>{navLabels[n]}</a></li>
              ))}
              <li><a className="nav-cta" href={RESUME_PDF} onClick={openResume}><span aria-hidden="true">↓</span>Résumé</a></li>
            </ul>
            <button className="theme-btn" aria-label={light ? "Switch to dark theme" : "Switch to light theme"} onClick={toggleTheme}>
              {light ? <IcoMoon /> : <IcoSun />}
            </button>
            <button className={`burger ${menu ? "open" : ""}`} aria-label="Menu" onClick={() => setMenu((m) => !m)}><span /><span /><span /></button>
          </div>
        </div>
      </nav>
      <div className={`overlay ${menu ? "open" : ""}`}>
        {navIds.map((n) => <a key={n} href={`#${n}`} onClick={(e) => { e.preventDefault(); go(n); }}>{navLabels[n]}</a>)}
      </div>

      <div className="wrap" id="top">
        <main id="main" tabIndex={-1} style={{ outline: "none" }}>
        {/* ================= HERO ================= */}
        <header className="hero">
          <PcbCanvas light={light} />
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="hero-id">
                <img className="hero-avatar" src={PHOTOS.portrait} alt="Portrait of Yash Raj Ojha" style={{ objectPosition: "58% 42%" }} />
                <div>
                  <h1 className="hero-name">Yash Raj Ojha</h1>
                  <span className="kicker">FPGA/RTL Engineer · OrVis Semi · New Delhi</span>
                </div>
              </div>
              <p className="hero-state">I build<br />silicon.</p>
              <p className="subhead">RTL design → FPGA validation → GDSII signoff.</p>
              <p className="bio">
                Digital hardware, validated on <b>real hardware</b>: a bare-metal SDXC controller,
                a real-time imaging pipeline, and a full Cadence RTL-to-GDSII flow.
                <b> Cadence CSP Scholar</b> · IIIT Delhi ECE ’25.
              </p>
            </div>
            <div className="hero-actions">
              <div className="cta-row">
                <button className="btn fill" onClick={() => go("industry")}>Read the Case Studies</button>
                <a className="btn" href={RESUME_PDF} onClick={openResume}>↓ Résumé</a>
                <a className="btn" href="https://www.linkedin.com/in/yrjojha/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
              </div>
              <div className="hero-proof">
                <div className="hp"><b>2.55 ns</b>timing closure · 90 nm</div>
                <div className="hp"><b>100 MHz</b>pipeline on Spartan-7</div>
                <div className="hp"><b>1 CDC</b>point, by design</div>
                <div className="hp"><b>11 bugs</b>root-caused on hardware</div>
              </div>
            </div>
            <div className="die-scene">
              <div className="die-glow" aria-hidden="true" />
              <div className="die">
                <div className="die-pins top">{Array.from({ length: 10 }).map((_, i) => <i key={i} />)}</div>
                <div className="die-face">
                  {DIE_BLOCKS.map((b, i) =>
                    b === "RTL CORE" ? (
                      <div className="block die-core" key={i}>{b}<span className="tip">{DIE_TIPS[b]}</span></div>
                    ) : (
                      <div className="block" key={i}>{b}{b && DIE_TIPS[b] && <span className="tip">{DIE_TIPS[b]}</span>}</div>
                    )
                  )}
                </div>
                <div className="die-pins bot">{Array.from({ length: 10 }).map((_, i) => <i key={i} />)}</div>
              </div>
            </div>
          </div>
          <div className="hero-fade" />
        </header>

        {/* ================= ABOUT ================= */}
        <section className="section" id="about">
          <div className="section-head">
            <Reveal><span className="eyebrow">01 - About</span>
              <h2 className="sec-title">Hardware-first. Simulation is evidence, silicon is proof.</h2></Reveal>
          </div>
          <div className="about-grid">
            <Reveal className="terminal">
              <div className="term-bar"><i className="r" /><i className="y" /><i className="g" /><span>yash@orvis: ~</span></div>
              <div className="term-body">
                <span className="cmd">whoami</span>{"\n"}
                <span className="out">Yash Raj Ojha - RTL/FPGA Engineer</span>{"\n\n"}
                <span className="cmd">cat experience.txt</span>{"\n"}
                <span className="out">OrVis Semi (CMOS imaging)</span> <span className="dim">| Oct 2025 – Present</span>{"\n\n"}
                <span className="cmd">cat education.txt</span>{"\n"}
                <span className="out">B.Tech ECE | IIIT Delhi | 2021–2025</span>{"\n"}
                <span className="hl">Cadence CSP Scholar (Top 1% nationally)</span>{"\n\n"}
                <span className="cmd">grep -c "root-caused" debug.log</span>{"\n"}
                <span className="out">11</span>{"\n\n"}
                <span className="cmd"></span><span className="term-cursor" />
              </div>
            </Reveal>
            <Reveal className="about-prose" delay={120}>
              <p>I design the logic that runs inside chips - and I don't call it done until it works on the bench. My Verilog closes timing at <span className="num">2.55 ns</span> through a full Cadence flow, and my FPGA pipelines stream real sensor data at <span className="num">100 MHz</span> into a host PC with zero software in the video path.</p>
              <p>The case studies below are written the way I work: <strong>problem, architecture, engineering decisions, the bugs I found, how I proved the fixes</strong>. Every claim traces to an ILA capture, a UART dump, a counter readback, or a bench current measurement - including two failure theories I disproved by measurement rather than assumed away.</p>
              <p>Targeting RTL / Digital Design / FPGA roles on teams that tape out.</p>
            </Reveal>
          </div>
          <Reveal className="statbar" delay={200}>
            {[["3", "Systems hardware-validated"], ["2.55 ns", "WNS +814 ps · Genus 90 nm"], ["100 MHz", "Real-time pipeline clock"], ["0", "Soft-cores in any datapath"]].map((s) => (
              <div className="stat" key={s[1]}><div className="v">{s[0]}</div><div className="l">{s[1]}</div></div>
            ))}
          </Reveal>
        </section>

        {/* ================= INDUSTRY EXPERIENCE - OrVis Semi ================= */}
        <section className="section" id="industry">
          <div className="section-head">
            <Reveal><span className="eyebrow">02 - Industry Experience</span>
              <h2 className="sec-title">OrVis Semi - production FPGA work, proven on the bench.</h2>
              <p className="sec-sub">Two systems built as the sole RTL designer. Each card is the 15-second version; open it for the complete engineering record - architecture, decisions, the bug log, and the hardware proof.</p></Reveal>
          </div>

          <CaseStudy
            id="camera-pipeline"
            org="OrVis Semi · Industry"
            orgTone="ind"
            domain="Image Processing · CDC · Real-Time Streaming"
            title="FPGA-Based Real-Time Imaging Pipeline"
            role="Owned the full FPGA video path - demosaic, calibration, color conversion, the clock-domain crossing, and serialization to a hardware-fixed 8-bit bus - plus the debug campaign that made it stable."
            impact="1284×968 live UVC video · exactly 1 CDC point · 5 bugs root-caused, 2 theories falsified on the bench"
            summary="Raw 12-bit Bayer in, standard UVC video out - plug-and-play in any host viewer. Demosaic, white balance, and color conversion all run at pixel rate in Verilog, across two asynchronous clock domains, against a USB firmware this design could not modify."
            tags={["Verilog", "Bilinear Demosaic", "Async FIFO / CDC", "BT.601 · YUV422", "Fixed-Point DSP", "UVC / FX3"]}
          >
          <div className="cs-wrap">
            <div className="cs-head">
              <span className="cs-id">OrVis Semi · Industrial CMOS Image Sensor · Spartan-7 · Cypress FX3</span>
              <div className="cs-meta">
                <div className="m">Active frame<b>1284 × 968</b></div>
                <div className="m">Pixel clock<b>~50 MHz</b></div>
                <div className="m">USB clock<b>100 MHz</b></div>
                <div className="m">CDC points<b>Exactly 1</b></div>
                <div className="m">Host software<b>None (UVC)</b></div>
              </div>
            </div>
            <div className="cs-body">
              <div className="cs-sec">
                <div className="cs-label">Problem - four constraints that shaped everything</div>
                <p><b>The sensor cannot be paused.</b> Pixels arrive every clock, forever - any stage that could "wait" is architecturally invalid. <b>The USB firmware is owned by another team</b> - the FPGA must conform exactly to its declared resolution, format, and timing, never the reverse. <b>The FX3 bus is 8 bits with no GPIF-II control signals routed</b> - a permanent PCB limitation, so sync had to be folded into the data path. And <b>the two clock domains are truly asynchronous</b> - no fixed phase relationship exists.</p>
              </div>

              <div className="cs-sec">
                <div className="cs-label">Architecture - two clock domains, one crossing</div>
                <CdcPipeline />
              </div>

              <div className="cs-sec">
                <div className="cs-label">Engineering decisions</div>
                <div className="dec-grid">
                  <div className="dec"><div className="dt">Pipeline, not FSM - forced by physics</div><div className="dd">The demosaic is a fixed 5-stage pipeline with <b>no state machine</b>: bilinear interpolation over a 3×3 window from three BRAM line buffers, one pixel per clock, edge replication at frame borders. An earlier design with a stall input was rejected once continuous streaming became the constraint.</div></div>
                  <div className="dec"><div className="dt">Exactly one CDC - concentrated risk</div><div className="dd">All clock-domain risk lives in a single async FIFO (18-bit × 1025, FWFT). The FIFO word is <span className="mono">{"{vsync, hsync, yuv[15:0]}"}</span> - sync crosses in lockstep with its pixel data, so no separate synchronizer and no data/sync skew is even possible.</div></div>
                  <div className="dec"><div className="dt">Rate matching by construction</div><div className="dd">fUSB = 2·fPIX. One 16-bit YUV word covers two pixels; the serializer emits two bytes per word. Long-run rates match exactly - the FIFO absorbs only instantaneous phase jitter, which is all an async FIFO should ever be asked to do.</div></div>
                  <div className="dec"><div className="dt">Precision kept, division eliminated</div><div className="dd">BT.601 in Q12 fixed-point (÷4096, not ÷256) preserves the full 12-bit input through conversion - a lower-precision version was built and reverted over banding risk. Rounding bias <span className="mono">+2048</span>, chroma offset <span className="mono">+524288</span>, all shifts, zero dividers. Saturation is compare-and-clamp, never a truncating bit-slice.</div></div>
                  <div className="dec"><div className="dt">Serializer keyed to data, not to cycles</div><div className="dd">The 2-state serializer FSM advances on the FIFO's read-data-valid timing rather than a fixed cycle count - correct under any FIFO latency variation instead of assuming one.</div></div>
                  <div className="dec"><div className="dt">Calibration treated as engineering</div><div className="dd">Gray-world white balance against a measured reference: Q8 gains <span className="mono">R=336 · G=256 · B=441</span>. An IR-cut filter was added after outdoor captures showed physically impossible readings (black objects brighter than white) - then gains were re-derived. A residual black-level offset was <b>proven by a two-target experiment</b> and documented with its correct future fix, not hidden.</div></div>
                </div>
              </div>

              <div className="cs-sec">
                <div className="cs-label">Silicon debug log - the bring-up story</div>
                <DebugLog title="imaging_pipeline · bring-up incident log" bugs={CAM_BUGS} falsified={CAM_FALSIFIED} />
              </div>

              <div className="cs-sec">
                <div className="cs-label">Validation principle</div>
                <ul className="val-list">
                  <li><b>Hardware-first:</b> no claim in the design record rests on simulation alone - ILA capture, counter readback, bench current, and live video are the authorities.</li>
                  <li><b>Column-counter proof:</b> zero drift at every line start after the active-width fix - measured, not eyeballed.</li>
                  <li><b>Current measurement</b> ruled out the power-droop theory: draw was <b>lower</b> in the failing condition.</li>
                  <li><b>Honest severity:</b> contained issues are labeled containment, with root cause and proper fix tracked in the registry.</li>
                </ul>
              </div>

              <div className="cs-sec">
                <div className="cs-label">Outcome</div>
                <div className="mstrip">
                  <div className="ms"><b>1284×968</b><span>live UVC video</span></div>
                  <div className="ms"><b>5-stage</b><span>demosaic pipeline</span></div>
                  <div className="ms"><b>1</b><span>CDC point total</span></div>
                  <div className="ms"><b>Q12</b><span>fixed-point BT.601</span></div>
                  <div className="ms"><b>5</b><span>bugs root-caused</span></div>
                  <div className="ms"><b>2</b><span>theories falsified</span></div>
                </div>
                <div className="tags" style={{ marginTop: "1.1rem" }}>{["Verilog", "Bilinear Demosaic", "Async FIFO / CDC", "BT.601 · YUV422", "Fixed-Point DSP", "FWFT", "UVC / FX3", "ILA", "Sensor Calibration"].map((t) => <span className="tag" key={t}>{t}</span>)}</div>
              </div>
            </div>
          </div>
          </CaseStudy>

          <CaseStudy
            id="sd-controller"
            org="OrVis Semi · Industry"
            orgTone="ind"
            domain="Protocol · Storage · FSM Design"
            title="Bare-Metal SDXC Controller in Pure Verilog"
            role="Sole RTL designer: 9-module architecture, three protocol FSMs, shared SPI engine, buffer subsystem, UART observation path, and the complete hardware debug cycle."
            impact="512-byte write → readback verified byte-for-byte on hardware · 6 bugs root-caused · no CPU anywhere in the system"
            summary="A microSD card is a timing-sensitive, protocol-driven peripheral. This design initializes it, reads and writes 512-byte blocks, and proves data integrity on hardware - with no processor anywhere in the system."
            tags={["Verilog", "SPI Mode 0", "SDXC / exFAT", "FSM Design", "BRAM", "Xilinx ILA"]}
          >
          <div className="cs-wrap">
            <div className="cs-head">
              <span className="cs-id">OrVis Semi · Spartan-7 XC7S50 · Boolean Board</span>
              <div className="cs-meta">
                <div className="m">Init clock<b>200 kHz</b></div>
                <div className="m">Data clock<b>12.5 MHz</b></div>
                <div className="m">Block size<b>512 B</b></div>
                <div className="m">Card<b>SanDisk SDXC 128 GB</b></div>
                <div className="m">SPI mode<b>Mode 0 · 3.3 V</b></div>
              </div>
            </div>
            <div className="cs-body">
              <div className="cs-sec">
                <div className="cs-label">Problem</div>
                <p>Read and write raw blocks on a modern SDXC card from FPGA fabric alone. SD-over-SPI demands exact command framing, response polling inside the NCR window, token detection, chip-select discipline across multi-byte transactions, and timeout handling at every stage - <b>get any one wrong and the card simply goes silent</b>, with no error message to read.</p>
              </div>

              <div className="cs-sec">
                <div className="cs-label">Architecture</div>
                <SdArchDiagram />
              </div>

              <div className="cs-sec">
                <div className="cs-label">Initialization - the sequence that has to be perfect</div>
                <InitSeq />
                <p style={{ marginTop: "1.1rem" }}>Each command carries its spec-exact frame - <span className="mono">CMD0 CRC=0x95</span>, <span className="mono">CMD8 arg=0x1AA</span> with echo verification, <span className="mono">ACMD41 HCS=1</span> looping under a 1-second timeout with a 10 µs inter-command gap. <span className="mono">CMD58</span> reads the OCR: <b>CCS=1 confirmed</b>, so all addressing is block-based. Timeout counting starts only after the first real ACMD41 launch - a subtle race I fixed after finding valid responses being discarded at the timeout edge.</p>
              </div>

              <div className="cs-sec">
                <div className="cs-label">Engineering decisions</div>
                <div className="dec-grid">
                  <div className="dec"><div className="dt">One SPI master, arbitrated - not three</div><div className="dd">The card exposes one SPI interface, so the design instantiates exactly one <span className="mono">spi_master_universal</span>. <span className="mono">sd_controller</span> muxes ownership by FSM state and state-gates chip-select, so inactive logic physically cannot glitch a live transfer.</div></div>
                  <div className="dec"><div className="dt">Runtime clock divider, not two clocks</div><div className="dd">One SPI engine serves both regimes: <span className="mono">clk_div=250</span> (≈200 kHz) for spec-mandated slow init, <span className="mono">clk_div=4</span> (12.5 MHz) for data - no second clock domain, no CDC where none is needed.</div></div>
                  <div className="dec"><div className="dt">Transaction framing lives in one place</div><div className="dd"><span className="mono">cs_hold</span> plus a dedicated LAST state in the SPI master decide whether CS stays low across bytes or releases with a programmed hold interval - command, token, data, and trailing bytes all inherit correct framing for free.</div></div>
                  <div className="dec"><div className="dt">Failure is a first-class output</div><div className="dd">Sticky error flags with 3-bit stage codes (bad R1, token timeout, CRC reject, busy timeout…) mapped to LEDs - most protocol failures are diagnosable <b>without a waveform capture</b>.</div></div>
                </div>
              </div>

              <div className="cs-sec">
                <div className="cs-label">Silicon debug log - found, root-caused, fixed, proven</div>
                <DebugLog title="sd_controller · bring-up incident log" bugs={SD_BUGS} />
              </div>

              <div className="cs-sec">
                <div className="cs-label">Hardware validation</div>
                <ul className="val-list">
                  <li><b>Boot-sector signature</b> <span className="mono">55 AA</span> read correctly via CMD17 - framing, token, and 512-byte receive proven in one shot.</li>
                  <li><b>exFAT navigated from raw blocks:</b> MBR → boot sector → root directory → allocation bitmap, locating a free region at <span className="mono">block 67072</span>.</li>
                  <li><b>Write → readback integrity:</b> known payload written to block 67072; pre-write and post-readback UART dumps matched byte-for-byte.</li>
                  <li><b>Every phase observable:</b> 16 LEDs carry init status, CCS, completion latches, and the live 3-bit write-error code.</li>
                </ul>
              </div>

              <div className="cs-sec">
                <div className="cs-label">Outcome</div>
                <div className="mstrip">
                  <div className="ms"><b>9</b><span>RTL modules</span></div>
                  <div className="ms"><b>3+1</b><span>protocol FSMs + arbiter</span></div>
                  <div className="ms"><b>1500+</b><span>lines Verilog</span></div>
                  <div className="ms"><b>512 B</b><span>verified blocks</span></div>
                  <div className="ms"><b>6</b><span>bugs root-caused</span></div>
                  <div className="ms"><b>0</b><span>CPU in datapath</span></div>
                </div>
                <div className="tags" style={{ marginTop: "1.1rem" }}>{["Verilog", "SPI Mode 0", "SDXC / exFAT", "FSM Design", "BRAM", "Bounded Timeouts", "Xilinx ILA", "UART Debug", "XDC / false-path"].map((t) => <span className="tag" key={t}>{t}</span>)}</div>
              </div>
            </div>
          </div>
          </CaseStudy>
        </section>

        {/* ================= ACADEMIC RESEARCH - IIIT Delhi ================= */}
        <section className="section" id="research">
          <div className="section-head">
            <Reveal><span className="eyebrow">03 - Academic Research</span>
              <h2 className="sec-title">IIIT Delhi - from architecture model to signoff.</h2>
              <p className="sec-sub">Network-on-Chip work under two advisors - the fabric taken through the complete Cadence RTL-to-GDSII flow, and a cycle-accurate simulator for architecture exploration - plus a machine-learning course project in medical imaging.</p></Reveal>
          </div>

          <CaseStudy
            id="asic-flow"
            org={<>IIIT Delhi · <a className="plink" href="https://iiitd.ac.in/sneh" target="_blank" rel="noopener noreferrer">Prof. Sneh Saurabh</a></>}
            orgTone="res"
            domain="ASIC Front-to-Back"
            title="2×2 Network-on-Chip - RTL to GDSII"
            role="Executed every stage of the flow myself on the Cadence toolchain - directed verification in Xcelium, Genus synthesis, Conformal equivalence, Innovus place-and-route, and Tempus signoff."
            impact="2.55 ns timing closure · WNS +814 ps · 1649 cells · clean GDSII at 90 nm"
            summary="The complete Cadence flow, executed end to end on a 2×2 NoC - with formal equivalence between what was written and what was built."
            tags={["Xcelium", "Genus", "Conformal", "Innovus", "Tempus", "DFT", "Tcl"]}
          >
          <div className="cs-wrap">
            <div className="cs-head">
              <span className="cs-id">Jan 2025 – Apr 2025 · Cadence toolchain · 90 nm</span>
              <div className="cs-meta">
                <div className="m">Timing closure<b>2.55 ns</b></div>
                <div className="m">WNS<b>+814 ps</b></div>
                <div className="m">Cells<b>1649</b></div>
                <div className="m">Post-route setup<b>+110 ps</b></div>
              </div>
            </div>
            <div className="cs-body">
              <div className="cs-sec" style={{ marginBottom: "1.8rem" }}>
                <GdsFlow />
              </div>
              <div className="cs-sec" style={{ marginBottom: 0 }}>
                <p><b>Verify:</b> 4 modules (mesh, master, router, ProcessingUnit); 3 directed testbenches in <b>Xcelium</b> - 100% block, 80% code coverage. <b>Build:</b> <b>Genus</b> synthesis to 2.55 ns closure; RTL-vs-netlist equivalence in <b>Conformal</b> across all synthesis scenarios. <b>Implement:</b> <b>Innovus</b> placement, CTS, 9-layer routing at 0.5/0.8 utilization; DFT scan insertion; signoff STA in <b>Tempus</b> → clean GDSII.</p>
              </div>
            </div>
          </div>
          </CaseStudy>

          <CaseStudy
            id="noc-simulator"
            org={<>IIIT Delhi · <a className="plink" href="https://iiitd.ac.in/sdeb" target="_blank" rel="noopener noreferrer">Prof. Sujay Deb</a></>}
            orgTone="res"
            domain="Architecture Exploration · NoC"
            title="3×3 Cycle-Accurate NoC Router Simulator"
            role="Built the simulator end to end in Python - input buffers, switch allocation, crossbar, and XY/YX routing modeled at flit-level cycle accuracy."
            impact="Dual-mode analysis: nominal (PVA) and Gaussian process variation (PVS · σ = 10% · ±3σ)"
            summary="A 9-router mesh modeled cycle by cycle - the architecture-exploration companion to the RTL build."
            tags={["Python", "XY/YX Routing", "HF/BF/TF Flits", "Process Variation"]}
          >
          <div className="cs-wrap">
            <div className="cs-head">
              <span className="cs-id">Jul 2024 – Dec 2024 · Python</span>
            </div>
            <div className="cs-body">
              <div className="cs-sec" style={{ marginBottom: "1.2rem" }}>
                <p>9-router mesh modeling input buffers, switch allocation, and crossbar; XY/YX routing with HF/BF/TF flit-level packets. Dual modes - nominal (<b>PVA</b>) and Gaussian process variation (<b>PVS</b>, σ = 10%, ±3σ) - the architecture-exploration companion to the RTL build.</p>
              </div>
              <div className="miniterm">{`> run --mode PVS --sigma 0.10
[cyc 0042] `}<span className="k">R(1,1)</span>{` SA grant → `}<span className="v">XBAR</span>{`
[cyc 0043] flit HF routed E→N  lat=`}<span className="v">7</span>{`
[cyc 0051] pkt#12 delivered     lat=`}<span className="v">14</span>{`
> latency report ......... `}<span className="k">OK</span></div>
            </div>
          </div>
          </CaseStudy>

          <CaseStudy
            id="derma-ai"
            org={<>IIIT Delhi · <a className="plink" href="https://iiitd.ac.in/jainendra" target="_blank" rel="noopener noreferrer">Prof. Jainendra Shukla</a></>}
            orgTone="res"
            domain="Machine Learning"
            title="Derma AI - 10-Class Skin-Condition Classifier"
            role="A dermatological image classifier built for the Machine Learning course: 10 skin-condition classes, an imbalanced real-world dataset, and a systematic comparison of classical machine learning against modern transfer-learning architectures."
            impact="10 condition classes · 6 pretrained CNNs + classical baselines evaluated · ResNet-50 best at 68.38% validation accuracy"
            summary="Can a network tell melanoma from eczema? 10 skin-condition classes and 8,620 dermatology images from repositories including ISIC and DermNet, heavy class imbalance handled with augmentation and resampling - and a wide comparison: six pretrained architectures, a from-scratch CNN, and classical baselines, with the overfitting gap reported rather than hidden."
            tags={["CNN", "Transfer Learning", "ResNet-50", "HOG + Random Forest", "SVM · KNN", "Data Augmentation"]}
          >
          <div className="cs-wrap">
            <div className="cs-head">
              <span className="cs-id">IIIT Delhi · Machine Learning Coursework · ISIC · DermNet · Mendeley</span>
              <div className="cs-meta">
                <div className="m">Condition classes<b>10</b></div>
                <div className="m">Training set<b>6,877 images</b></div>
                <div className="m">Validation set<b>1,743 images</b></div>
                <div className="m">Best model<b>ResNet-50</b></div>
                <div className="m">Validation accuracy<b>68.38%</b></div>
              </div>
            </div>
            <div className="cs-body">
              <div className="cs-sec">
                <div className="cs-label">Problem</div>
                <p>Dermatological diagnosis is manual, subjective, and unevenly available - and the conditions that matter most are the hardest to call by eye. The task: classify <b>10 skin conditions</b> - eczema and acne through melanoma - from images that vary in skin tone, lighting, and image quality, on a dataset where <b>the rare, dangerous classes are exactly the underrepresented ones</b>.</p>
              </div>

              <div className="cs-sec">
                <div className="cs-label">Pipeline - one dataset, three approaches</div>
                <MlPipelineDiagram />
              </div>

              <div className="cs-sec">
                <div className="cs-label">Methodology - key decisions</div>
                <div className="dec-grid">
                  <div className="dec"><div className="dt">Imbalance treated at the data layer</div><div className="dd">Eczema-heavy, melanoma-poor: augmentation (rotation, zoom, flip, crop) and resampling rebalanced the training set, with <span className="mono">224×224</span> resizing, <span className="mono">[0,1]</span> normalization, and brightness/contrast adjustment applied for consistency across models.</div></div>
                  <div className="dec"><div className="dt">Classical baselines kept in the race</div><div className="dd">HOG features (<span className="mono">9 orientations · 8×8 px cells · 2×2 blocks</span>) fused with color histograms into a 100-tree Random Forest, alongside SVM and KNN - so the deep-learning gains are measured against a real floor: SVM <b>33.87%</b> (ROC AUC 0.7483), KNN <b>19.70%</b>.</div></div>
                  <div className="dec"><div className="dt">Transfer learning as a sweep, not a pick</div><div className="dd">Six pretrained architectures evaluated on the same 10-class task. Depth won - ResNet-50 reached <b>68.38%</b> validation while the lightweight mobile models (MobileNetV2/V3Small, NASNetMobile) stayed below 20% - a negative result recorded, not discarded.</div></div>
                  <div className="dec"><div className="dt">Overfitting reported, not hidden</div><div className="dd">ResNet-50's <span className="mono">89.59%</span> train vs <span className="mono">68.38%</span> validation gap is flagged in the analysis, and the confusion matrix traces the misses: Herpes HPV, vascular tumors, and melanoma confuse one another where features overlap and training data is thinnest.</div></div>
                </div>
              </div>

              <div className="cs-sec">
                <div className="cs-label">The from-scratch floor - Sequential CNN</div>
                <CnnFlow />
                <p style={{ marginTop: "1.1rem" }}>Trained with <b>Adam</b> on categorical cross-entropy for 20 epochs with early stopping, it managed <span className="mono">26.77%</span> train / <span className="mono">30.89%</span> validation - and it stayed in the benchmark anyway, because a from-scratch floor is what makes the transfer-learning margin measurable rather than assumed.</p>
              </div>

              <div className="cs-sec">
                <div className="cs-label">Model benchmark - measured, not asserted</div>
                <MlBenchmarkChart />
              </div>

              <div className="cs-sec">
                <div className="cs-label">Evaluation - read class-wise, not just top-line</div>
                <ul className="val-list">
                  <li><b>Metrics beyond accuracy:</b> precision, recall, and F1-score evaluated per class, not just as a single headline number.</li>
                  <li><b>Confusion matrix:</b> diagonal-dominant overall, with residual confusion concentrated in rare categories like vascular tumors and melanoma.</li>
                  <li><b>Class-wise reading:</b> high precision on balanced classes such as eczema and psoriasis; lower recall exactly where training data is thinnest.</li>
                  <li><b>Separability beyond accuracy:</b> the classical baselines carry ROC AUC alongside raw accuracy - ranking quality, not just correctness.</li>
                </ul>
              </div>

              <div className="cs-sec">
                <div className="cs-label">Outcome</div>
                <div className="mstrip">
                  <div className="ms"><b>10</b><span>condition classes</span></div>
                  <div className="ms"><b>6,877</b><span>training images</span></div>
                  <div className="ms"><b>1,743</b><span>validation images</span></div>
                  <div className="ms"><b>68.38%</b><span>best validation</span></div>
                  <div className="ms"><b>89.59%</b><span>ResNet-50 training</span></div>
                  <div className="ms"><b>224×224</b><span>model input</span></div>
                </div>
                <div className="tags" style={{ marginTop: "1.1rem" }}>{["CNN", "Transfer Learning", "ResNet-50", "EfficientNetB0", "VGG16", "HOG Features", "Random Forest", "SVM", "KNN", "Data Augmentation", "Confusion-Matrix Analysis"].map((t) => <span className="tag" key={t}>{t}</span>)}</div>
              </div>
            </div>
          </div>
          </CaseStudy>
        </section>

        {/* ================= SKILLS ================= */}
        <section className="section" id="skills">
          <div className="section-head">
            <Reveal><span className="eyebrow">04 - Skills</span>
              <h2 className="sec-title">Measured on the scope.</h2>
              <p className="sec-sub">Every EXPERT tag below is load-bearing in a case study above - duty cycle encodes depth.</p></Reveal>
          </div>
          {SKILL_GROUPS.map((grp, gi) => (
            <Reveal className="skgroup" key={grp.h} delay={gi * 60}>
              <h3>{grp.h}</h3>
              <div className="skgrid">
                {grp.items.map(([name, tier]) => (
                  <div className="skrow" key={name}>
                    <span className="name">{name}</span>
                    <span className={`tier ${tier[0].toLowerCase()}`}>{tier}</span>
                    <Scope tier={tier} />
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </section>

        {/* ================= EDUCATION ================= */}
        <section className="section" id="education">
          <div className="section-head">
            <Reveal><span className="eyebrow">05 - Education & Recognition</span>
              <h2 className="sec-title">IIIT Delhi, top of the class.</h2></Reveal>
          </div>
          <div className="edu-grid">
            <Reveal className="edu-card">
              <div className="deg">B.Tech, Electronics &amp; Communication Engineering</div>
              <div className="inst">IIIT Delhi - Indraprastha Institute of Information Technology</div>
              <div className="yr">2021 – 2025 · Graduating Batch of 2025 · New Delhi</div>
              <div className="cw">{["Digital VLSI Design", "VLSI Design Flow", "FPGA Design", "CMOS", "Computer Architecture", "Semiconductor Devices"].map((c) => <span className="tag" key={c}>{c}</span>)}</div>
            </Reveal>
            <Reveal className="csp" delay={120}>
              <span className="badge">◆ Cadence Design Systems</span>
              <div className="t">CSP Scholar</div>
              <div className="d">Cadence Scholarship Program - awarded to the top 1% of ECE students nationally.</div>
            </Reveal>
          </div>
          <div className="lead-grid">
            {[
              ["Undergraduate Researcher", "Cognitive Sciences Lab, IIIT Delhi", "Python/MATLAB signal-processing pipelines for real-time EEG acquisition, saliency modeling, and eye-tracking analysis."],
              ["Core Team Lead", "Entrepreneurship Cell, IIIT Delhi", "Organized 80+ events and mentored 15+ campus startups, including North India's largest offline hackathon."],
              ["WomenInTech Lead", "IIIT Delhi", "Revived and grew the club into one of the most active student bodies on campus."],
            ].map((l, i) => (
              <Reveal className="lead" key={l[0]} delay={i * 90}>
                <div className="role">{l[0]}</div>
                <div className="ti">{l[1]}</div>
                <div className="de">{l[2]}</div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ================= JOURNEY ================= */}
        <section className="section" id="journey">
          <div className="section-head">
            <Reveal><span className="eyebrow">06 - The Journey</span>
              <h2 className="sec-title">Nine years. One campus. Full circle.</h2>
              <p className="sec-sub">Everything above traces back to a summer camp at IIIT-Delhi in 2016 - attended as a school student, returned to as a volunteer, a mentor, and finally the keynote speaker.</p></Reveal>
          </div>

          <div className="jny-intro">
            <Reveal className="jny-prose">
              <p>I went to <strong>Rajkiya Pratibha Vikas Vidyalaya (RPVV), Lajpat Nagar</strong> - a Delhi government school whose story has been <a className="plink" href={LINKS.schoolFilm} target="_blank" rel="noopener noreferrer">told on film ↗</a>. In 2016, that school sent me to the <strong>IIIT-Delhi Summer Camp</strong>. I walked in as a participant and walked out with a target: get into this college, properly.</p>
              <p>Five years later I did - and every summer after that, I went back to the camp that started it: first as a <strong>volunteer and teaching mentor</strong> (with a Special Mention for Best Volunteer), then as a <strong>mentor</strong>, and in 2025 as the <strong>keynote speaker</strong>, telling the story to a hall full of students sitting where I once sat.</p>
              <p>The timeline below is the honest version of a résumé line that would just say "volunteer".</p>
            </Reveal>
          </div>

          <ol className="tl">
            {JOURNEY.map((j, i) => (
              <Reveal as="li" className={`tl-item ${j.cls}`} key={j.yr} delay={i * 70}>
                <span className="tl-yr">{j.yr}</span><span className="tl-tag">{j.tag}</span>
                <div className="tl-ti">{j.title}</div>
                <p className="tl-de">{j.text}</p>
                {j.award && <span className="tl-award">{j.award}</span>}
                {j.photos && (
                  <div className="tl-photos">
                    {j.photos.map((p) => <Photo key={p.cap} {...p} />)}
                  </div>
                )}
              </Reveal>
            ))}
          </ol>

          <div className="duo-grid">
            <Reveal className="side-card">
              <span className="sc-tag">Signal out - Podcast</span>
              <h3>The journey, told out loud</h3>
              <PodWave />
              <p>Invited as a podcast guest for the same reason this section exists: the <b>RPVV → summer camp → IIIT-Delhi → silicon</b> arc is a story worth telling to students standing at its start. The conversation covers the government-school years, the camp that changed the trajectory, and what building real hardware actually feels like.</p>
              <a className="btn sc-cta" href={LINKS.podcast} target="_blank" rel="noopener noreferrer">▶ Listen - segment starts at 51:17 ↗</a>
            </Reveal>
            <Reveal className="side-card" delay={100}>
              <span className="sc-tag">Signal in - Photography</span>
              <h3>The same eye, unplugged</h3>
              <IcoAperture />
              <p>Months spent calibrating an imaging pipeline - <b>white-balance gains, black-level offsets, clipped highlights</b> - change how you look at light permanently. Photography is that same observation loop without the FPGA in between: metering a scene is reading a sensor, composing is floorplanning. The field log lives on Instagram.</p>
              <a className="btn sc-cta" href={LINKS.instagram} target="_blank" rel="noopener noreferrer">@yrjverse on Instagram ↗</a>
            </Reveal>
          </div>
        </section>

        {/* ================= CONTACT ================= */}
        <section className="section contact" id="contact">
          <Reveal>
            <span className="eyebrow">07 - Contact</span>
            <h2>Let's tape something out.</h2>
            <div className="pill">📍 New Delhi, India - open to relocation</div>
            <p className="sub">Open to full-time roles in RTL / Digital Design, FPGA Engineering, and Physical Design. Currently at OrVis Semi, serving a 30-day notice period - the fastest way to evaluate me is the debug logs above.</p>
          </Reveal>
          <Reveal className="cc-grid" delay={120}>
            <a className="cc" href="mailto:yashrajojha07@gmail.com">
              <div className="ico"><IcoMail /></div><div className="lab">Email</div><div className="val">yashrajojha07@gmail.com</div>
            </a>
            <a className="cc" href="https://www.linkedin.com/in/yrjojha/" target="_blank" rel="noopener noreferrer">
              <div className="ico"><IcoLinkedin /></div><div className="lab">LinkedIn</div><div className="val">/in/yrjojha</div>
            </a>
            <a className="cc" href="https://github.com/yashrajojha07" target="_blank" rel="noopener noreferrer">
              <div className="ico"><IcoGithub /></div><div className="lab">GitHub</div><div className="val">/yashrajojha07</div>
            </a>
          </Reveal>
        </section>
        </main>

        {/* ================= FOOTER ================= */}
        <footer className="footer">
          <div className="footer-in">
            <div>© 2026 Yash Raj Ojha</div>
            <div className="mid">{navIds.map((n) => <a key={n} href={`#${n}`} onClick={(e) => { e.preventDefault(); go(n); }}>{navLabels[n]}</a>)}</div>
            <div>Built with precision. Verified on hardware.</div>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* ---------- icons ---------- */
const IcoSun = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4.4" />
    <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7" />
  </svg>
);
const IcoMoon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);
const IcoAperture = () => (
  <svg className="apt" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="m14.31 8 5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16 3.95 6.06M14.31 16H2.83m13.79-4-5.74 9.94" />
  </svg>
);
const IcoMail = () => (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 6 10 7 10-7" /></svg>);
const IcoLinkedin = () => (<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.3c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21H9z" /></svg>);
const IcoGithub = () => (<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.85 9.73.5.1.68-.22.68-.49l-.01-1.9c-2.79.62-3.38-1.22-3.38-1.22-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9l-.01 2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" /></svg>);
