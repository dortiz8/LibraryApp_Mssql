/* eslint-disable linebreak-style */
const express = require('express'); // List of requirements//

const bookRouter = express.Router();
const sql = require('mssql'); // This connection is establish in app.js and it runs on the same instance
const debug = require('debug')('app:bookRoutes')

function router(nav) { // nav argument comes from app.js and was passed as config data

  bookRouter.route('/') // This is books home
    .get((req, res) => {
      (async function query() {
        const request = new sql.Request(); // Creates a new sql connection
        const { recordset } = await request.query('select * from books'); //async await the query result from the sql db

        res.render('bookListView', { nav, title: 'Library', books: recordset }); // call nav as it is to render
      }());
    });
  bookRouter.route('/:id') // This renders /books/single
    .all((req, res, next) => {
      (async function singleQuery() {
        const { id } = req.params;
        const request = new sql.Request();
        const { recordset } = await request.input('id', sql.Int, id) //input allows us to record req.param, filter it and use it.
          .query('select * from books where id = @id');
          req.book = recordset[0];
          next();
      }())
    })
    .get((req, res) => {
      res.render('bookView', { nav, title: req.book, book: req.book });
    });
  return bookRouter; // return bookRouter do to changes
}


module.exports = router;
