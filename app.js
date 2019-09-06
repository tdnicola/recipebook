   var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    { Pool } = require('pg'),
    app = express();

    const { connectionString } = require('./config.json');
//db connect string
// var connect = 'postgres://user:marine@localhost/recipebookdb';

const pool = new Pool({
    connectionString: connectionString,
    ssl: true
});

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
       client.query('delete from recipe where id = $1',
       [req.params.id]);
       done();
       res.send(200)
    });
}))

app.post('/edit', ((req, res) => {
    pool.connect((err, client, done) => {
        if (err) throw err
        client.query('update recipe set name = $1, ingredients = $2, directions = $3 where id = $4',
            [req.body.name, req.body.ingredients, req.body.directions, req.body.id,]);

       done();
       res.redirect('/')
    });
}))

//server
app.listen(process.env.PORT || 3000, function () {
    console.log('server listening on port 3000');
});
