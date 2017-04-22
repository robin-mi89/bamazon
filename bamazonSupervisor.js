var mysql = require("mysql");
var inquirer = require("inquirer");
var configs = require("./configs.js");
require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: 'root',
    password: configs.config.password,
    database: 'bamazon'
})

connection.connect(function(err)
{
    if(err) throw err;
    //console.log("connected as id " + connection.threadId);
    //console.log(connection);
});

start();

function start()
{
    var choices = ["View Product Sales by Department",
                    "Create New Department",
                    "Exit"];
    inquirer.prompt([
    {
        type: "list", 
        name: "choice",
        message: "What do you want to do?",
        choices: choices
    }
    ]).then(function(result)
    {
        switch(result.choice)
        {
        case "View Product Sales by Department" : viewSalesByDept();
        break;

        case "Create New Department" : createDept();
        break;


        case "Exit" : exit();
        break;

        default:
        console.log("I don't even know whow you got here...");
        }
    });
}

function viewSalesByDept()
{
    connection.query("SELECT * FROM departments", function(err, data)
    {
        data.forEach(function(value)
        {
            value.profits = value.total_sales-value.over_head_costs;
        })
        //console.table(data);
        start();
    });
}

function createDept()
{
    inquirer.prompt([
    {
        type: "input", 
        name: "name",
        message: "What is the department name?"
    },
    {
        type: "input", 
        name: "overhead",
        message: "What is the overhead costs?"
    }
    ]).then(function(result)
    {
        var newDept = {department_name: result.name, over_head_costs: parseFloat(result.overhead), total_sales: 0}
        //console.log(newDept);
        var query = "INSERT INTO departments SET ?";
        connection.query(query, newDept, function(err, res)
        {
            if(err) throw err;
            console.log("successfully added " + result.name + " to departments.");
            start();
        });
    });
}

function exit()
{
    connection.end();
    return;
}