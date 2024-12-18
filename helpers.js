const { exec } = require('child_process');

function runMfaScript() {
  return new Promise((resolve, reject) => {
    exec('node mfa.mjs', (error, stdout, stderr) => {
      if (error) {
        reject(`Error executing mfa.mjs: ${error.message}`);
        return;
      }
      if (stderr) {
        reject(`mfa.mjs Error Output: ${stderr}`);
        return;
      }

      const extractedNumbers = stdout.trim();
      resolve(extractedNumbers);
    });
  });
}

module.exports = { runMfaScript };
