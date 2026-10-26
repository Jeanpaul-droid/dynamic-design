import fs from 'node:fs';
import puppeteer from 'puppeteer-core';

const OUT = 'C:/Users/HomePC/AppData/Local/Temp/opencode';
const URL = 'http://localhost:5173/';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const SECTIONS = ['home', 'about', 'expertise', 'projects', 'process', 'testimonials', 'contact'];

const VIEWS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'laptop', width: 1024, height: 768 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];

const report = [];

function log(...args) {
  console.log(...args);
  report.push(args.join(' '));
}

async function newPage(browser, { width, height }, reduced) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([
    { name: 'prefers-reduced-motion', value: reduced ? 'reduce' : 'no-preference' },
  ]);
  page.on('console', (msg) => {
    if (msg.type() === 'error') log(`  [console.error][${width}] ${msg.text()}`);
  });
  page.on('pageerror', (err) => log(`  [pageerror][${width}] ${err.message}`));
  page.on('requestfailed', (req) => {
    const url = req.url();
    if (url.startsWith('http://localhost')) log(`  [requestfailed][${width}] ${url}`);
  });
  return page;
}

async function metrics(page, label) {
  return page.evaluate((tag) => {
    const doc = document.documentElement;
    const ids = ['home', 'about', 'expertise', 'projects', 'process', 'testimonials', 'contact'];
    const missing = ids.filter((id) => !document.getElementById(id));
    const anchors = [...document.querySelectorAll('[data-sculpture-anchor]')].map((el) => {
      const r = el.getBoundingClientRect();
      return { key: el.dataset.sculptureAnchor, w: Math.round(r.width), h: Math.round(r.height) };
    });
    const cardStages = [...document.querySelectorAll('[data-expertise-anchor]')].map((el) => {
      const r = el.getBoundingClientRect();
      return { key: el.dataset.expertiseAnchor, w: Math.round(r.width), h: Math.round(r.height) };
    });
    const canvas = document.querySelector('.scene-layer canvas');
    const overflowing = [...document.querySelectorAll('body *')]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.right > doc.clientWidth + 2 || r.left < -2);
      })
      .slice(0, 8)
      .map((el) => `${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]}`);
    return {
      tag,
      overflowX: doc.scrollWidth - doc.clientWidth,
      missing,
      anchors,
      cardStages,
      processAnchor: !!document.querySelector('[data-process-anchor]'),
      canvas: canvas ? { w: canvas.width, h: canvas.height } : null,
      overflowing,
      scrollHeight: doc.scrollHeight,
    };
  }, label);
}

async function shoot(page, name) {
  await page.screenshot({ path: `${OUT}/${name}.png` });
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--enable-unsafe-swiftshader',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--hide-scrollbars',
    ],
  });

  // ---- reduced motion layout pass -------------------------------------
  for (const view of VIEWS) {
    const page = await newPage(browser, view, true);
    await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 });
    await page.waitForSelector('.scene-layer canvas', { timeout: 20000 }).catch(() => null);
    await new Promise((r) => setTimeout(r, 1800));

    const m = await metrics(page, view.name);
    log(
      `${view.name} ${view.width}x${view.height} -> overflowX=${m.overflowX} scrollH=${m.scrollHeight} canvas=${m.canvas ? `${m.canvas.w}x${m.canvas.h}` : 'none'}`,
    );
    if (m.overflowX > 1) log(`  !! horizontal overflow by ${m.overflowX}px`);
    if (m.missing.length) log(`  !! missing sections: ${m.missing.join(', ')}`);
    if (!m.canvas) log('  !! no canvas');
    if (m.overflowing.length) log(`  !! elements past viewport: ${m.overflowing.join(' | ')}`);
    log(
      `  anchors: ${m.anchors.map((a) => `${a.key}:${a.w}x${a.h}`).join(' ')} | stages: ${m.cardStages.map((a) => `${a.key}:${a.w}x${a.h}`).join(' ')} | process: ${m.processAnchor}`,
    );

    const shots =
      view.name === 'desktop'
        ? SECTIONS
        : view.name === 'mobile'
          ? ['home', 'expertise', 'projects', 'contact']
          : ['home', 'projects'];

    for (const id of shots) {
      await page.evaluate((sectionId) => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      }, id);
      await new Promise((r) => setTimeout(r, 700));
      await shoot(page, `${view.name}-${id}`);
    }

    await page.close();
  }

  // ---- motion pass: scroll everything, watch for runtime errors --------
  const page = await newPage(browser, { width: 1440, height: 900 }, false);
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2000));

  for (const id of SECTIONS) {
    await page.evaluate((sectionId) => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    }, id);
    await new Promise((r) => setTimeout(r, 900));
    await shoot(page, `motion-${id}`);
  }

  // hover the project grid so the cursor preview mounts
  const card = await page.$('.project-card');
  if (card) {
    await card.evaluate((el) => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
    await new Promise((r) => setTimeout(r, 800));
    const box = await card.boundingBox();
    if (box) {
      const x = Math.min(Math.max(box.x + box.width / 2, 12), 1428);
      const y = Math.min(Math.max(box.y + 100, 12), 888);
      await page.mouse.move(x, y, { steps: 8 });
      await new Promise((r) => setTimeout(r, 600));
      await shoot(page, 'motion-cursor-preview');
      const preview = await page.$('.cursor-preview');
      const hit = await page.evaluate(
        ([mx, my]) => {
          const el = document.elementFromPoint(mx, my);
          return `${el?.tagName.toLowerCase()}.${(el?.className || '').toString().split(' ')[0]}`;
        },
        [x, y],
      );
      log(`cursor preview mounted: ${!!preview} | element at point: ${hit}`);
    }
  }

  // mobile menu
  await page.setViewport({ width: 390, height: 844 });
  await new Promise((r) => setTimeout(r, 600));
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 400));
  await page.click('.burger');
  await new Promise((r) => setTimeout(r, 700));
  const menuOpen = await page.evaluate(() =>
    document.querySelector('.mobile-menu')?.classList.contains('is-open'),
  );
  log(`mobile menu open: ${!!menuOpen}`);
  await shoot(page, 'mobile-menu-open');
  await page.click('.mobile-link');
  await new Promise((r) => setTimeout(r, 800));
  const menuClosed = await page.evaluate(
    () => !document.querySelector('.mobile-menu')?.classList.contains('is-open'),
  );
  log(`mobile menu closed after link click: ${!!menuClosed}`);

  await page.close();
  await browser.close();

  fs.writeFileSync(`${OUT}/verify-report.txt`, report.join('\n'));
  log('done');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
