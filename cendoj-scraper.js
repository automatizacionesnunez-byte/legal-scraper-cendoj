const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function searchCendoj(terminos, filtros = {}) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.goto('https://www.poderjudicial.es/search/indexAN.jsp', {
      waitUntil: 'networkidle2'
    });

    // Escribir términos de búsqueda
    await page.type('#frmBusquedajurisprudencia_TEXT', terminos);

    // Ejecutar búsqueda con múltiples estrategias
    await page.evaluate(() => {
      const form = document.querySelector('form#frmBusquedajurisprudencia');
      if (form) {
        form.submit();
      } else if (typeof jQuery !== 'undefined') {
        $('#frmBusquedajurisprudencia').submit();
      } else {
        const submitBtn = document.querySelector('input[type="submit"]');
        if (submitBtn) submitBtn.click();
      }
    });

    // Esperar resultados
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });

    const html = await page.content();
    const $ = cheerio.load(html);

    const resultados = [];
    $('.resultado').each((i, elem) => {
      const titulo = $(elem).find('.titulo').text().trim();
      const enlace = $(elem).find('a').attr('href');
      const resumen = $(elem).find('.resumen').text().trim();

      resultados.push({
        titulo,
        url: enlace ? `https://www.poderjudicial.es${enlace}` : null,
        resumen
      });
    });

    return {
      success: true,
      total: resultados.length,
      resultados
    };

  } finally {
    await browser.close();
  }
}

async function getFullSentence(url) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const html = await page.content();
    const $ = cheerio.load(html);

    const contenido = $('.sentencia-completa').html() || $('body').html();

    return {
      success: true,
      url,
      contenido
    };

  } finally {
    await browser.close();
  }
}

module.exports = { searchCendoj, getFullSentence };
