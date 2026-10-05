#!/usr/bin/env node
// scripts/one-pagers.mjs
//
// Renders the v2 one-page design sheets (design/one-pagers/v2/pages/*.html)
// to PDF with the project's Playwright Chromium, writes a PNG preview of each
// page for visual checks, and merges the single-page PDFs into one file.
//
//   node scripts/one-pagers.mjs render [page.html ...]   # all pages when no args
//   node scripts/one-pagers.mjs merge                     # pages/p01..p15 -> the PDF
//   node scripts/one-pagers.mjs check                     # page count, banned words
//
// Pure functions over plain data where possible; the I/O sits in `main`.
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'

const ROOT = process.cwd()
const DIR = path.join(ROOT, 'design/one-pagers/v2')
const PAGES = path.join(DIR, 'pages')
const OUT = path.join(DIR, 'build')
const PDF = path.join(DIR, 'survival-dice-builder-v2-one-pagers.pdf')
const CHROMIUM = '/opt/pw-browsers/chromium'

// Words that betray the digital prototype. The sheets describe a board game.
const BANNED = [
  'screen',
  'button',
  'click',
  'tap ',
  'HUD',
  ' UI ',
  'app ',
  'website',
  'save file',
  'export',
  'bot ',
  'engine',
  'config',
  'flag',
  'version 2',
  'phase bar',
  'debug',
  'Vite',
  'React',
  'SVG',
]

/** Every page file in display order (p01 ... p15). */
const listPages = () =>
  fs
    .readdirSync(PAGES)
    .filter((f) => /^p\d\d-.*\.html$/.test(f))
    .sort()
    .map((f) => path.join(PAGES, f))

/** Visible text of an HTML page: tags, styles and SVG stripped. */
const visibleText = (html) =>
  html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')

/** Banned words found in a page's visible text (case-insensitive, padded). */
const bannedIn = (html) => {
  const text = ` ${visibleText(html)} `.toLowerCase()
  return BANNED.filter((w) => text.includes(w.toLowerCase()))
}

/** The orientation a page asks for in its @page rule; portrait by default. */
const orientationOf = (html) => (/@page\s*{[^}]*landscape/i.test(html) ? 'landscape' : 'portrait')

const loadPlaywright = () => {
  const require = createRequire(path.join(ROOT, 'apps/web/package.json'))
  return require('@playwright/test')
}

async function render(files) {
  fs.mkdirSync(OUT, { recursive: true })
  const { chromium } = loadPlaywright()
  const browser = await chromium.launch({ executablePath: CHROMIUM })
  try {
    for (const file of files) {
      const html = fs.readFileSync(file, 'utf8')
      const landscape = orientationOf(html) === 'landscape'
      const name = path.basename(file, '.html')
      const pdf = path.join(OUT, `${name}.pdf`)
      const page = await browser.newPage()
      await page.goto(`file://${file}`, { waitUntil: 'load' })
      await page.emulateMedia({ media: 'print' })
      await page.pdf({
        path: pdf,
        format: 'Letter',
        landscape,
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      })
      await page.close()
      // PNG preview at 72 dpi for a visual check (pdftoppm, poppler).
      execFileSync('pdftoppm', ['-png', '-r', '72', pdf, path.join(OUT, name)])
      const pages = pageCount(pdf)
      console.log(`${name}: ${pages} page(s), ${landscape ? 'landscape' : 'portrait'}`)
    }
  } finally {
    await browser.close()
  }
}

/** Page count of a PDF through pypdf. */
const pageCount = (pdf) =>
  Number(
    execFileSync('python3', [
      '-c',
      'import sys; from pypdf import PdfReader; print(len(PdfReader(sys.argv[1]).pages))',
      pdf,
    ])
      .toString()
      .trim(),
  )

function merge() {
  const parts = listPages().map((f) => path.join(OUT, `${path.basename(f, '.html')}.pdf`))
  const missing = parts.filter((p) => !fs.existsSync(p))
  if (missing.length) throw new Error(`render first; missing: ${missing.join(', ')}`)
  execFileSync('python3', [
    '-c',
    [
      'import sys',
      'from pypdf import PdfWriter, PdfReader',
      'w = PdfWriter()',
      'for f in sys.argv[2:]:',
      '    [w.add_page(p) for p in PdfReader(f).pages]',
      'w.add_metadata({"/Title": "Survival Dice-Builder v2 one-page designs"})',
      'w.write(sys.argv[1])',
    ].join('\n'),
    PDF,
    ...parts,
  ])
  console.log(`${path.relative(ROOT, PDF)}: ${pageCount(PDF)} pages`)
}

function check() {
  const files = listPages()
  const problems = []
  if (files.length !== 15) problems.push(`expected 15 page files, found ${files.length}`)
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8')
    const bad = bannedIn(html)
    if (bad.length) problems.push(`${path.basename(file)}: banned words ${bad.join(', ')}`)
    const name = path.basename(file, '.html')
    const pdf = path.join(OUT, `${name}.pdf`)
    if (fs.existsSync(pdf) && pageCount(pdf) !== 1) problems.push(`${name}: overflows one page`)
  }
  if (fs.existsSync(PDF) && pageCount(PDF) !== 15) problems.push(`${PDF}: not 15 pages`)
  for (const p of problems) console.error(`check: ${p}`)
  console.log(problems.length ? `check: ${problems.length} problem(s)` : 'check: ok')
  process.exitCode = problems.length ? 1 : 0
}

async function main([cmd, ...rest]) {
  if (cmd === 'render') return render(rest.length ? rest.map((f) => path.resolve(f)) : listPages())
  if (cmd === 'merge') return merge()
  if (cmd === 'check') return check()
  console.error('usage: one-pagers.mjs render [files...] | merge | check')
  process.exitCode = 2
}

main(process.argv.slice(2))
