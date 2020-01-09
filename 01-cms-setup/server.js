import { createServer } from 'service-mocker/server';
const { router } = createServer();

const CACHE_NAME = 'ONE';
const MOCK_SAVE_ENDPOINT = '/42';

const initialData = `
<h1>Hello</h1>
<p>
  Lorem ipsum dolor <b>sit</b> <i>amet</i>.
</p>

<p>
  Can you see an image?
</p>

<p>
  <img src="https://picsum.photos/id/237/200/300">
</p>
`;
router.get('/data', async (req, res) => {
  const cache = await caches.open(CACHE_NAME);
  try {
    const result = await cache.match(MOCK_SAVE_ENDPOINT);
    if (!result) {
      res.json({ data: initialData, timestamp: 0 });
    } else {
      const text = await result.text();
      console.log('[sw][get] >>  text', text);
      res.send(text);
    }
  } catch (e) {
    console.error('[sw][get] >>  Error', e);
    res.json({ error: 1 });
  }
});

router.post('/data', async (req, res) => {
  const cache = await caches.open(CACHE_NAME);
  const body = await req.text();
  console.log('[sw][post]  >> ', body);
  cache.put(MOCK_SAVE_ENDPOINT, new Response(body));
  res.send('ok');
});

router.delete('/data', async (req, res) => {
  const cache = await caches.open(CACHE_NAME);
  cache.delete(MOCK_SAVE_ENDPOINT);
  console.log('[sw][delete] ');
  res.send('ok');
});
