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
async function renderComments(comments) {
  commentsEl.innerHTML = comments
    .map((comment) => {
      return `<div class="comment">${comment}</div>`;
    })
    .join('\n');
}
async function refreshPreview() {
  const data = await fetchData();
  renderComments(data.comments);
}
async function init() {
  const data = await fetchData();
  renderComments(data.comments);
}
document.addEventListener('DOMContentLoaded', init);
refreshButtonEl.addEventListener('click', refreshPreview);
saveButtonEl.addEventListener('click', postData);
resetButtonEl.addEventListener('click', deleteData);
