import { PDFDocument } from 'pdf-lib'

const BW =
	'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'

const puppeteer = require('puppeteer');

const generatePdf = async (html = '', title = 'Reserve') => {
	const margin = {
		top: '50px',
		bottom: '50px',
		left: '50px',
		right: '50px',
	}
	const browser = await puppeteer.launch({
		headless: true,
		args: ['--font-render-hinting=none', '--no-sandbox'],
		ignoreDefaultArgs: ['--disable-extensions'],
	})
	const page = await browser.newPage()

	await page.setContent(html, { timeout: 30000 })

	await page.setViewport({ width: 640, height: 980 })
	await page.setUserAgent(BW)
	await page.emulateMediaType('screen')
	const pdf = await page.pdf({
		printBackground: true,
		format: 'letter',
		margin: margin,
	})
	await browser.close()

	const pdfDoc = await PDFDocument.load(pdf)
	pdfDoc.setTitle(title)
	const pdfBytes = await pdfDoc.save()

	return Buffer.from(pdfBytes)
}

export default generatePdf
