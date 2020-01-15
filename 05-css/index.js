import scriptURL from 'sw-loader!./server.js';
import { createClient } from 'service-mocker/client';

const client = createClient(scriptURL);
(async () => {
  await client.ready;
})();
