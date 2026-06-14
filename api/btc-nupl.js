const GLASSNODE_NUPL_URL = "https://api.glassnode.com/v1/metrics/indicators/net_unrealized_profit_loss";
const CACHE_MS = 6 * 60 * 60 * 1000;

let cache = {
  expiresAt: 0,
  payload: null
};

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=21600, stale-while-revalidate=3600");
  res.end(JSON.stringify(payload));
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    sendJson(res, 405, { ok: false, error: "method_not_allowed" });
    return;
  }

  const apiKey = process.env.GLASSNODE_API_KEY;
  if (!apiKey) {
    sendJson(res, 200, { ok: false, error: "api_key_not_configured" });
    return;
  }

  const now = Date.now();
  if (cache.payload && cache.expiresAt > now) {
    sendJson(res, 200, { ...cache.payload, cached: true });
    return;
  }

  try {
    const end = Math.floor(now / 1000);
    const start = end - 14 * 24 * 60 * 60;
    const url = new URL(GLASSNODE_NUPL_URL);
    url.searchParams.set("a", "BTC");
    url.searchParams.set("i", "24h");
    url.searchParams.set("s", String(start));
    url.searchParams.set("u", String(end));
    url.searchParams.set("api_key", apiKey);

    const response = await fetch(url, { headers: { Accept: "application/json" } });
    if (!response.ok) {
      throw new Error(`glassnode_http_${response.status}`);
    }

    const data = await response.json();
    const latest = Array.isArray(data)
      ? data.filter((item) => Number.isFinite(Number(item?.v))).at(-1)
      : null;

    if (!latest) {
      throw new Error("glassnode_empty_response");
    }

    const payload = {
      ok: true,
      asset: "BTC",
      interval: "24h",
      value: Number(latest.v),
      timestamp: Number(latest.t) * 1000,
      fetchedAt: new Date(now).toISOString(),
      cached: false
    };

    cache = {
      expiresAt: now + CACHE_MS,
      payload
    };

    sendJson(res, 200, payload);
  } catch {
    sendJson(res, 200, { ok: false, error: "nupl_unavailable" });
  }
};
