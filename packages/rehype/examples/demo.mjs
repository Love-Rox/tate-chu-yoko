/**
 * Run from packages/rehype after `pnpm --filter @love-rox/tcy-rehype build`:
 *
 *   node examples/demo.mjs
 */
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import rehypeTcy from '../dist/rehype-tcy.js';

const samples = [
  ['default', '<p>第1章 2026年4月、Webの縦書きは進化した。</p>'],
  ['skips <code>', '<p>第1章</p><pre><code>const x = 123;</code></pre>'],
  ['nested elements', '<p>前<strong>ABC123</strong>後</p>'],
];

const make = (options) =>
  unified().use(rehypeParse, { fragment: true }).use(rehypeTcy, options).use(rehypeStringify);

console.log('--- default ---');
for (const [label, html] of samples) {
  const out = String(await make().process(html));
  console.log(`[${label}]\n  in : ${html}\n  out: ${out}\n`);
}

console.log('--- excludeWords: ["2026"] ---');
console.log(String(await make({ excludeWords: ['2026'] }).process('<p>第1章 2026年4月</p>')));

console.log('\n--- custom tagName / className ---');
console.log(
  String(await make({ tagName: 'b', className: ['tcy', 'mark'] }).process('<p>AB12</p>')),
);
