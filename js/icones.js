// Ícones (SVG), logo, cores das matérias e funções de texto
const COR={portugues:'#2563eb',matematica:'#059669',fisica:'#7c3aed',ingles:'#d97706'};
const P={
portugues:'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
matematica:'<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M8 6h8M16 14v4M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01"/>',
fisica:'<circle cx="12" cy="12" r="1"/><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z"/><path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"/>',
ingles:'<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/>',
check:'<path d="M20 6 9 17l-5-5"/>',x:'<path d="M18 6 6 18M6 6l12 12"/>',
star:'<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3L8 14.2 3 9.3l6.9-1z"/>'};
const svg=(p,s=20)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const DIF={facil:'Fácil',medio:'Médio',dificil:'Difícil'};

Object.assign(P,{book:'<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',chart:'<path d="M3 3v18h18M7 16v-4M12 16V8M17 16v-7"/>',moon:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',plane:'<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',trophy:'<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.7V17c0 .6-.5 1-1.2 1.2C7.9 18.8 7 20.2 7 22M14 14.7V17c0 .6.5 1 1.2 1.2 1 .6 1.8 2 1.8 3.8M18 2H6v7a6 6 0 0 0 12 0Z"/>',shield:'<path d="M20 13c0 5-3.5 7.5-7.7 8.9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/>',out:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>'});
document.querySelectorAll('[data-i]').forEach(e=>e.outerHTML=`<span aria-hidden="true" style="display:flex">${svg(P[e.dataset.i],+e.dataset.s||20)}</span>`);
const LOGO="<span class=\"lg\"><img src=\"img/logo.png\" alt=\"\" onerror=\"this.remove()\"><svg class=\"fb\" viewBox=\"0 0 64 64\" aria-hidden=\"true\"><circle cx=\"32\" cy=\"32\" r=\"30\" fill=\"#0b1f3a\" stroke=\"#c9a227\" stroke-width=\"2.5\"/><text x=\"32\" y=\"44\" font-size=\"34\" font-weight=\"700\" text-anchor=\"middle\" fill=\"#c9a227\" font-family=\"Barlow Condensed,Inter,sans-serif\">M</text></svg></span>";
