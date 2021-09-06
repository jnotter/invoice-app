const express = require('express');
const ejsMate = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const clients = require('./routes/clients')
const invoices = require('./routes/invoices')

mongoose.connect('mongodb://localhost:27017/facere-invoice', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Database connected");
})

const app = express();

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.use('/clients', clients)
app.use('/invoices', invoices)

app.get('/', (req, res) => {
    res.render('home')
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
})