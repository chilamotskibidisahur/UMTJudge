const https = require('https');

let updateInterval = null;

const DEFAULT_CONFIG = {
  enabled: true,
  domain: 'chaucaojudge',
  token: '7109e39c-b324-49d1-93db-5d017d418715',
  intervalMinutes: 5
};

/**
 * Send DuckDNS IP update request
 */
function updateDuckDns(config = {}) {
  const domain = config.domain || process.env.DUCKDNS_DOMAIN || DEFAULT_CONFIG.domain;
  const token = config.token || process.env.DUCKDNS_TOKEN || DEFAULT_CONFIG.token;

  if (!domain || !token) {
    console.warn('[DuckDNS] Domain or Token is missing. Skip updating.');
    return Promise.resolve(false);
  }

  const cleanDomain = domain.replace('.duckdns.org', '').trim();
  const url = `https://www.duckdns.org/update?domains=${encodeURIComponent(cleanDomain)}&token=${encodeURIComponent(token)}&ip=`;

  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const text = data.trim();
        if (text === 'OK') {
          console.log(`[DuckDNS] IP updated successfully for ${cleanDomain}.duckdns.org (OK)`);
          resolve(true);
        } else {
          console.warn(`[DuckDNS] Update response: ${text}`);
          resolve(false);
        }
      });
    }).on('error', (err) => {
      console.warn(`[DuckDNS] Network error while updating IP:`, err.message);
      resolve(false);
    });
  });
}

/**
 * Start periodic DuckDNS auto updater
 */
function startAutoUpdate(customConfig = {}) {
  stopAutoUpdate();

  // Run immediately on server start
  updateDuckDns(customConfig).catch(() => {});

  // Run periodically every 5 minutes
  const intervalMs = (customConfig.intervalMinutes || DEFAULT_CONFIG.intervalMinutes) * 60 * 1000;
  updateInterval = setInterval(() => {
    updateDuckDns(customConfig).catch(() => {});
  }, intervalMs);

  if (typeof updateInterval.unref === 'function') {
    updateInterval.unref();
  }
}

/**
 * Stop periodic DuckDNS auto updater
 */
function stopAutoUpdate() {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
}

module.exports = {
  updateDuckDns,
  startAutoUpdate,
  stopAutoUpdate,
  DEFAULT_CONFIG
};
