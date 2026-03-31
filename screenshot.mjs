import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

const url = process.argv[2] || "http://localhost:3000";
const label = process.argv[3] || "";

const dir = "./temporary-screenshots";
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// Auto-increment screenshot number
const existing = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
const nums = existing
  .map((f) => parseInt(f.match(/screenshot-(\d+)/)?.[1]))
  .filter(Boolean);
const next = nums.length ? Math.max(...nums) + 1 : 1;

const filename = label
  ? `screenshot-${next}-${label}.png`
  : `screenshot-${next}.png`;
const outPath = path.join(dir, filename);

const browser = await puppeteer.launch({
  executablePath: "/home/shane/.cache/puppeteer/chrome/linux-146.0.7680.153/chrome-linux64/chrome",
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: "networkidle2" });
await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log(`Screenshot saved: ${outPath}`);
