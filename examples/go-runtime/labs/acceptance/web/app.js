/* Browser evidence is intentionally rendered with textContent, never HTML. */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function jsonRequest(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  return response.json();
}

async function search(mode) {
  let latest = 0;
  let controller;
  const events = [];
  const result = document.querySelector('#search-result');
  async function request(query, delay) {
    const id = ++latest;
    if (mode === 'fixed') controller?.abort();
    controller = new AbortController();
    try {
      const data = await jsonRequest(`/api/search?q=${encodeURIComponent(query)}&delay=${delay}`, {
        signal: controller.signal,
      });
      if (mode === 'broken' || id === latest) {
        result.textContent = data.query;
        events.push(`渲染：${data.query}`);
      }
    } catch (error) {
      if (error.name !== 'AbortError') throw error;
      events.push(`取消：${query}`);
    }
  }
  const old = request('旧关键词', 600);
  const current = sleep(60).then(() => request('新关键词', 0));
  const outcomes = await Promise.allSettled([old, current]);
  const failure = outcomes.find((outcome) => outcome.status === 'rejected');
  if (failure) throw failure.reason;
  return { mode, events, finalQuery: result.textContent, invariantPassed: result.textContent === '新关键词' };
}

async function orders(mode) {
  const key = crypto.randomUUID();
  const headers = { 'Content-Type': 'application/json', 'X-Demo-User': 'alice', 'Idempotency-Key': key };
  const options = { method: 'POST', headers, body: JSON.stringify({ product: '学习笔记' }) };
  const url = `/api/orders?mode=${mode}`;
  const list = () => jsonRequest(`${url}&key=${key}`, { headers });
  const controller = new AbortController();
  // Convert rejection immediately to avoid an unhandled rejection while polling.
  const first = jsonRequest(`${url}&delay=3000`, { ...options, signal: controller.signal })
    .then(() => ({ outcome: '收到响应' }), (error) => ({ error }));
  // Synchronize on the actual side effect; timing alone cannot prove a commit.
  let committed = false;
  try {
    for (let attempt = 0; attempt < 100; attempt++) {
      if ((await list()).count === 1) { committed = true; break; }
      await sleep(10);
    }
  } finally {
    controller.abort();
  }
  const firstResult = await first;
  if (firstResult.error && firstResult.error.name !== 'AbortError') throw firstResult.error;
  const firstOutcome = firstResult.error ? '客户端停止等待' : firstResult.outcome;
  if (!committed) throw new Error('未观察到首次写入，实验不能得出重试结论');
  if (firstOutcome !== '客户端停止等待') throw new Error('首次响应已到达，请重新运行响应丢失实验');
  const retry = await jsonRequest(url, options);
  const state = await list();
  return { mode, key, firstOutcome, retryOrder: retry, ...state, invariantPassed: state.count === 1 };
}

async function auth(mode) {
  const url = `/api/documents/bob-note?mode=${mode}`;
  const alice = await fetch(url, { headers: { 'X-Demo-User': 'alice' } });
  const aliceBody = await alice.text();
  const bob = await fetch(url, { headers: { 'X-Demo-User': 'bob' } });
  const anonymous = await fetch(url);
  return {
    mode, aliceStatus: alice.status, aliceBody, bobStatus: bob.status,
    anonymousStatus: anonymous.status,
    invariantPassed: alice.status === 403 && !aliceBody.includes('Bob 的演示笔记') && bob.status === 200 && anonymous.status === 401,
  };
}

const labs = { search, orders, auth };
document.querySelectorAll('button[data-lab]').forEach((button) => {
  button.addEventListener('click', async () => {
    const { lab, mode } = button.dataset;
    const evidence = document.querySelector(`#${lab}-evidence`);
    const controls = document.querySelectorAll(`#${lab} button`);
    controls.forEach((control) => { control.disabled = true; });
    evidence.textContent = '执行中…';
    try {
      evidence.textContent = JSON.stringify(await labs[lab](mode), null, 2);
    } catch (error) {
      evidence.textContent = `实验执行失败（不是验收通过）：${error.message}`;
    } finally {
      controls.forEach((control) => { control.disabled = false; });
    }
  });
});
