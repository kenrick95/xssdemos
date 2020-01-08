import { createServer } from 'service-mocker/server';
const { router } = createServer();

const CACHE_NAME = 'TWO';
const MOCK_SAVE_ENDPOINT = '/42';

router.get('/data', async (req, res) => {
  const cache = await caches.open(CACHE_NAME);
  try {
    const result = await cache.match(MOCK_SAVE_ENDPOINT);
    if (!result) {
      res.json({ data: '' });
    } else {
      res.json({ data: await result.text() });
    }
  } catch (e) {
    res.json({ error: 1 });
  }
});

router.post('/save', async (req, res) => {
  const cache = await caches.open(CACHE_NAME);
  const body = await req.json();
  cache.put(MOCK_SAVE_ENDPOINT, new Response(body.data));
  res.send('ok');
});
