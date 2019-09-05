var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    { Pool, Client } = require('pg'),
    app = express();

    const { user, password, pghost, port, database } = require('./config.json');
//db connect string
// var connect = 'postgres://user:marine@localhost/recipebookdb';

const pool = new Pool({
    user,
    password,
    pghost,
    port,
    database,
})

// // assign dust engine to .dust files
app.engine('dust', cons.dust);

//set default ext to .dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
    pool.connect((err, client, done) => {
        if (err) throw err
        client.query('SELECT * FROM recipe', (err, result) => {
          if (err) {
            console.log(err.stack)
          } else {
            console.log(result.rows)
          }
          res.render('index', {recipes: result.rows});
          done();
        });
    });
});

app.post('/add', ((req, res) => {
    pool.connect((err, client, done) => {
        if (err) throw err
       client.query('insert into recipe(name, ingredients, directions) values($1, $2, $3)',
       [req.body.name, req.body.ingredients, req.body.directions]);
       done();
       res.redirect('/')
    });
}));

app.delete('/delete/:id', ((req, res) => {
    pool.connect((err, client, done) => {
        if (err) throw err
       client.query('delete from recipes where id = $1',
       [req.params.id]);
       done();
       res.send(200)
    });
}))
//server
app.listen(3000, function () {
    console.log('server listening on port 3000');
});
