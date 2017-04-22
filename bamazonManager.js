var mysql = require("mysql");
var inquirer = require("inquirer");
var configs = require("./configs.js");

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
    console.log("connected as id " + connection.threadId);
    //console.log(connection);
});

start();

function start()
{
    var choices = ["View Products for Sale",
                    "View Low Inventory",
                    "Add to Inventory",
                    "Add New Product",
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
        case "View Products for Sale" : viewProducts();
        break;

        case "View Low Inventory" : viewLowInventory();
        break;

        case "Add to Inventory" : addInventory();
        break;

        case "Add New Product" : addProduct();
        break;

        case "Exit" : exit();
        break;

        default:
        console.log("I don't even know whow you got here...");
        }
    });
}

function viewProducts()
{
    connection.query("SELECT * FROM products", function(err, res)
    {
        if(err) throw err;
        //console.log(JSON.stringify(res, null, 2));
        res.forEach(function(value)
        {
            console.log("item_id: " + value.item_id);
            console.log("product name: " + value.product_name);
            console.log("department: " + value.department_name);
            console.log("price: " + value.price);
            console.log("amount left: " + value.stock_quantity);
            console.log("==========================================================\n");
        })
        start();
        //console.log(items);
    });
}

function viewLowInventory()
{
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res)
    {
        if(err) throw err;
        //console.log(JSON.stringify(res, null, 2));
        console.log("here are the low stock items: ")
        res.forEach(function(value)
        {
            console.log("This item is low: ")
            console.log("item_id: " + value.item_id);
            console.log("product name: " + value.product_name);
            console.log("department: " + value.department_name);
            console.log("price: " + value.price);
            console.log("amount left: " + value.stock_quantity);
            console.log("==========================================================\n");
           
        })
         start();
        //console.log(items);
    });
}

function addInventory()
{
    console.log("in add inventory");
    inquirer.prompt([
    {
        type: "input", 
        name: "itemID",
        message: "What item ID do you want to update?"
    },
    {
        type: "input",
        name: "quantity",
        message: "How much do you want to add?"
    }
    ]).then(function(result)
    {
        var oldQuantity;
        connection.query("SELECT stock_quantity FROM products WHERE item_id = "+result.itemID, function(err, res)
        {
        if(err) throw err;
        oldQuantity = res[0].stock_quantity; 
        var query = "UPDATE products Set ? Where ?";
        var newQuantity = oldQuantity+parseInt(result.quantity);
        var changes = [{stock_quantity: newQuantity}, {item_id: parseInt(result.itemID)}]
        console.log(changes);
        connection.query(query, changes, function(err, res)
        {
            if(err) throw err;
            console.log("You have added inventory");
        });
        start();
        });
        
    }); 
}

function addProduct()
{
    console.log("in add product");
    inquirer.prompt([
    {
        type: "input", 
        name: "itemName",
        message: "What is the name of the new item?"
    },
    {
        type: "input",
        name: "itemDept",
        message: "What department is the new item under?"
    },
    {
        type: "input", 
        name: "itemPrice", 
        message: "What is the price of the new item?"
    }, 
    {
        type: "input",
        name: "itemStock",
        message: "What is the inital stock for this item?"
    }
    ]).then(function(result)
    {
        console.log(result);
        var input = [{product_name: result.itemName, department_name: result.itemDept, price: parseFloat(result.itemPrice), stock_quantity: parseInt(result.itemStock)}];
        console.log(input);
        var query = "INSERT INTO products SET ?";
        connection.query(query, input, function(err, res)
        {
            if(err) throw err;
            console.log("successfully added " + result.itemName + " to store inventory.");
            start();
        });
    });
}

function exit()
{
    connection.end();
    return;
}