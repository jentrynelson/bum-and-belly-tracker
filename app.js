:root{
  --bg:#0b1020;
  --card:#111827;
  --text:#e5e7eb;
  --muted:#9ca3af;
  --danger:#ef4444;
  --border:#243043;
}

*{box-sizing:border-box}
body{
  margin:0;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
  background: radial-gradient(1200px 800px at 20% 0%, #111827, var(--bg));
  color:var(--text);
}
.container{max-width:1020px;margin:0 auto;padding:18px}
header.container{padding-top:22px}

.title-row{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
h1{margin:0;font-size:28px}
.subtitle{margin:8px 0 0;color:var(--muted);line-height:1.4}

.card{
  background:rgba(17,24,39,.92);
  border:1px solid var(--border);
  border-radius:14px;
  padding:16px;
  margin:14px 0;
  box-shadow:0 10px 30px rgba(0,0,0,.25);
}

.hero h2{margin:0 0 10px}
.ghostLink{
  display:inline-block;
  padding:10px 12px;
  border:1px solid var(--border);
  border-radius:10px;
  color:var(--text);
  text-decoration:none;
}
.ghostLink:hover{border-color:#3b82f6}

.results-header{display:flex;align-items:baseline;justify-content:space-between;gap:10px}

.row{
  display:grid;
  grid-template-columns: 0.7fr 1fr 0.9fr;
  gap:12px;
  margin-top:12px;
}
@media (max-width: 920px){ .row{grid-template-columns:1fr} }

.grid2{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap:12px;
}
@media (max-width: 920px){ .grid2{grid-template-columns:1fr} }

.panel{
  border:1px solid var(--border);
  border-radius:12px;
  padding:12px;
  background:#0b1226;
}

.field span{display:block;color:var(--muted);font-size:12px;margin-bottom:6px}
input,select,textarea{
  width:100%;
  padding:10px 12px;
  border-radius:10px;
  border:1px solid var(--border);
  background:#0b1226;
  color:var(--text);
  outline:none;
}
input:focus,select:focus,textarea:focus{border-color:#3b82f6}

.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}
button{
  cursor:pointer;
  border:1px solid transparent;
  border-radius:10px;
  padding:10px 12px;
  background:#2563eb;
  color:white;
  font-weight:600;
}
button.ghost{
  background:transparent;
  border-color:var(--border);
  color:var(--text);
}
button.danger{
  background:transparent;
  border-color: rgba(239,68,68,.6);
  color: #fecaca;
}

.muted{color:var(--muted)}
.tiny{font-size:12px}

.results{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}
@media (max-width: 920px){.results{grid-template-columns:1fr}}

.item{
  border:1px solid var(--border);
  border-radius:12px;
  padding:12px;
  background:#0b1226;
}
.item h3{margin:0 0 6px;font-size:16px}
.meta{color:var(--muted);font-size:12px;margin-bottom:8px}

.badge{
  display:inline-block;
  font-size:12px;
  padding:4px 8px;
  border-radius:999px;
  border:1px solid var(--border);
  background:#0f1a33;
  margin-right:6px;
}
.badge.low{
  border-color: rgba(239,68,68,.6);
  background: rgba(239,68,68,.12);
}

.btnrow{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
.item a{color:#93c5fd;text-decoration:none}
.item a:hover{text-decoration:underline}

.chartGrid{display:grid;grid-template-columns: 1fr;gap:14px;}
.chartCard{
  border:1px solid var(--border);
  border-radius:12px;
  padding:12px;
  background:#0b1226;
}
canvas{max-width:100%}

dialog{
  border:1px solid var(--border);
  background:rgba(17,24,39,.98);
  color:var(--text);
  border-radius:14px;
  padding:0;
  width:min(720px, calc(100% - 22px));
}
.modal-header{
  display:flex;align-items:center;justify-content:space-between;
  padding:14px 14px 10px;
  border-bottom:1px solid var(--border);
}
.modal-body{padding:14px}
.footer{opacity:.95}
.fineprint{color:var(--muted);font-size:12px;line-height:1.4}
