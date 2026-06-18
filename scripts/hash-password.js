// Usage: npm run hash-password -- "your-password-here"
// Copy the printed value into Vercel's ADMIN_PASSWORD_HASH_B64 environment
// variable. The plaintext password itself never needs to be stored
// anywhere in the project files.
//
// This is base64-encoded (not the raw bcrypt hash) because bcrypt hashes
// start with $2a$ or $2b$, and env file loaders treat $ as variable
// expansion syntax, which silently corrupts the value. Base64 sidesteps
// that entirely.

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('Usage: npm run hash-password -- "your-password-here"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
const encoded = Buffer.from(hash, 'utf8').toString('base64');
console.log('\nAdd this as ADMIN_PASSWORD_HASH_B64 in your Vercel project settings:\n');
console.log(encoded);
console.log('');
