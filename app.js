var oracledb = require('oracledb');
const port = 5000; // portul pe care sa ruleze aplicatia (localhost:5000)
const express = require("express");

const app = express();
app.set("view engine", "ejs");

app.use(express.static("public"));

oracledb.autoCommit = true;
var connectionProperties = {
    user: "your_username",
    password: "your_password",
    connectString: "193.226.51.37:1521/o11g"
};

function doRelease(connection) {
    connection.release(function (err) {
        if (err) {
            console.error(err.message);
        }
    });
};

// GET requests
app.get("/", function (req, res) {
    oracledb.getConnection(connectionProperties, function (err, connection) {
        if (err) {
            console.error(err.message);
            res.status(500).send("Error connecting to DB");
            return;
        }

        console.log("After connection");

        var sql_query = "select * from employees"

        connection.execute(sql_query, {}, { outFormat: oracledb.OBJECT },
            function (error, result) {
                if (error) {
                    console.error(error.message);
                    response.status(500).send("Error getting data from DB");
                    doRelease(connection);
                    return;
                }
                
                var employees = [];

                result.rows.forEach(function (element) {
        
                    employees.push({
                        employee_id: element.EMPLOYEE_ID,
                        last_name: element.LAST_NAME,
                        first_name: element.FIRST_NAME,
                        salary: element.SALARY,
                        hire_date: element.HIRE_DATE,
                        department_id: element.DEPARTMENT_ID
                    });
                }, this);

                doRelease(connection);

                console.log("Got employees data");
                res.render("html/index", { ui_employees: employees });
            });
    });
});

app.listen(port, function(error) {
    if (error) {
        console.log("Something went wrong!", error);
    }
    else {
        console.log("Server is on port " + port);
    }
});