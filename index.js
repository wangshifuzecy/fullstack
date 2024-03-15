const express = require('express')
const repl = require('repl')
const app = express()
var morgan = require('morgan')

app.use(express.json())

app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}));

const generateId = () =>{
	return Math.floor(Math.random() * 1000) + 1
}


let notes =
[
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  response.send(`have ${notes.length} <br/> ${new Date().toLocaleString()}`)
})

app.get('/api/notes',(request,response)=>{
	response.json(notes)
})

app.post('/api/notes', (request, response) => {
  const body = request.body

	console.log(body)

  if (!body.name) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
	  name: body.name,
		number: body.number,
    important: body.important || false,
    id: generateId()
  }

  notes = notes.concat(note)

  response.json(note)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note=>note.id === id)
  if(note){
		response.json(note)
  }else{
		response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
	notes = notes.filter(note=> note.id !== id)
	response.status(204).end()
})

const unknownEndpoint = (request, response)=>{
	response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT,()=>{
console.log(`Server running on port ${PORT}`)
})


