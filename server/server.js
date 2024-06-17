const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL DB Connection Config
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'dev25',
  database: 'form_data'
};

// Create a MySQL pool
const pool = mysql.createPool(dbConfig);

// Handle form submission
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/submit', (req, res) => {
  const { form_type, name, country_code, phone_number } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      res.status(500).send('Failed to connect to database.');
      return;
    }

    const query = 'INSERT INTO form_data (form_type, name, country_code, phone_number) VALUES (?, ?, ?, ?)';
    connection.query(query, [form_type, name, country_code, phone_number], (error, results) => {
      connection.release();
      if (error) {
        console.error('Error inserting data into MySQL:', error);
        res.status(500).send('Failed to submit form data.');
        return;
      }

      res.redirect('/');
    });
  });
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
