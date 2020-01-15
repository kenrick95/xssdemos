import scriptURL from 'sw-loader!./server.js';
import { createClient } from 'service-mocker/client';

const client = createClient(scriptURL);

const commentsEl = document.getElementById('comments');
const editorEl = document.getElementById('editor');

const saveButtonEl = document.getElementById('save');
const refreshButtonEl = document.getElementById('refresh');
const resetButtonEl = document.getElementById('reset');

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
      comment: editorEl.value
    })
  });

  console.log('[postData]', await response.text());
  statusEl.textContent = 'Saved!';
}
async function fetchRenderred() {
  await client.ready;
  const response = await fetch('/renderred', {
    headers: fetchHeaders
  });
  if (response.ok) {
    const { renderred } = await response.json();
    return renderred;
  }
  return 'Error';
}
async function fetchAndRender() {
  commentsEl.innerHTML = await fetchRenderred();
}
async function refreshPreview() {
  fetchAndRender();
}
async function init() {
  fetchAndRender();
}
document.addEventListener('DOMContentLoaded', init);
refreshButtonEl.addEventListener('click', refreshPreview);
saveButtonEl.addEventListener('click', postData);
resetButtonEl.addEventListener('click', deleteData);
