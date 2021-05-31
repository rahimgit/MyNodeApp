const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    port:'3325',
    user: 'root',
    password: '1234',
    database: 'studentdb',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});


app.listen(3000, () => console.log('Express server is runnig at port no : 3000'));


//Get all students
app.get('/student', (req, res) => {
    mysqlConnection.query('SELECT * FROM student', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Get a Student
app.get('/student/:StudentNo', (req, res) => {
    mysqlConnection.query('SELECT * FROM student WHERE StudentNo= ?', [req.params.StudentNo], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});





//Delete a Student
app.delete('/student/:StudentNo', (req, res) => {
    mysqlConnection.query('DELETE FROM student WHERE StudentNo = ?', [req.params.StudentNo], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully.');
        else
            console.log(err);
    })
});


//Insert a Student
app.post('/student', (req, res) => {
    let std = req.body;
    var sql = "SET @Id = ?;SET @StudentNo = ?;SET @StudentName = ?;SET @Age = ?;SET @PhoneNo = ?; \
    CALL studentAddOrEdit(@Id,@StudentNo,@StudentName,@Age,@PhoneNo);";
    mysqlConnection.query(sql, [std.Id, std.StudentNo, std.StudentName, std.Age, std.PhoneNo], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('Inserted Student id : '+element[0].Id);
            });
        else
            console.log(err);
    })
});


//Update student
app.put('/student', (req, res) => {
    let std = req.body;
    var sql = "SET @Id = ?;SET @StudentNo = ?;SET @StudentName = ?;SET @Age = ?;SET @PhoneNo = ?; \
    CALL studentAddOrEdit(@Id,@StudentNo,@StudentName,@Age,@PhoneNo);";
    mysqlConnection.query(sql, [std.Id, std.StudentNo, std.StudentName, std.Age, std.PhoneNo], (err, rows, fields) => {
        if (!err)
            res.send('Updated successfully');
        else
            console.log(err);
    })
});





