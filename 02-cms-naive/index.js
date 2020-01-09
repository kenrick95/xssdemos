import scriptURL from 'sw-loader!./server.js';
import { createClient } from 'service-mocker/client';

const client = createClient(scriptURL);

const mainEl = document.getElementById('main');
const editorEl = document.getElementById('editor');
const saveButtonEl = document.getElementById('save');
const getButtonEl = document.getElementById('get');

function fetchData() {
  client.ready.then(async () => {
    const response = await fetch('/data', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const { data, error } = await response.json();
    if (error) {
      console.error(error);
      return;
    }
    console.log(data);
    mainEl.innerHTML = data;
  });
}
document.addEventListener('DOMContentLoaded', fetchData);
getButtonEl.addEventListener('click', fetchData);

saveButtonEl.addEventListener('click', () => {
  client.ready.then(async () => {
    const response = await fetch('/save', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: '<b>Hello</b> ' + new Date().toISOString() })
    });

    console.log(await response.text());
  });
});
