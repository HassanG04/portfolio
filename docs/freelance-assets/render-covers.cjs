// Original vector diagrams for portfolio listings; not application screenshots.
// Export to PNG with the bundled sharp installation (pass its module path).
const fs = require('node:fs');
const path = require('node:path');
const sharp = require(process.argv[2] || 'sharp');
const projects = [
  {
    file: 'hotel-api', title: 'Hotel Cancellation', subtitle: 'Validated prediction API',
    accent: '#b89afa', tech: 'Python / FastAPI / XGBoost / PostgreSQL',
    nodes: [['01', 'Validate', 'Booking features'], ['02', 'Predict', 'Native XGBoost model'], ['03', 'Trace', 'PostgreSQL lineage']],
    notes: ['Schema validation', 'Versioned model artifacts', 'Docker + integration tests'],
    footer: 'Portfolio implementation · system architecture'
  },
  {
    file: 'supermarket-etl', title: 'Supermarket ETL', subtitle: 'From raw records to trusted outputs',
    accent: '#63d5b3', tech: 'Python / pandas / CLI / Automated tests',
    nodes: [['01', 'Inspect', 'Validate + normalize'], ['02', 'Reconcile', 'Check financial totals'], ['03', 'Export', 'Clean / reject outputs']],
    notes: ['Explicit data-quality rules', 'Reviewable rejected rows', 'Quality + business summaries'],
    footer: 'Training-data project · pipeline architecture'
  }
];
async function main() {
  for (const p of projects) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900" viewBox="0 0 1400 900">
      <defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#171026"/><stop offset="1" stop-color="#0c111c"/></linearGradient></defs>
      <rect width="1400" height="900" rx="0" fill="url(#bg)"/>
      <rect x="64" y="72" width="46" height="5" rx="2" fill="${p.accent}"/>
      <g font-family="Segoe UI,Arial,sans-serif" fill="#faf8ff">
        <text x="128" y="83" font-size="21" letter-spacing="3" fill="${p.accent}">HASSAN GEBRIL / SELECTED WORK</text>
        <text x="64" y="195" font-size="76" font-weight="700">${p.title}</text>
        <text x="68" y="249" font-size="32" fill="#c4bdcf">${p.subtitle}</text>
        <text x="68" y="312" font-size="24" fill="${p.accent}">${p.tech}</text>
        ${p.nodes.map((n,i)=>{
          const x=64+i*438;
          return `<rect x="${x}" y="396" width="394" height="224" rx="24" fill="#211c30" stroke="${p.accent}" stroke-opacity=".4"/>
          <text x="${x+30}" y="443" font-size="20" fill="${p.accent}">${n[0]}</text>
          <text x="${x+30}" y="505" font-size="36" font-weight="600">${n[1]}</text>
          <text x="${x+30}" y="557" font-size="23" fill="#c4bdcf">${n[2]}</text>
          ${i<2?`<path d="M${x+407} 506h18m-7-7 7 7-7 7" stroke="${p.accent}" stroke-width="3" fill="none"/>`:''}`;
        }).join('')}
        ${p.notes.map((n,i)=>`<circle cx="76" cy="${680+i*42}" r="4" fill="${p.accent}"/><text x="94" y="${688+i*42}" font-size="24" fill="#d1cbdc">${n}</text>`).join('')}
        <path d="M64 804h1272" stroke="#393141"/>
        <text x="64" y="848" font-size="20" fill="#ada4ba">${p.footer}</text>
      </g>
    </svg>`;
    fs.writeFileSync(path.join(__dirname, p.file + '.svg'), svg);
    await sharp(Buffer.from(svg)).png().toFile(path.join(__dirname, p.file + '.png'));
  }
}
main().catch(error => { console.error(error); process.exitCode=1; });
