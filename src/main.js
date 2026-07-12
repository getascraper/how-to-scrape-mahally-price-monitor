import 'dotenv/config';
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

async function run() {
  if (!process.env.APIFY_TOKEN) {
    throw new Error('APIFY_TOKEN is not set. Copy .env.example to .env and add your token.');
  }

  const input = {
    searchTerms: ['قهوة', 'coffee'],
    storeIds: ['1642664758'],
    onlyChanged: true,
    maxPagesPerQuery: 5,
    hitsPerQuery: 50,
    maxItems: 0,
  };

  const { defaultDatasetId } = await client.actor('getascraper/mahally-price-monitor').call(input);

  const { items } = await client.dataset(defaultDatasetId).listItems({ limit: 10 });

  console.table(items);
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
