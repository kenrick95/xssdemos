import scriptURL from 'sw-loader!./server.js';
import { createClient } from 'service-mocker/client';

const client = createClient(scriptURL);

const previewEl = document.getElementById('preview');
const editorEl = document.getElementById('editor');

const saveButtonEl = document.getElementById('save');
const refreshButtonEl = document.getElementById('refresh');
const resetButtonEl = document.getElementById('reset');

const statusEl = document.getElementById('status');

const fetchHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

async function deleteData() {
  statusEl.textContent = 'Restarting server...';
  await client.read;

  const response = await fetch('/data', {
    method: 'DELETE',
    headers: fetchHeaders
  });
  console.log('[deleteData]', await response.text());
  statusEl.textContent = 'Server restarted!';
}

async function postData() {
  statusEl.textContent = 'Saving...';
  await client.read;
  const response = await fetch('/data', {
    method: 'POST',
    headers: fetchHeaders,
    body: JSON.stringify({
      data: editorEl.value,
      timestamp: Date.now()
    })
  });

  console.log('[postData]', await response.text());
  statusEl.textContent = 'Saved!';
}
async function fetchData() {
  await client.ready;
  const response = await fetch('/data', {
    headers: fetchHeaders
  });
  const { data, error } = await response.json();
  if (error) {
    console.error('[fetchData] error', error);
    return;
  }
  console.log('[fetchData] data', data);
  return data;
}
async function refreshPreview() {
  statusEl.textContent = 'Re-rendering...';
  const data = await fetchData();
  statusEl.textContent = 'Re-rendered!';
  previewEl.innerHTML = data;
}
async function init() {
  statusEl.textContent = 'Initializing editor and preview';
  const data = await fetchData();
  editorEl.value = data;
  previewEl.innerHTML = data;
  statusEl.textContent = 'Editor and preview initialized!';
}
document.addEventListener('DOMContentLoaded', init);
refreshButtonEl.addEventListener('click', refreshPreview);
saveButtonEl.addEventListener('click', postData);
resetButtonEl.addEventListener('click', deleteData);
