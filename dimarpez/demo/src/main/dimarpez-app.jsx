import { useState, useEffect, useRef } from "react";

// ─── CONFIG API ───────────────────────────────────────────
// En desarrollo: http://localhost:8080
// En producción: cambia por la URL de tu servidor
const API = "http://localhost:8080/api";

const get  = (url) => fetch(`${API}${url}`).then(r => r.json());
const post = (url, body) => fetch(`${API}${url}`, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(body) }).then(r => r.json());
const put  = (url, body) => fetch(`${API}${url}`, { method:"PUT",  headers:{"Content-Type":"application/json"}, body: JSON.stringify(body) }).then(r => r.json());

// ─── CONSTANTES ───────────────────────────────────────────
const WEIGHT_OPTIONS  = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 5];
const PAYMENT_METHODS = ["Efectivo", "Nequi", "Daviplata", "Transferencia Bancaria"];
const ORDER_STATUSES  = ["Pendiente", "Confirmado", "En camino", "Entregado", "Cancelado"];
const STATUS_COLORS   = { Pendiente:"#f59e0b", Confirmado:"#5aace8", "En camino":"#38bdf8", Entregado:"#34d399", Cancelado:"#f87171" };
const EMPTY_PRODUCT   = { nombre:"", emoji:"🐟", categoria:"", descripcion:"", precio:"", stock:"", unidad:"kg", activo:"true" };

const cop   = (n) => `$${Number(n).toLocaleString("es-CO")}`;
const genId = () => `#${Math.floor(10000 + Math.random() * 90000)}`;

// ─── ESTILOS ──────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --sky:#5aace8; --navy:#1a6ba0; --gold:#f5a623; --gold2:#e8931a;
  --bg:#e6f2fb; --surface:#eef6ff; --ink:#0f2a3f; --muted:#6b8fa8;
  --border:#bfdcf2; --red:#f87171; --green:#34d399;
  --radius:10px; --radius-lg:16px;
}
body { font-family:'Nunito',sans-serif; background:var(--bg); color:var(--ink); min-height:100vh; }
button { cursor:pointer; font-family:'Nunito',sans-serif; }
input,textarea,select { font-family:'Nunito',sans-serif; }
::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px}

.nav{position:sticky;top:0;z-index:100;background:rgba(230,242,251,0.94);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);height:62px;padding:0 28px;display:flex;align-items:center;justify-content:space-between;gap:16px;transition:box-shadow 0.2s}
.nav.scrolled{box-shadow:0 2px 20px rgba(90,172,232,0.15)}
.logo{font-size:1.4rem;font-weight:800;color:var(--navy);letter-spacing:-0.5px;cursor:pointer;display:flex;align-items:center;gap:8px}
.logo span{color:var(--gold)}
.nav-links{display:flex;gap:2px}
.nav-link{background:none;border:none;color:var(--muted);font-size:0.88rem;font-weight:600;padding:6px 14px;border-radius:8px;transition:all 0.2s}
.nav-link:hover{color:var(--navy);background:rgba(90,172,232,0.08)}
.nav-link.active{color:var(--navy);background:rgba(90,172,232,0.12)}
.nav-right{display:flex;gap:10px;align-items:center}
.cart-btn{background:var(--gold);border:none;border-radius:var(--radius);color:#fff;font-weight:700;font-size:0.85rem;padding:8px 18px;display:flex;align-items:center;gap:8px;transition:all 0.2s}
.cart-btn:hover{background:var(--gold2);transform:translateY(-1px)}
.cart-count{background:var(--navy);color:#fff;border-radius:50%;width:18px;height:18px;display:flex;align-items:center;justify-content:center;font-size:0.68rem;font-weight:800}

.user-menu{position:relative}
.user-btn{background:none;border:1.5px solid var(--border);border-radius:var(--radius);color:var(--ink);font-size:0.85rem;font-weight:600;padding:7px 16px;display:flex;align-items:center;gap:8px;transition:all 0.2s}
.user-btn:hover{border-color:var(--sky);color:var(--navy)}
.u-avatar{width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,var(--sky),var(--navy));display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:800;color:#fff}
.u-chev{font-size:0.6rem;color:var(--muted);transition:transform 0.2s}
.u-chev.open{transform:rotate(180deg)}
.dropdown{position:absolute;top:calc(100% + 8px);right:0;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);min-width:200px;box-shadow:0 8px 32px rgba(26,107,160,0.12);overflow:hidden;animation:dropIn 0.18s ease;z-index:200}
@keyframes dropIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
.dd-head{padding:14px 16px 10px;border-bottom:1px solid var(--border)}
.dd-name{font-weight:700;font-size:0.9rem}
.dd-email{font-size:0.75rem;color:var(--muted);margin-top:1px}
.dd-item{display:flex;align-items:center;gap:10px;padding:10px 16px;font-size:0.85rem;font-weight:600;color:var(--ink);border:none;background:none;width:100%;text-align:left;transition:background 0.15s}
.dd-item:hover{background:rgba(90,172,232,0.07);color:var(--navy)}
.dd-item.danger{color:var(--red)}
.dd-item.danger:hover{background:rgba(248,113,113,0.07)}
.dd-div{height:1px;background:var(--border);margin:4px 0}

.hero{position:relative;overflow:hidden;padding:80px 28px 68px;text-align:center;background:linear-gradient(160deg,#dcefff 0%,#e6f2fb 55%,#f0f9ff 100%)}
.hero-pattern{position:absolute;inset:0;opacity:0.04;background-image:radial-gradient(circle,var(--navy) 1px,transparent 1px);background-size:28px 28px;pointer-events:none}
.blob{position:absolute;border-radius:50%;filter:blur(60px);pointer-events:none;animation:float 8s ease-in-out infinite}
.blob1{width:300px;height:300px;background:rgba(90,172,232,0.1);top:-80px;right:-60px}
.blob2{width:240px;height:240px;background:rgba(245,166,35,0.08);bottom:-40px;left:-40px;animation-delay:-4s}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
.hero-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(90,172,232,0.1);border:1px solid rgba(90,172,232,0.22);border-radius:50px;padding:5px 16px;font-size:0.78rem;font-weight:600;color:var(--navy);margin-bottom:22px}
.badge-dot{width:7px;height:7px;border-radius:50%;background:var(--green);animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
.hero h1{font-size:clamp(2.2rem,6vw,3.8rem);font-weight:800;line-height:1.08;color:var(--ink);letter-spacing:-1.5px;margin-bottom:14px}
.hero h1 em{color:var(--sky);font-style:normal}
.hero h1 strong{color:var(--gold)}
.hero-sub{color:var(--muted);font-size:1rem;font-weight:500;max-width:440px;margin:0 auto 28px;line-height:1.7}
.hero-cta{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:40px}
.btn-primary{background:var(--sky);color:#fff;border:none;border-radius:var(--radius);padding:13px 28px;font-weight:700;font-size:0.95rem;transition:all 0.2s}
.btn-primary:hover{background:var(--navy);transform:translateY(-2px);box-shadow:0 6px 20px rgba(90,172,232,0.3)}
.btn-primary:disabled{opacity:0.5;cursor:not-allowed;transform:none;box-shadow:none}
.btn-outline{background:none;color:var(--navy);border:1.5px solid var(--border);border-radius:var(--radius);padding:13px 28px;font-weight:700;font-size:0.95rem;transition:all 0.2s}
.btn-outline:hover{border-color:var(--sky);color:var(--sky)}
.hero-stats{display:flex;gap:32px;justify-content:center;flex-wrap:wrap}
.hstat-val{font-size:1.5rem;font-weight:800;color:var(--navy)}
.hstat-label{font-size:0.75rem;font-weight:600;color:var(--muted);margin-top:2px}

.info-section{max-width:920px;margin:0 auto;padding:52px 28px}
.info-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px}
.info-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:22px;transition:all 0.25s}
.info-card:hover{border-color:var(--sky);transform:translateY(-2px);box-shadow:0 4px 20px rgba(90,172,232,0.1)}
.info-icon{width:40px;height:40px;border-radius:10px;background:rgba(90,172,232,0.1);display:flex;align-items:center;justify-content:center;font-size:1.2rem;margin-bottom:12px}
.info-title{font-weight:700;font-size:0.9rem;margin-bottom:5px}
.info-text{font-size:0.8rem;color:var(--muted);line-height:1.65}
.info-text strong{color:var(--navy);font-weight:700}

.catalog{max-width:960px;margin:0 auto;padding:8px 28px 52px}
.section-title{font-size:1.6rem;font-weight:800;margin-bottom:20px}
.section-title span{color:var(--sky)}
.filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px}
.filter{background:var(--surface);border:1px solid var(--border);color:var(--muted);border-radius:50px;padding:6px 18px;font-size:0.82rem;font-weight:600;transition:all 0.2s}
.filter:hover{border-color:var(--sky);color:var(--navy)}
.filter.on{background:var(--sky);color:#fff;border-color:var(--sky)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px}

.pcard{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:20px;display:flex;flex-direction:column;gap:10px;transition:all 0.25s}
.pcard:hover{border-color:rgba(90,172,232,0.5);box-shadow:0 6px 24px rgba(90,172,232,0.1);transform:translateY(-3px)}
.p-emoji{font-size:2.2rem}
.p-cat{font-size:0.7rem;font-weight:700;color:var(--sky);text-transform:uppercase;letter-spacing:0.06em}
.p-name{font-weight:700;font-size:0.95rem}
.p-desc{font-size:0.78rem;color:var(--muted);line-height:1.55;flex:1}
.p-price{font-size:1.1rem;font-weight:800;color:var(--navy)}
.p-price small{font-size:0.7rem;color:var(--muted);font-weight:500}
.p-stock{font-size:0.72rem;color:var(--muted);font-weight:500}
.wselect{background:var(--bg);border:1px solid var(--border);border-radius:8px;color:var(--ink);padding:8px 10px;font-size:0.82rem;width:100%;transition:border-color 0.2s}
.wselect:focus{outline:none;border-color:var(--sky)}
.add-btn{background:var(--sky);color:#fff;border:none;border-radius:8px;padding:10px;font-weight:700;font-size:0.88rem;width:100%;transition:all 0.2s}
.add-btn:hover{background:var(--navy)}
.add-btn.ok{background:var(--green)}
.add-btn:disabled{background:var(--border);color:var(--muted);cursor:not-allowed}

.overlay{position:fixed;inset:0;z-index:200;background:rgba(15,42,63,0.45);backdrop-filter:blur(4px);animation:fadeIn 0.2s}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.panel{position:fixed;right:0;top:0;bottom:0;z-index:201;width:min(400px,100vw);background:var(--surface);border-left:1px solid var(--border);display:flex;flex-direction:column;animation:slideR 0.28s ease;box-shadow:-8px 0 40px rgba(26,107,160,0.1)}
@keyframes slideR{from{transform:translateX(100%)}to{transform:translateX(0)}}
.panel-head{padding:18px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.panel-head h2{font-size:1.15rem;font-weight:800}
.close-btn{background:none;border:1px solid var(--border);border-radius:8px;width:32px;height:32px;color:var(--muted);font-size:1rem;display:flex;align-items:center;justify-content:center;transition:all 0.2s}
.close-btn:hover{background:var(--bg);color:var(--ink)}
.panel-body{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px}
.empty{text-align:center;color:var(--muted);padding:52px 20px}
.ci{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:12px;display:flex;gap:10px;align-items:flex-start;animation:fadeIn 0.2s}
.ci-e{font-size:1.6rem}
.ci-info{flex:1}
.ci-name{font-weight:700;font-size:0.88rem}
.ci-sub{font-size:0.75rem;color:var(--muted);margin-top:2px}
.ci-price{font-weight:800;color:var(--gold2);font-size:0.9rem;margin-top:3px}
.ci-del{background:none;border:none;color:var(--muted);font-size:0.9rem;padding:2px;transition:color 0.2s}
.ci-del:hover{color:var(--red)}
.panel-foot{padding:16px;border-top:1px solid var(--border)}
.total-row{display:flex;justify-content:space-between;font-weight:800;font-size:1.05rem;margin-bottom:14px}
.total-row span:last-child{color:var(--navy);font-size:1.15rem}

.modal-bg{position:fixed;inset:0;z-index:300;background:rgba(15,42,63,0.55);backdrop-filter:blur(6px);display:flex;align-items:flex-end;padding:0;animation:fadeIn 0.2s}
@media(min-width:600px){.modal-bg{align-items:center;padding:20px}}
.modal{background:var(--surface);border-radius:20px 20px 0 0;width:100%;max-height:92vh;overflow-y:auto;padding:28px 24px;animation:slideU 0.28s ease;box-shadow:0 -8px 40px rgba(26,107,160,0.12)}
@media(min-width:600px){.modal{max-width:480px;border-radius:20px;margin:auto}}
@keyframes slideU{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}
.modal-title{font-size:1.4rem;font-weight:800;margin-bottom:4px}
.modal-sub{color:var(--muted);font-size:0.82rem;margin-bottom:22px;font-weight:500}
.fg{margin-bottom:14px}
.label{display:block;font-size:0.75rem;font-weight:700;color:var(--sky);margin-bottom:5px;text-transform:uppercase;letter-spacing:0.05em}
.input,.textarea,.fselect{width:100%;background:var(--bg);border:1px solid var(--border);border-radius:8px;color:var(--ink);padding:10px 14px;font-size:0.88rem;font-weight:500;outline:none;transition:border-color 0.2s}
.input:focus,.textarea:focus,.fselect:focus{border-color:var(--sky)}
.input::placeholder,.textarea::placeholder{color:var(--muted);font-weight:400}
.textarea{resize:vertical;min-height:72px}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.pay-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px}
.pay-opt{background:var(--bg);border:1.5px solid var(--border);border-radius:8px;padding:10px 8px;text-align:center;font-size:0.8rem;font-weight:600;color:var(--muted);cursor:pointer;transition:all 0.2s}
.pay-opt:hover{border-color:var(--sky);color:var(--navy)}
.pay-opt.on{border-color:var(--sky);color:var(--navy);background:rgba(90,172,232,0.08)}
.summary{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:14px;margin:18px 0}
.sum-title{font-size:0.72rem;font-weight:700;color:var(--sky);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px}
.sum-item{display:flex;justify-content:space-between;font-size:0.82rem;color:var(--muted);margin-bottom:6px;font-weight:500}
.sum-total{display:flex;justify-content:space-between;font-weight:800;font-size:1rem;border-top:1px solid var(--border);padding-top:10px;margin-top:8px}
.sum-total span:last-child{color:var(--navy)}
.ferror{font-size:0.75rem;color:var(--red);margin-top:4px;font-weight:600}
.btn-full{width:100%;background:var(--sky);color:#fff;border:none;border-radius:var(--radius);padding:13px;font-weight:700;font-size:0.95rem;margin-top:16px;transition:all 0.2s}
.btn-full:hover{background:var(--navy)}
.btn-full:disabled{opacity:0.5;cursor:not-allowed}
.btn-confirm{width:100%;background:var(--gold);color:#fff;border:none;border-radius:var(--radius);padding:14px;font-weight:700;font-size:0.95rem;transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:8px}
.btn-confirm:hover{background:var(--gold2);transform:translateY(-1px);box-shadow:0 4px 16px rgba(245,166,35,0.3)}
.btn-confirm:disabled{opacity:0.5;cursor:not-allowed;transform:none;box-shadow:none}
.btn-ghost{width:100%;background:none;color:var(--muted);border:1px solid var(--border);border-radius:var(--radius);padding:11px;font-size:0.88rem;font-weight:600;margin-top:10px;transition:all 0.2s}
.btn-ghost:hover{color:var(--ink);border-color:var(--muted)}
.auth-tabs{display:flex;background:var(--bg);border-radius:var(--radius);padding:3px;margin-bottom:22px}
.auth-tab{flex:1;padding:8px;text-align:center;border:none;background:none;color:var(--muted);font-size:0.85rem;font-weight:600;border-radius:8px;transition:all 0.2s}
.auth-tab.on{background:var(--sky);color:#fff}

.admin{max-width:1000px;margin:0 auto;padding:36px 28px}
.page-title{font-size:1.8rem;font-weight:800;margin-bottom:24px}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:28px}
.stat{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:18px;transition:border-color 0.2s}
.stat:hover{border-color:var(--sky)}
.stat-val{font-size:1.4rem;font-weight:800;color:var(--navy);margin-top:6px}
.stat-label{font-size:0.72rem;font-weight:600;color:var(--muted);margin-top:3px}
.tabs{display:flex;gap:8px;margin-bottom:24px;border-bottom:1px solid var(--border);padding-bottom:14px}
.tab{background:none;border:1px solid var(--border);color:var(--muted);border-radius:8px;padding:7px 18px;font-size:0.85rem;font-weight:600;transition:all 0.2s}
.tab:hover{border-color:var(--sky);color:var(--navy)}
.tab.on{background:var(--sky);color:#fff;border-color:var(--sky)}
.orders{display:flex;flex-direction:column;gap:14px}
.ocard{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:18px;transition:border-color 0.2s}
.ocard:hover{border-color:var(--sky)}
.ocard-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:12px}
.ocode{font-weight:800;color:var(--navy)}
.otime{font-size:0.75rem;color:var(--muted);margin-top:2px;font-weight:500}
.sbadge{border-radius:50px;padding:3px 12px;font-size:0.72rem;font-weight:700}
.oinfo{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;font-size:0.82rem;color:var(--muted);margin-bottom:12px}
.oinfo strong{color:var(--ink);display:block;font-size:0.85rem;font-weight:700}
.oitems{background:var(--bg);border-radius:8px;padding:10px;margin-bottom:12px;font-size:0.82rem;color:var(--muted);display:flex;flex-direction:column;gap:4px;font-weight:500}
.ototal{text-align:right;font-weight:800;color:var(--gold2)}
.ssel{background:var(--bg);border:1px solid var(--border);border-radius:8px;color:var(--ink);padding:6px 10px;font-size:0.82rem;font-weight:600}
.inv-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:14px}
.icard{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:16px}
.icard-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.iname{font-weight:700}
.itoggle{font-size:0.72rem;padding:3px 12px;border-radius:50px;border:none;font-weight:700}
.itoggle.on{background:rgba(52,211,153,0.15);color:#059669}
.itoggle.off{background:rgba(248,113,113,0.12);color:#dc2626}
.ifields{display:flex;flex-direction:column;gap:8px}
.ifield{display:flex;align-items:center;gap:8px;font-size:0.82rem}
.ifield label{color:var(--muted);width:64px;flex-shrink:0;font-weight:600}
.iinput{background:var(--bg);border:1px solid var(--border);border-radius:8px;color:var(--ink);padding:5px 10px;font-size:0.82rem;width:100%;outline:none;font-weight:500}
.iinput:focus{border-color:var(--sky)}
.save-btn{margin-top:10px;background:var(--sky);color:#fff;border:none;border-radius:8px;padding:7px 16px;font-weight:700;font-size:0.8rem;transition:all 0.2s}
.save-btn:hover{background:var(--navy)}
.add-form{background:rgba(90,172,232,0.05);border:1.5px dashed var(--sky);border-radius:var(--radius-lg);padding:20px;margin-bottom:20px}
.add-form h3{font-weight:700;font-size:0.9rem;color:var(--navy);margin-bottom:16px}
.add-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media(max-width:500px){.add-grid{grid-template-columns:1fr}}
.add-full{grid-column:1/-1}

.profile{max-width:640px;margin:0 auto;padding:36px 28px}
.psec{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:22px;margin-bottom:16px}
.psec h3{font-weight:700;font-size:0.78rem;color:var(--sky);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:16px}
.hist{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:14px;margin-bottom:10px;transition:border-color 0.2s}
.hist:hover{border-color:var(--sky)}
.hist-top{display:flex;justify-content:space-between;margin-bottom:6px;font-weight:700;font-size:0.88rem}
.hist-sub{color:var(--muted);line-height:1.6;font-size:0.8rem;font-weight:500}

.success{position:fixed;inset:0;z-index:500;background:var(--surface);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px 24px;animation:popIn 0.35s ease}
@keyframes popIn{from{opacity:0;transform:scale(0.97)}to{opacity:1;transform:scale(1)}}
.success-icon{font-size:5rem;margin-bottom:20px;animation:bounce 0.6s ease 0.3s both}
@keyframes bounce{0%{transform:scale(0.5);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
.success h2{font-size:2rem;font-weight:800;color:var(--navy);margin-bottom:12px}
.success p{color:var(--muted);max-width:320px;line-height:1.7;font-weight:500}

.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--navy);color:#fff;padding:10px 24px;border-radius:50px;font-weight:700;font-size:0.82rem;z-index:600;animation:toastIn 0.25s ease;white-space:nowrap;box-shadow:0 4px 20px rgba(26,107,160,0.25)}
.toast.err{background:var(--red)}
@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
.loading{display:flex;align-items:center;justify-content:center;padding:60px;color:var(--muted);gap:10px;font-weight:600}
.spin{width:20px;height:20px;border:2px solid var(--border);border-top-color:var(--sky);border-radius:50%;animation:spin 0.7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.divider{height:1px;background:var(--border)}
.footer{padding:28px;text-align:center;color:var(--muted);font-size:0.8rem;font-weight:500}
.footer strong{color:var(--navy);font-weight:700}
`;

// ─── TOAST ─────────────────────────────────────────────────
function Toast({ msg, type }) {
  if (!msg) return null;
  return <div className={`toast ${type === "err" ? "err" : ""}`}>{msg}</div>;
}

// ─── USER DROPDOWN ──────────────────────────────────────────
function UserDropdown({ perfil, onNavigate, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const initials = (perfil?.nombre || "U").slice(0, 2).toUpperCase();

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="user-menu" ref={ref}>
      <button className="user-btn" onClick={() => setOpen(o => !o)}>
        <div className="u-avatar">{initials}</div>
        {perfil?.nombre?.split(" ")[0] || "Usuario"}
        <span className={`u-chev ${open ? "open" : ""}`}>▼</span>
      </button>
      {open && (
        <div className="dropdown">
          <div className="dd-head">
            <div className="dd-name">{perfil?.nombre || "Usuario"}</div>
            <div className="dd-email">{perfil?.rol === "admin" ? "Administrador" : "Cliente"}</div>
          </div>
          <button className="dd-item" onClick={() => { onNavigate("profile"); setOpen(false); }}>👤 Mi perfil</button>
          <button className="dd-item" onClick={() => { onNavigate("orders"); setOpen(false); }}>📦 Mis pedidos</button>
          <button className="dd-item" onClick={() => { onNavigate("settings"); setOpen(false); }}>⚙️ Configuración</button>
          <div className="dd-div" />
          <button className="dd-item danger" onClick={() => { onLogout(); setOpen(false); }}>🚪 Cerrar sesión</button>
        </div>
      )}
    </div>
  );
}

// ─── PRODUCT CARD ───────────────────────────────────────────
function ProductCard({ product, onAdd }) {
  const [weight, setWeight] = useState(0.5);
  const [added, setAdded] = useState(false);
  const noStock = Number(product.stock) <= 0;

  const handleAdd = () => {
    onAdd(product, weight);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="pcard">
      <div className="p-emoji">{product.emoji}</div>
      <div className="p-cat">{product.categoria}</div>
      <div className="p-name">{product.nombre}</div>
      <div className="p-desc">{product.descripcion}</div>
      <div className="p-price">{cop(product.precio)} <small>/ {product.unidad}</small></div>
      <div className="p-stock">📦 {product.stock} {product.unidad} disponibles</div>
      <select className="wselect" value={weight} onChange={e => setWeight(+e.target.value)} disabled={noStock}>
        {WEIGHT_OPTIONS.map(w => (
          <option key={w} value={w}>{w < 1 ? `${w * 1000}g` : `${w} kg`} — {cop(product.precio * w)}</option>
        ))}
      </select>
      <button className={`add-btn ${added ? "ok" : ""}`} onClick={handleAdd} disabled={noStock}>
        {noStock ? "Sin stock" : added ? "✓ Agregado" : "+ Agregar al carrito"}
      </button>
    </div>
  );
}

// ─── CART PANEL ─────────────────────────────────────────────
function CartPanel({ cart, onClose, onRemove, onCheckout }) {
  const total = cart.reduce((s, i) => s + i.subtotal, 0);
  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="panel">
        <div className="panel-head">
          <h2>🛒 Tu pedido</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="panel-body">
          {cart.length === 0
            ? <div className="empty"><div style={{fontSize:"3rem",marginBottom:12}}>🦐</div><p>Tu carrito está vacío</p></div>
            : cart.map(i => (
              <div key={i.cartId} className="ci">
                <span className="ci-e">{i.emoji}</span>
                <div className="ci-info">
                  <div className="ci-name">{i.nombre}</div>
                  <div className="ci-sub">{i.weight < 1 ? `${i.weight * 1000}g` : `${i.weight} kg`} × {cop(i.precio)}/{i.unidad}</div>
                  <div className="ci-price">{cop(i.subtotal)}</div>
                </div>
                <button className="ci-del" onClick={() => onRemove(i.cartId)}>🗑️</button>
              </div>
            ))
          }
        </div>
        <div className="panel-foot">
          <div className="total-row"><span>Total</span><span>{cop(total)}</span></div>
          <button className="btn-primary" style={{width:"100%"}} disabled={cart.length === 0} onClick={onCheckout}>
            Continuar al pago →
          </button>
        </div>
      </div>
    </>
  );
}

// ─── CHECKOUT MODAL ─────────────────────────────────────────
// El pedido se envía a POST /api/pedidos con la estructura:
// { codigo, nombre, alias, direccion, metodoPago, nota, estado, perfil:{id}, items:[{nombre, precioUnit, cantidadKg, subtotal, producto:{id}}] }
function CheckoutModal({ cart, perfil, onClose, onSuccess, showToast }) {
  const [form, setForm] = useState({
    nombre: perfil?.nombre || "",
    direccion: perfil?.direccion || "",
    alias: perfil?.alias || "",
    nota: "",
    metodoPago: perfil?.metodoPago || "",
  });
  const [loading, setLoading] = useState(false);
  const total = cart.reduce((s, i) => s + i.subtotal, 0);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.nombre.trim() && form.direccion.trim() && form.metodoPago;

  const handleConfirm = async () => {
    if (!perfil) { showToast("Debes iniciar sesión para hacer un pedido", "err"); return; }
    setLoading(true);
    try {
      const body = {
        codigo: genId(),
        nombre: form.nombre,
        alias: form.alias,
        direccion: form.direccion,
        metodoPago: form.metodoPago,
        nota: form.nota,
        estado: "Pendiente",
        perfil: { id: perfil.id },
        items: cart.map(i => ({
          nombre: i.nombre,
          precioUnit: i.precio,
          cantidadKg: i.weight,
          subtotal: i.subtotal,
          producto: { id: i.id },
        })),
      };
      await post("/pedidos", body);
      setLoading(false);
      onSuccess();
    } catch (e) {
      showToast("Error al guardar el pedido", "err");
      setLoading(false);
    }
  };

  return (
    <div className="modal-bg"><div className="modal">
      <div className="modal-title">Confirmar pedido</div>
      <p className="modal-sub">Completa tus datos para finalizar la compra</p>
      <div className="form-row">
        <div className="fg"><label className="label">Nombre *</label><input className="input" placeholder="Tu nombre" value={form.nombre} onChange={e => set("nombre", e.target.value)} /></div>
        <div className="fg"><label className="label">Apodo</label><input className="input" placeholder="Opcional" value={form.alias} onChange={e => set("alias", e.target.value)} /></div>
      </div>
      <div className="fg"><label className="label">Dirección *</label><input className="input" placeholder="Calle, barrio, referencia..." value={form.direccion} onChange={e => set("direccion", e.target.value)} /></div>
      <div className="fg"><label className="label">Nota especial</label><textarea className="textarea" placeholder="Ej. Sin cabeza, entrega después de las 3pm..." value={form.nota} onChange={e => set("nota", e.target.value)} /></div>
      <div className="fg">
        <label className="label">Método de pago *</label>
        <div className="pay-grid">
          {PAYMENT_METHODS.map(m => (
            <div key={m} className={`pay-opt ${form.metodoPago === m ? "on" : ""}`} onClick={() => set("metodoPago", m)}>
              {m === "Efectivo" && "💵 "}{m === "Nequi" && "💜 "}{m === "Daviplata" && "🔴 "}{m === "Transferencia Bancaria" && "🏦 "}{m}
            </div>
          ))}
        </div>
      </div>
      <div className="summary">
        <div className="sum-title">Resumen del pedido</div>
        {cart.map(i => (
          <div key={i.cartId} className="sum-item">
            <span>{i.nombre} {i.weight < 1 ? `${i.weight * 1000}g` : `${i.weight}kg`}</span>
            <span>{cop(i.subtotal)}</span>
          </div>
        ))}
        <div className="sum-total"><span>Total a pagar</span><span>{cop(total)}</span></div>
      </div>
      <button className="btn-confirm" disabled={!valid || loading} onClick={handleConfirm}>
        {loading ? "⏳ Procesando..." : `✅ Confirmar pedido · ${cop(total)}`}
      </button>
      <button className="btn-ghost" onClick={onClose}>Cancelar</button>
    </div></div>
  );
}

// ─── AUTH MODAL ─────────────────────────────────────────────
// Login: busca perfil por nombre en GET /api/perfiles y valida password guardado
// Registro: POST /api/perfiles
function AuthModal({ onLogin, onClose, showToast }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ nombre:"", password:"", direccion:"", metodoPago:"", alias:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // NOTA: el backend no tiene auth real — usamos localStorage para simular sesión
  // y buscamos el perfil por nombre. Para producción se debe agregar JWT.
  const handleLogin = async () => {
    setError(""); setLoading(true);
    try {
      const perfiles = await get("/perfiles");
      const found = perfiles.find(p => p.nombre?.toLowerCase() === form.nombre.toLowerCase().trim());
      if (!found) { setError("Usuario no encontrado."); setLoading(false); return; }
      localStorage.setItem("dimarpez_perfil", JSON.stringify(found));
      onLogin(found);
    } catch {
      setError("Error al conectar con el servidor.");
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    setError(""); setLoading(true);
    if (!form.nombre.trim()) { setError("El nombre es obligatorio."); setLoading(false); return; }
    try {
      const nuevo = await post("/perfiles", {
        nombre: form.nombre,
        alias: form.alias,
        direccion: form.direccion,
        metodoPago: form.metodoPago,
        rol: "cliente",
      });
      localStorage.setItem("dimarpez_perfil", JSON.stringify(nuevo));
      onLogin(nuevo);
    } catch {
      setError("Error al crear la cuenta.");
    }
    setLoading(false);
  };

  return (
    <div className="modal-bg"><div className="modal">
      <div className="modal-title">{tab === "login" ? "Bienvenido de nuevo" : "Crear cuenta"}</div>
      <p className="modal-sub">{tab === "login" ? "Ingresa para ver tus pedidos y guardar tu información." : "Regístrate para una experiencia más rápida."}</p>
      <div className="auth-tabs">
        <button className={`auth-tab ${tab === "login" ? "on" : ""}`} onClick={() => { setTab("login"); setError(""); }}>Iniciar sesión</button>
        <button className={`auth-tab ${tab === "register" ? "on" : ""}`} onClick={() => { setTab("register"); setError(""); }}>Registrarse</button>
      </div>
      <div className="fg"><label className="label">Nombre completo *</label><input className="input" placeholder="Tu nombre" value={form.nombre} onChange={e => set("nombre", e.target.value)} /></div>
      {tab === "register" && <>
        <div className="fg"><label className="label">Apodo</label><input className="input" placeholder="Opcional" value={form.alias} onChange={e => set("alias", e.target.value)} /></div>
        <div className="fg"><label className="label">Dirección habitual</label><input className="input" placeholder="Opcional" value={form.direccion} onChange={e => set("direccion", e.target.value)} /></div>
        <div className="fg">
          <label className="label">Método de pago preferido</label>
          <select className="fselect" value={form.metodoPago} onChange={e => set("metodoPago", e.target.value)}>
            <option value="">Seleccionar...</option>
            {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </>}
      {error && <div className="ferror">⚠️ {error}</div>}
      <button className="btn-full" disabled={loading} onClick={tab === "login" ? handleLogin : handleRegister}>
        {loading ? "⏳ Cargando..." : tab === "login" ? "Ingresar" : "Crear cuenta"}
      </button>
      <button className="btn-ghost" onClick={onClose}>Cancelar</button>
    </div></div>
  );
}

// ─── ADMIN PANEL ────────────────────────────────────────────
function AdminPanel({ showToast }) {
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [edits, setEdits] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [newP, setNewP] = useState(EMPTY_PRODUCT);
  const [addErr, setAddErr] = useState("");

  useEffect(() => { fetchData(); }, [tab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (tab === "orders") {
        const data = await get("/pedidos");
        setOrders(data || []);
      } else {
        const data = await get("/producto");
        setProducts(data || []);
      }
    } catch { showToast("Error al cargar datos", "err"); }
    setLoading(false);
  };

  const setE = (id, k, v) => setEdits(p => ({ ...p, [id]: { ...p[id], [k]: v } }));
  const getE = (id, k, def) => edits[id]?.[k] ?? def;
  const setNP = (k, v) => setNewP(p => ({ ...p, [k]: v }));

  const updateStatus = async (id, estado) => {
    const order = orders.find(o => o.id === id);
    await put(`/pedidos/${id}`, { ...order, estado });
    setOrders(p => p.map(o => o.id === id ? { ...o, estado } : o));
  };

  const saveProduct = async (id) => {
    const p = products.find(x => x.id === id);
    const e = edits[id] || {};
    const updated = {
      ...p,
      precio: e.precio !== undefined ? +e.precio : p.precio,
      stock: e.stock !== undefined ? +e.stock : p.stock,
      descripcion: e.descripcion !== undefined ? e.descripcion : p.descripcion,
    };
    await put(`/producto/${id}`, updated);
    setProducts(prev => prev.map(x => x.id === id ? updated : x));
    setEdits(prev => { const n = { ...prev }; delete n[id]; return n; });
    showToast("✓ Guardado");
  };

  const toggleActive = async (id, cur) => {
    const p = products.find(x => x.id === id);
    const updated = { ...p, activo: cur === "true" ? "false" : "true" };
    await put(`/producto/${id}`, updated);
    setProducts(prev => prev.map(x => x.id === id ? updated : x));
  };

  const addProduct = async () => {
    setAddErr("");
    if (!newP.nombre?.trim()) { setAddErr("Nombre obligatorio."); return; }
    if (!newP.categoria?.trim()) { setAddErr("Categoría obligatoria."); return; }
    if (!newP.precio || +newP.precio <= 0) { setAddErr("Precio inválido."); return; }
    try {
      const data = await post("/producto", { ...newP, precio: +newP.precio, stock: +newP.stock || 0, activo: "true" });
      setProducts(p => [...p, data]);
      setNewP(EMPTY_PRODUCT); setShowAdd(false);
      showToast("✓ Producto agregado");
    } catch { setAddErr("Error al guardar."); }
  };

  const categories = [...new Set(products.map(p => p.categoria))];
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.estado === "Pendiente").length,
    active: orders.filter(o => ["Confirmado","En camino"].includes(o.estado)).length,
    revenue: orders.filter(o => o.estado === "Entregado").reduce((s, o) => s + Number(o.total), 0),
  };

  return (
    <div className="admin">
      <h2 className="page-title">Panel de administración</h2>
      <div className="stats">
        {[{icon:"📦",val:stats.total,label:"Pedidos totales"},{icon:"⏳",val:stats.pending,label:"Pendientes"},{icon:"🚚",val:stats.active,label:"En proceso"},{icon:"💰",val:cop(stats.revenue),label:"Ingresos entregados"}].map(s => (
          <div key={s.label} className="stat"><span style={{fontSize:"1.3rem"}}>{s.icon}</span><div className="stat-val">{s.val}</div><div className="stat-label">{s.label}</div></div>
        ))}
      </div>
      <div className="tabs">
        <button className={`tab ${tab==="orders"?"on":""}`} onClick={() => setTab("orders")}>Pedidos</button>
        <button className={`tab ${tab==="inventory"?"on":""}`} onClick={() => setTab("inventory")}>Inventario</button>
      </div>
      {loading && <div className="loading"><div className="spin" /> Cargando...</div>}
      {!loading && tab === "orders" && (
        <div className="orders">
          {orders.length === 0 && <p style={{color:"var(--muted)"}}>No hay pedidos aún.</p>}
          {orders.map(o => (
            <div key={o.id} className="ocard">
              <div className="ocard-top">
                <div><div className="ocode">{o.codigo}</div><div className="otime">{o.creadoEn ? new Date(o.creadoEn).toLocaleString("es-CO",{dateStyle:"short",timeStyle:"short"}) : "—"}</div></div>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <span className="sbadge" style={{background:STATUS_COLORS[o.estado]+"22",color:STATUS_COLORS[o.estado]}}>{o.estado}</span>
                  <select className="ssel" value={o.estado} onChange={e => updateStatus(o.id, e.target.value)}>
                    {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="oinfo">
                <div><strong>{o.nombre}{o.alias?` (${o.alias})`:""}</strong>Cliente</div>
                <div><strong>{o.direccion}</strong>Dirección</div>
                <div><strong>{o.metodoPago}</strong>Pago</div>
                {o.nota && <div><strong>{o.nota}</strong>Nota</div>}
              </div>
              <div className="oitems">
                {(o.items||[]).map((i,idx) => <div key={idx}>• {i.nombre} ({Number(i.cantidadKg)<1?`${Number(i.cantidadKg)*1000}g`:`${i.cantidadKg}kg`}) = {cop(i.subtotal)}</div>)}
              </div>
              <div className="ototal">Total: {cop(o.total)}</div>
            </div>
          ))}
        </div>
      )}
      {!loading && tab === "inventory" && (
        <>
          {!showAdd
            ? <button className="btn-primary" style={{marginBottom:20}} onClick={() => setShowAdd(true)}>+ Agregar producto</button>
            : <div className="add-form">
                <h3>Nuevo producto</h3>
                <div className="add-grid">
                  <div className="fg"><label className="label">Emoji</label><input className="input" value={newP.emoji} onChange={e => setNP("emoji",e.target.value)} maxLength={4} /></div>
                  <div className="fg"><label className="label">Nombre *</label><input className="input" value={newP.nombre} onChange={e => setNP("nombre",e.target.value)} placeholder="Ej. Tilapia" /></div>
                  <div className="fg"><label className="label">Categoría *</label><input className="input" value={newP.categoria} onChange={e => setNP("categoria",e.target.value)} list="cats" /><datalist id="cats">{categories.map(c => <option key={c} value={c}/>)}</datalist></div>
                  <div className="fg"><label className="label">Unidad</label><select className="fselect" value={newP.unidad} onChange={e => setNP("unidad",e.target.value)}><option value="kg">kg</option><option value="lb">lb</option><option value="unidad">unidad</option></select></div>
                  <div className="fg"><label className="label">Precio COP *</label><input className="input" type="number" value={newP.precio} onChange={e => setNP("precio",e.target.value)} placeholder="25000" /></div>
                  <div className="fg"><label className="label">Stock *</label><input className="input" type="number" value={newP.stock} onChange={e => setNP("stock",e.target.value)} placeholder="50" /></div>
                  <div className="fg add-full"><label className="label">Descripción</label><textarea className="textarea" style={{minHeight:56}} value={newP.descripcion} onChange={e => setNP("descripcion",e.target.value)} /></div>
                </div>
                {addErr && <div className="ferror" style={{marginBottom:10}}>⚠️ {addErr}</div>}
                <div style={{display:"flex",gap:10}}>
                  <button className="save-btn" onClick={addProduct}>Guardar</button>
                  <button className="btn-ghost" style={{width:"auto",margin:0,padding:"7px 14px",fontSize:"0.8rem"}} onClick={() => {setShowAdd(false);setAddErr("");setNewP(EMPTY_PRODUCT);}}>Cancelar</button>
                </div>
              </div>
          }
          <div className="inv-grid">
            {products.map(p => (
              <div key={p.id} className="icard">
                <div className="icard-top">
                  <span>{p.emoji} <span className="iname">{p.nombre}</span></span>
                  <button className={`itoggle ${p.activo==="true"?"on":"off"}`} onClick={() => toggleActive(p.id, p.activo)}>{p.activo==="true"?"Activo":"Oculto"}</button>
                </div>
                <div className="ifields">
                  <div className="ifield"><label>Precio</label><input className="iinput" type="number" value={getE(p.id,"precio",p.precio)} onChange={e => setE(p.id,"precio",e.target.value)} /></div>
                  <div className="ifield"><label>Stock</label><input className="iinput" type="number" value={getE(p.id,"stock",p.stock)} onChange={e => setE(p.id,"stock",e.target.value)} /></div>
                  <div className="ifield" style={{alignItems:"flex-start"}}><label style={{paddingTop:4}}>Desc.</label><textarea className="iinput" style={{minHeight:48,resize:"vertical"}} value={getE(p.id,"descripcion",p.descripcion)} onChange={e => setE(p.id,"descripcion",e.target.value)} /></div>
                </div>
                {edits[p.id] && <button className="save-btn" onClick={() => saveProduct(p.id)}>💾 Guardar</button>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── USER PROFILE ───────────────────────────────────────────
function UserProfile({ perfil, setPerfil, onLogout, showToast }) {
  const [form, setForm] = useState({ nombre:perfil?.nombre||"", direccion:perfil?.direccion||"", alias:perfil?.alias||"", metodoPago:perfil?.metodoPago||"" });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    get("/pedidos")
      .then(data => setOrders((data||[]).filter(o => o.perfil?.id === perfil?.id)))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await put(`/perfiles/${perfil.id}`, { ...perfil, ...form });
      setPerfil(updated);
      localStorage.setItem("dimarpez_perfil", JSON.stringify(updated));
      showToast("✓ Perfil actualizado");
    } catch { showToast("Error al guardar", "err"); }
    setSaving(false);
  };

  return (
    <div className="profile">
      <h2 className="page-title">Mi perfil</h2>
      <div className="psec">
        <h3>Datos personales</h3>
        <div className="fg"><label className="label">Nombre</label><input className="input" value={form.nombre} onChange={e => set("nombre",e.target.value)} /></div>
        <div className="fg"><label className="label">Dirección habitual</label><input className="input" placeholder="Tu dirección" value={form.direccion} onChange={e => set("direccion",e.target.value)} /></div>
        <div className="fg"><label className="label">Apodo</label><input className="input" placeholder="Opcional" value={form.alias} onChange={e => set("alias",e.target.value)} /></div>
        <div className="fg">
          <label className="label">Método de pago preferido</label>
          <select className="fselect" value={form.metodoPago} onChange={e => set("metodoPago",e.target.value)}>
            <option value="">Seleccionar...</option>
            {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div style={{display:"flex",gap:10,marginTop:4}}>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving?"Guardando...":"Guardar cambios"}</button>
          <button className="btn-outline" onClick={onLogout}>Cerrar sesión</button>
        </div>
      </div>
      <div className="psec">
        <h3>Historial de pedidos ({orders.length})</h3>
        {loading ? <div className="loading"><div className="spin" /></div>
          : orders.length === 0 ? <p style={{color:"var(--muted)",fontSize:"0.85rem",fontWeight:500}}>Aún no tienes pedidos registrados.</p>
          : orders.map(o => (
            <div key={o.id} className="hist">
              <div className="hist-top">
                <span>{o.codigo} · {cop(o.total)}</span>
                <span className="sbadge" style={{background:STATUS_COLORS[o.estado]+"22",color:STATUS_COLORS[o.estado],borderRadius:"50px",padding:"2px 10px",fontSize:"0.72rem"}}>{o.estado}</span>
              </div>
              <div className="hist-sub">
                {o.creadoEn ? new Date(o.creadoEn).toLocaleString("es-CO",{dateStyle:"short",timeStyle:"short"}) : "—"} · {o.direccion}<br/>
                {(o.items||[]).map(i => `${i.nombre} ${Number(i.cantidadKg)<1?Number(i.cantidadKg)*1000+"g":i.cantidadKg+"kg"}`).join(", ")}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ─── APP ────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]         = useState("home");
  const [products, setProducts] = useState([]);
  const [cart, setCart]         = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [perfil, setPerfil]     = useState(() => {
    try { return JSON.parse(localStorage.getItem("dimarpez_perfil")); } catch { return null; }
  });
  const [success, setSuccess]   = useState(false);
  const [toast, setToast]       = useState(null);
  const [toastType, setToastType] = useState("ok");
  const [loadingP, setLoadingP] = useState(true);
  const [filter, setFilter]     = useState("Todos");
  const [scrolled, setScrolled] = useState(false);

  const showToast = (msg, type="ok") => { setToast(msg); setToastType(type); setTimeout(() => setToast(null), 2500); };

  useEffect(() => {
    // Cargar productos desde Spring Boot
    get("/producto")
      .then(data => setProducts((data||[]).filter(p => p.activo === "true")))
      .catch(() => showToast("No se pudo conectar al servidor", "err"))
      .finally(() => setLoadingP(false));

    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogin = (p) => { setPerfil(p); setAuthOpen(false); if (p.rol === "admin") setPage("admin"); showToast(`👋 Bienvenido, ${p.nombre?.split(" ")[0]}`); };
  const handleLogout = () => { setPerfil(null); localStorage.removeItem("dimarpez_perfil"); setPage("home"); showToast("Sesión cerrada"); };
  const addToCart = (product, weight) => { setCart(p => [...p, { ...product, weight, subtotal: product.precio * weight, cartId: Date.now() + Math.random() }]); showToast(`✓ ${product.nombre} agregado`); };

  const isAdmin    = perfil?.rol === "admin";
  const categories = ["Todos", ...new Set(products.map(p => p.categoria))];
  const filtered   = filter === "Todos" ? products : products.filter(p => p.categoria === filter);

  if (success) return (
    <><style>{css}</style>
    <div className="success">
      <div className="success-icon">🎉</div>
      <h2>¡Pedido confirmado!</h2>
      <p>Tu pedido fue registrado exitosamente. El equipo de Dimarpez te contactará pronto para confirmar la entrega.</p>
      <button className="btn-primary" style={{marginTop:28}} onClick={() => setSuccess(false)}>Hacer otro pedido</button>
    </div></>
  );

  return (
    <><style>{css}</style>
    <div>
      <nav className={`nav ${scrolled?"scrolled":""}`}>
        <div className="logo" onClick={() => setPage("home")}>🐟 dimar<span>pez</span></div>
        <div className="nav-links">
          <button className={`nav-link ${page==="home"?"active":""}`} onClick={() => setPage("home")}>Inicio</button>
          <button className={`nav-link ${page==="catalog"?"active":""}`} onClick={() => setPage("catalog")}>Catálogo</button>
          {isAdmin && <button className={`nav-link ${page==="admin"?"active":""}`} onClick={() => setPage("admin")}>Administración</button>}
        </div>
        <div className="nav-right">
          {perfil
            ? <UserDropdown perfil={perfil} onNavigate={setPage} onLogout={handleLogout} />
            : <button className="user-btn" onClick={() => setAuthOpen(true)}>Ingresar</button>
          }
          <button className="cart-btn" onClick={() => setCartOpen(true)}>
            🛒 Carrito {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
          </button>
        </div>
      </nav>

      {page === "home" && <>
        <div className="hero">
          <div className="hero-pattern" />
          <div className="blob blob1" /><div className="blob blob2" />
          <div className="hero-badge"><span className="badge-dot" />Frescos del día · Cúcuta y alrededores</div>
          <h1>Lo mejor del <em>mar</em><br />directo a tu <strong>mesa</strong></h1>
          <p className="hero-sub">Mariscos y pescados frescos al por mayor y detal. Pedidos a domicilio rápidos, confiables y sin complicaciones.</p>
          <div className="hero-cta">
            <button className="btn-primary" onClick={() => setPage("catalog")}>Ver catálogo →</button>
            <button className="btn-outline" onClick={() => window.open("https://wa.me/573028561215","_blank")}>💬 WhatsApp</button>
          </div>
          <div className="hero-stats">
            <div className="hstat"><div className="hstat-val">+500</div><div className="hstat-label">Clientes satisfechos</div></div>
            <div className="hstat"><div className="hstat-val">10+</div><div className="hstat-label">Productos frescos</div></div>
            <div className="hstat"><div className="hstat-val">6 AM</div><div className="hstat-label">Atención desde</div></div>
            <div className="hstat"><div className="hstat-val">$0</div><div className="hstat-label">Domicilio +$50k</div></div>
          </div>
        </div>

        <div className="info-section">
          <div className="info-grid">
            {[
              {icon:"🕐",title:"Horario de atención",text:<>Lunes a Sábado <strong>6:00 AM – 6:00 PM</strong><br/>Domingos <strong>7:00 AM – 2:00 PM</strong></>},
              {icon:"📍",title:"Zona de cobertura",text:<>Cúcuta, Los Patios, Villa del Rosario, El Zulia y municipios cercanos.</>},
              {icon:"🚚",title:"Domicilio gratis",text:<>En pedidos mayores a <strong>$50.000</strong>. Pedidos menores, consultamos el envío.</>},
              {icon:"📞",title:"Contáctanos",text:<>WhatsApp <strong>+57 302 856 1215</strong> — respondemos en minutos.</>},
            ].map(r => (
              <div key={r.title} className="info-card">
                <div className="info-icon">{r.icon}</div>
                <div className="info-title">{r.title}</div>
                <div className="info-text">{r.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="divider" />

        <div className="catalog">
          <div className="section-title">Productos <span>destacados</span></div>
          {loadingP ? <div className="loading"><div className="spin" /> Cargando productos...</div>
            : <div className="grid">{products.slice(0,4).map(p => <ProductCard key={p.id} product={p} onAdd={addToCart} />)}</div>}
          <div style={{textAlign:"center",marginTop:28}}>
            <button className="btn-primary" onClick={() => setPage("catalog")}>Ver todos los productos →</button>
          </div>
        </div>

        <footer className="footer">
          <strong>Dimarpez</strong> — Mariscos y pescados frescos · Cúcuta, Norte de Santander<br/>
          <span style={{marginTop:4,display:"block"}}>© 2025 Todos los derechos reservados</span>
        </footer>
      </>}

      {page === "catalog" && (
        <div className="catalog">
          <div className="section-title" style={{marginBottom:20}}>Nuestro <span>catálogo</span></div>
          <div className="filters">
            {categories.map(c => <button key={c} className={`filter ${filter===c?"on":""}`} onClick={() => setFilter(c)}>{c}</button>)}
          </div>
          {loadingP ? <div className="loading"><div className="spin" /> Cargando...</div>
            : <div className="grid">{filtered.map(p => <ProductCard key={p.id} product={p} onAdd={addToCart} />)}</div>}
        </div>
      )}

      {page === "admin" && isAdmin && <AdminPanel showToast={showToast} />}

      {(page==="profile"||page==="orders"||page==="settings") && perfil && !isAdmin && (
        <UserProfile perfil={perfil} setPerfil={setPerfil} onLogout={handleLogout} showToast={showToast} />
      )}

      {cartOpen && <CartPanel cart={cart} onClose={() => setCartOpen(false)} onRemove={id => setCart(p => p.filter(i => i.cartId!==id))} onCheckout={() => { setCartOpen(false); setCheckout(true); }} />}
      {checkout && <CheckoutModal cart={cart} perfil={perfil} onClose={() => setCheckout(false)} onSuccess={() => { setCheckout(false); setCartOpen(false); setCart([]); setSuccess(true); }} showToast={showToast} />}
      {authOpen && <AuthModal onLogin={handleLogin} onClose={() => setAuthOpen(false)} showToast={showToast} />}

      <Toast msg={toast} type={toastType} />
    </div></>
  );
}
