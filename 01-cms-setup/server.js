import { createServer } from 'service-mocker/server';
const { router } = createServer();

const CACHE_NAME = 'ONE';
const MOCK_SAVE_ENDPOINT = '/42';

const initialData = [
  `
<p>
  Hello from Nigeria
</p>
<p>
  Hello there, I'm a Nigerian prince. I would like to offer you $1,000,000! 
</p>
<p>
  Please send me e-mail: prince@nigeria.gov.ng
</p>`,
  `
<p>
  Can you see an image?
</p>
<p>
  <img src="https://picsum.photos/id/237/200/300">
</p>
`,
  `
<p>
  Yes I can see your image!
</p>
`
];

async function getDataFromCache() {
  const cache = await caches.open(CACHE_NAME);
  const result = await cache.match(MOCK_SAVE_ENDPOINT);
  if (!result) {
    return [];
  } else {
    return await result.json();
  }
}

router.get('/data', async (req, res) => {
  const currentData = await getDataFromCache();
  res.json({
    data: {
      comments: initialData.concat(currentData)
    }
  });
});

router.post('/data', async (req, res) => {
  const currentData = await getDataFromCache();
  const body = await req.json();

  cache.put(
    MOCK_SAVE_ENDPOINT,
    new Response(JSON.stringify(currentData.concat(body.comment)))
  );
  res.send('ok');
});

router.delete('/data', async (req, res) => {
  const cache = await caches.open(CACHE_NAME);
  cache.delete(MOCK_SAVE_ENDPOINT);
  console.log('[sw][delete] ');
  res.send('ok');
});
