require('dotenv').config();
const morgan = require('morgan');
const cors = require('cors');
const express = require('express');
const Person = require('./models/person');

const app = express();

app.use(cors(), express.static('build'));
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(
  express.json(),
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((people) => {
      res.json(people);
    })
    .catch((err) => next(err));
});
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      console.log(person);
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => console.log(err));
});
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      console.log('deleted', result);
      res.status(204).end();
    })
    .catch((err) => next(err));
});

app.post('/api/persons', (req, res, next) => {
  console.log(req.headers);
  const { body } = req;
  console.log(body.name);
  if (!body.name && !body.number) {
    return res.status(400).json({
      error: 'content is missing',
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    date: new Date(),
  });
  person
    .save()
    .then((addedPerson) => {
      console.log(addedPerson);
      res.json(addedPerson);
    })
    .catch((err) => next(err));
});
app.get('/info', (req, res, next) => {
  const date = new Date();
  Person.countDocuments({})
    .then((count) => {
      res.send(`<p> Phonebook has info for ${count} people </p>
      <p>${date}</p>`);
    })
    .catch((err) => next(err));
});

app.put('/api/persons/:id', (req, res, next) => {
  const { body } = req;

  const person = {
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, {
    runValidators: true,
    new: true,
  })
    .then((updatedNumber) => {
      console.log(updatedNumber);
      res.json(updatedNumber);
    })
    .catch((err) => next(err));
});

const errorHandler = (err, req, res, next) => {
  console.log('ERROR!!----------');

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).send({ error: err.message });
  }

  next(err);
};

app.use(errorHandler);

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
