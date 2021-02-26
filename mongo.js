const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  );
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://nil:${password}@cluster0.r7zlm.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log('--------started---------'))
  .catch((err) => {
    console.log('error', err);
    process.exit(1);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

const person = new Person({
  name,
  number,
});
console.log(person);
if (process.argv.length === 3) {
  Person.find({}).then((res) => {
    res.forEach((addedPerson) => {
      console.log(addedPerson.name, addedPerson.number);
    });
    mongoose.connection.close();
    console.log('-----closed------');
  });
} else if (process.argv.length === 5) {
  person.save().then((res) => {
    console.log(`added ${res.name} number ${res.number} to phonebook`);
    mongoose.connection.close();
    console.log('-------connection ended--------');
  });
}
