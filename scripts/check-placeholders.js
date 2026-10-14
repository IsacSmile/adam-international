import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'src', 'data');

console.log('--- Checking src/data/ for Placeholders and [CONFIRM] Items ---\n');

let totalPlaceholders = 0;
let totalConfirms = 0;

const files = fs.readdirSync(dataDir).filter((f) => f.endsWith('.js'));

for (const file of files) {
  const filePath = path.join(dataDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  console.log(`📁 File: src/data/${file}`);

  // Find [CONFIRM] items
  const lines = content.split('\n');
  const confirmLines = [];
  lines.forEach((line, idx) => {
    if (line.includes('CONFIRM') || line.includes('[CONFIRM]')) {
      confirmLines.push({ line: idx + 1, text: line.trim() });
    }
  });

  if (confirmLines.length > 0) {
    console.log(`  ⚠️  [CONFIRM WITH CLIENT] items (${confirmLines.length}):`);
    confirmLines.forEach((c) => {
      console.log(`    Line ${c.line}: ${c.text}`);
    });
    totalConfirms += confirmLines.length;
  } else {
    console.log('  ✓ No [CONFIRM] items found.');
  }

  // Count placeholders
  const placeholderMatches = content.match(/isPlaceholder:\s*true/g) || [];
  if (placeholderMatches.length > 0) {
    console.log(`  ⚠️  Placeholder records (${placeholderMatches.length} items flagged with isPlaceholder: true)`);
    totalPlaceholders += placeholderMatches.length;
  } else {
    console.log('  ✓ No placeholder records found.');
  }

  console.log('');
}

console.log('---------------------------------------------------------------');
console.log(`Total [CONFIRM WITH CLIENT] items found: ${totalConfirms}`);
console.log(`Total placeholder records flagged: ${totalPlaceholders}`);
console.log('---------------------------------------------------------------\n');
