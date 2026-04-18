const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
  const logDir = path.resolve(process.env.LOG_DIR || './logs');
  const dateStr = new Date().toISOString().split('T')[0];
  const logFile = path.join(logDir, `omniguard-combined-${dateStr}.log`);

  if (!fs.existsSync(logFile)) {
    return res.status(404).json({ error: 'Log file not found', path: logFile });
  }

  try {
    const content = fs.readFileSync(logFile, 'utf8');
    const lines = content.split('\n').filter(Boolean).slice(-100).reverse();
    res.json({ logs: lines });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
