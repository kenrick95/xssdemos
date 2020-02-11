const resetButtonEl = document.getElementById('reset')
const visitorCountEl = document.getElementById('counter')
async function deleteData() {
  const response = await fetch('./', {
    method: 'DELETE'
  })
  console.log('[deleteData]', await response.text())
  if (response.ok) {
    location.reload()
  }
}
resetButtonEl.addEventListener('click', deleteData)
visitorCountEl.textContent = Math.floor(Date.now() / 1000)
