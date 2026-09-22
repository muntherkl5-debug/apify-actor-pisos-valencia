import { Actor } from 'apify';
import { load } from 'cheerio';
import { gotScraping } from 'got-scraping';

const MAX_PRICE = 1000;
const MIN_ROOMS = 2;
const MIN_BATHS = 1;

const SOURCES = [
    {
        name: 'Fotocasa',
        url: 'https://www.fotocasa.es/es/alquiler/viviendas/valencia/todas-las-zonas/l',
        parse: ($) => {
            const items = [];
            $('.re-CardPackPremium, .re-CardPack').each((_, el) => {
                const price = parseInt($(el).find('.re-CardPrice').text().replace(/\D/g, ''), 10);
                const rooms = parseInt($(el).find('.re-CardFeaturesItem').eq(0).text().replace(/\D/g, ''), 10);
                const baths = parseInt($(el).find('.re-CardFeaturesItem').eq(1).text().replace(/\D/g, ''), 10);
                const relativeLink = $(el).find('a').attr('href');
                const link = relativeLink ? `https://www.fotocasa.es${relativeLink}` : null;

                const isParticular = $(el)
                    .find('.re-CardAdvertiserType')
                    .text()
                    .toLowerCase()
                    .includes('particular');

                items.push({ price, rooms, baths, link, isParticular });
            });
            return items;
        },
    },
    {
        name: 'Milanuncios',
        url: 'https://www.milanuncios.com/alquiler-de-pisos-valencia/?orden=relevancia',
        parse: ($) => {
            const items = [];
            $('.aditem').each((_, el) => {
                const price = parseInt($(el).find('.aditem-price').text().replace(/\D/g, ''), 10);
                const text = $(el).find('.aditem-detail').text();

                const roomsMatch = text.match(/(\d+)\s*habi/gi);
                const bathsMatch = text.match(/(\d+)\s*bañ/gi);

                const rooms = roomsMatch ? parseInt(roomsMatch[0].replace(/\D/g, ''), 10) : 0;
                const baths = bathsMatch ? parseInt(bathsMatch[0].replace(/\D/g, ''), 10) : 0;

                const link = $(el).find('a').attr('href');

                const isParticular = $(el)
                    .find('.aditem-header')
                    .text()
                    .toLowerCase()
                    .includes('particular');

                items.push({ price, rooms, baths, link, isParticular });
            });
            return items;
        },
    },
    {
        name: 'Yaencontre',
        url: 'https://www.yaencontre.com/alquiler/viviendas/valencia',
        parse: ($) => {
            const items = [];
            $('.listing-item').each((_, el) => {
                const price = parseInt($(el).find('.price').text().replace(/\D/g, ''), 10);
                const rooms = parseInt($(el).find('.feature.rooms').text().replace(/\D/g, ''), 10);
                const baths = parseInt($(el).find('.feature.baths').text().replace(/\D/g, ''), 10);
                const link = $(el).find('a').attr('href');

                const isParticular = $(el)
                    .find('.owner-type')
                    .text()
                    .toLowerCase()
                    .includes('particular');

                items.push({ price, rooms, baths, link, isParticular });
            });
            return items;
        },
    },
];

Actor.main(async () => {
    const results = [];

    for (const src of SOURCES) {
        console.log(`Scraping: ${src.name}`);

        try {
            const response = await gotScraping({ url: src.url });
            const html = response.body;
            const $ = load(html);

            const parsed = src.parse($);

            const filtered = parsed.filter((item) =>
                item.price &&
                item.price <= MAX_PRICE &&
                item.rooms >= MIN_ROOMS &&
                item.baths >= MIN_BATHS &&
                item.isParticular
            );

            results.push(
                ...filtered.map((r) => ({
                    source: src.name,
                    price: r.price,
                    rooms: r.rooms,
                    baths: r.baths,
                    link: r.link,
                }))
            );
        } catch (err) {
            console.error(`Error en fuente ${src.name}:`, err.message);
        }
    }

    await Actor.pushData(results);
    console.log(`Scraping completado. Total resultados: ${results.length}`);
});
