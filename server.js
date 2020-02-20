const express = require('express')
const fs = require('fs')
const path = require('path')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const util = require('util')
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

const app = express()
const port = 3000
app.use(morgan('tiny'))

app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(bodyParser.text({ type: 'application/font-woff2' }))
app.use(bodyParser.text({ type: 'application/font-woff' }))
app.use(bodyParser.text({ type: 'text/html' }))
app.use(
  bodyParser.urlencoded({
    type: 'application/x-www-form-urlencoded',
    extended: false
  })
)

//#region Database
const KvDb = (pathToFile, pathToInitialData) => {
  if (!fs.existsSync(pathToFile)) {
    fs.copyFileSync(pathToInitialData, pathToFile)
  }
  return {
    reset: async () => {
      fs.copyFileSync(pathToInitialData, pathToFile)
    },
    get: async key => {
      const content = await readFile(pathToFile, 'utf8')
      const parsed = JSON.parse(content)
      return parsed[key]
    },
    set: async (key, value) => {
      const content = await readFile(pathToFile, 'utf8')
      const parsed = JSON.parse(content)
      parsed[key] = value
      await writeFile(pathToFile, JSON.stringify(parsed), 'utf8')
      return value
    }
  }
}
const db = KvDb(
  path.join(__dirname, 'db.json'),
  path.join(__dirname, 'db.initial.json')
)
//#endregion

// #region 01-cms

async function renderTemplate(req, res) {
  const template = fs.readFileSync(
    path.join(__dirname, './01-cms/index.html'),
    'utf8'
  )
  const cms = await db.get('cms')
  const renderred = cms.comments
    .map(comment => {
      return `<div class="comment"><div class="text">${
        comment.text
      }</div><div class="datetime">${new Date(
        comment.timestamp * 1000
      ).toLocaleString()}</div></div>`
    })
    .join('\n')
  body = template.replace(new RegExp('{{comments}}'), () => {
    return renderred
  })
  res.send(body)
}
app.get('/01-cms/', renderTemplate)
app.post('/01-cms/save', async (req, res) => {
  console.log('[cms][save]', req.body)
  const cms = await db.get('cms')
  cms.comments = cms.comments.concat([
    {
      text: req.body.comment,
      timestamp: Math.round(Date.now() / 1000)
    }
  ])

  await db.set('cms', cms)
  res.redirect('/01-cms/')
})
app.delete('/01-cms/delete', async (req, res) => {
  await db.reset()
  res.sendStatus(200)
})

app.use('/01-cms', (req, res, next) => {
  if (req.originalUrl === '/01-cms') {
    res.redirect(302, '/01-cms/')
  } else {
    next()
  }
})
app.use('/01-cms', express.static('01-cms', { index: false }))

// #endregion

app.use('/02-ref', express.static('02-ref'))

app.use('/03-css', express.static('03-css'))

app.get('/logger', (req, res) => {
  console.log(`Received body: ${req.body}`)
  res.sendStatus(200)
})
app.get('/font-logger', (req, res) => {
  console.log(`Received seq: ${req.query.seq}`)
  res.sendStatus(404)
})

app.get('/', (req, res) => {
  const list = ['/01-cms/', '/02-ref/', '/03-css/']
  res.send(
    `<ul>${list
      .map(item => {
        return `<li><a href="${item}">${item}</a></li>`
      })
      .join('')}</ul>`
  )
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})
