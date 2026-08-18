const app = require('./src/app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
🌸 CycleCare Backend Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Running on: http://localhost:${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});
