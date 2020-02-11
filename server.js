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
const KvDb = (pathToFile, initialData) => {
  if (!fs.existsSync(pathToFile)) {
    fs.writeFileSync(pathToFile, JSON.stringify(initialData), 'utf8')
  }

  return {
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
const initialData = {
  cms: {
    comments: [
      {
        text: `
  <p>
    Hello from Nigeria
  </p>
  <p>
    Hello there, I'm a Nigerian prince. I would like to offer you $1,000,000! 
  </p>
  <p>
    Please send me e-mail: prince@nigeria.gov.ng
  </p>`,
        timestamp: 1571095939
      },
      {
        text: `
  <p>
    Can you see an image?
  </p>
  <p>
    <img src="https://picsum.photos/id/237/200/300">
  </p>
  `,
        timestamp: 1572095939
      },
      {
        text: `
  <p>
    Yes I can see your image!
  </p>
  `,
        timestamp: 1578095939
      }
    ]
  }
}
const db = KvDb(path.join(__dirname, 'db.json'), initialData)
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
app.post('/01-cms/', async (req, res) => {
  console.log('hahaha', req.body)
  const cms = await db.get('cms')
  cms.comments = cms.comments.concat([
    {
      text: req.body.comment,
      timestamp: Math.round(Date.now() / 1000)
    }
  ])

  await db.set('cms', cms)
  res.statusCode = 201
  await renderTemplate(req, res)
})
app.delete('/01-cms/', async (req, res) => {
  await db.set('cms', initialData.cms)
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

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})
