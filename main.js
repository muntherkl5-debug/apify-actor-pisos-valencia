import { Actor } from 'apify';
import { gotScraping } from 'got-scraping';

const MAX_PRICE = 1000;
const MIN_ROOMS = 2;
const MIN_BATHS = 1;

// API REAL de Milanuncios (no HTML)
const API_URL = "https://api.milanuncios.com/v5/search";

Actor.main(async () => {
    const results = [];

    try {
        const response = await gotScraping({
            url: API_URL,
            searchParams: {
                categoryId: 3500,          // Alquiler de pisos
                locationId: 0,             // Valencia ciudad
                provinceId: 46,            // Valencia provincia
                order: "relevance",
                adType: "rent",
                from: 0,
                size: 100
            },
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "application/json"
            }
        });

        const data = JSON.parse(response.body);

        if (!data?.ads) {
            console.log("No se recibieron anuncios desde la API.");
            await Actor.pushData([]);
            return;
        }

        for (const ad of data.ads) {
            const price = ad?.price ?? 0;
            const rooms = ad?.rooms ?? 0;
            const baths = ad?.bathrooms ?? 0;
            const isParticular = ad?.ownerType === "private";
            const link = ad?.url;

            if (
                price <= MAX_PRICE &&
                rooms >= MIN_ROOMS &&
                baths >= MIN_BATHS &&
                isParticular
            ) {
                results.push({
                    source: "Milanuncios API",
                    price,
                    rooms,
                    baths,
                    link
                });
            }
        }

        await Actor.pushData(results);
        console.log(`Scraping completado. Total resultados: ${results.length}`);

    } catch (err) {
        console.error("Error al llamar a la API de Milanuncios:", err.message);
    }
});
