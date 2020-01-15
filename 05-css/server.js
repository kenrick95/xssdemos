import { createServer } from 'service-mocker/server';
const { router } = createServer();

router.get('/data', async (req, res) => {
  const { seq } = req.query;
  try {
    console.log('[sw][post] ', seq);
    res.send('ok');
  } catch (e) {
    console.error('[sw][post] ', e);
    res.send('boo');
  }
});
