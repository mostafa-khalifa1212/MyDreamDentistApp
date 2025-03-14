// server/services/backupService.js
const { exec } = require('child_process');
const createError = require('http-errors');

exports.backupDatabase = () => {
  return new Promise((resolve, reject) => {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/dream-dentist';
    const backupCommand = `mongodump --uri="${uri}" --out=./backups`;
    
    exec(backupCommand, (error, stdout, stderr) => {
      if (error) {
        return reject(createError(500, 'Backup failed: ' + stderr));
      }
      return resolve(stdout);
    });
  });
};
