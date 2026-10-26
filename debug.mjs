import puppeteer from 'puppeteer-core';

const URL = 'http://localhost:5173/';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function main() {
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

  for (const width of [1440, 390]) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 900 });
    await page.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'reduce' },
    ]);
    await page.goto(URL, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 2000));

    const base = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      hover: window.matchMedia('(hover: hover) and (pointer: fine)').matches,
      fine: window.matchMedia('(pointer: fine)').matches,
      about: (() => {
        const lead = document.querySelector('.about-lead');
        const h2 = document.querySelector('#about-title');
        if (!lead || !h2) return null;
        const r = lead.getBoundingClientRect();
        const hr = h2.getBoundingClientRect();
        return {
          lead: Math.round(r.width),
          h2: Math.round(hr.width),
          h2Scroll: h2.scrollWidth,
          lines: [...h2.querySelectorAll('[data-word]')].map((w) => {
            const b = w.getBoundingClientRect();
            return `${w.textContent}@${Math.round(b.left)},${Math.round(b.right)}`;
          }),
        };
      })(),
    }));

    console.log(`--- ${width} ---`);
    console.log('overflow', base.overflow, 'hover', base.hover, 'fine', base.fine);
    console.log('about', JSON.stringify(base.about, null, 1));

    const noPseudo = await page.evaluate(() => {
      const style = document.createElement('style');
      style.textContent = '*::before, *::after { display: none !important; }';
      document.head.appendChild(style);
      return document.documentElement.scrollWidth - document.documentElement.clientWidth;
    });
    console.log('overflow without pseudos:', noPseudo);

    const visible = await page.evaluate(() => {
      const style = document.createElement('style');
      style.textContent =
        'html, body { overflow-x: visible !important; } *::before, *::after { display: none !important; }';
      document.head.appendChild(style);
      const doc = document.documentElement;
      const offenders = [...document.querySelectorAll('body *')]
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { el, r };
        })
        .filter(({ r }) => r.width > 0 && r.right > doc.clientWidth + 1)
        .slice(0, 12)
        .map(({ el, r }) => `${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]} right=${Math.round(r.right)}`);
      return {
        overflow: doc.scrollWidth - doc.clientWidth,
        offenders,
      };
    });
    console.log('overflow with visible:', visible.overflow);
    console.log('offenders:', visible.offenders);

    await page.close();
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
