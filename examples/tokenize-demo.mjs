import { tokenize } from '../packages/core/dist/index.js';

const sample = '第1章 2026年4月、ABC社のレポートによれば、利用者は10倍に増えた。';

console.log('--- default (alphanumeric, combine:true) ---');
console.log(tokenize(sample));

console.log('\n--- combine:false ---');
console.log(tokenize('ABC-123', { combine: false }));

console.log('\n--- target: digit ---');
console.log(tokenize('abc123', { target: 'digit' }));

console.log('\n--- include: "." ---');
console.log(tokenize('Ver.2', { include: '.' }));
