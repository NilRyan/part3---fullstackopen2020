const morgan = require('morgan');
const cors = require('cors');
const express = require ('express');
const app = express();

app.use(cors(), express.static('build'));
morgan.token('body', (req) => {
  return JSON.stringify(req.body);
})
app.use(express.json(), morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
  
{
  id: 1,
  name: "Arto Hellas",
  number: "040-123456"
},
{
  id: 2,
  name: "Ada Lovelace",
  number: "39-44-5323523"
},
{
  id: 3,
  name: "Dan Abramov",
  number: "12-43-234345"
},
{
  id: 4,
  name: "Mary Poppendick",
  number: "39-23-6423122"
}
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person =  persons.find(person => person.id === id )
  if(person){
    res.json(person);
  } else{
    response.status(404).end()
  }
 
})
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id)

  response.status(204).end();

})

const generateId = () => {
  return Math.round(Math.random()*10000)
}
app.post('/api/persons', (req, res) => {
  console.log(req.headers);
  const body = req.body;
  console.log(body.name);
  if(!body.name && !body.number){
    return res.status(400).json({
      error: 'content is missing'
    })
  } else if (persons.some(person => person.name === body.name) ){
    return res.status(400).json({
      error: 'name must be unique'
    })
  }
  const person = {
    name: body.name,
    number: body.number,
    date: new Date(),
    id: generateId(),
  }
  persons = persons.concat(person)
  
  res.json(person)
})
app.get('/info', (req, res) => {
  const date = new Date();
  const entries = persons.length;
  res.send(`<p> Phonebook has info for ${entries} people </p>
  <p>${date}</p>`)
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});