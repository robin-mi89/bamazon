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

function start()
{
    connection.query("SELECT * FROM products", function(err, res)
    {
        if(err) throw err;
        //console.log(JSON.stringify(res, null, 2));
        var items = [];
        res.forEach(function(value)
        {
            console.log("item_id: " + value.item_id);
            console.log("product name: " + value.product_name);
            console.log("department: " + value.department_name);
            console.log("price: " + value.price);
            console.log("amount left: " + value.stock_quantity);
            console.log("total sales: " + value.product_sales);
            console.log("==========================================================\n")
            items.push(value.itemName);
        })
        //console.log(items);
        buyItem();
    });
}

function buyItem()
{
    inquirer.prompt([
    {
        type: "input", 
        name: "item",
        message: "What do you want to purchase?"
    }
    ]).then(function(result)
    {
        var itemID = result.item;
        inquirer.prompt([
            {
                type: "input", 
                name: "quantity", 
                message: "How much do you want to purchase?"
            }
        ]).then(function(value)
        {
            var quantity = parseInt(value.quantity);
            connection.query("SELECT * FROM products WHERE item_id = " + itemID, function(err, res)
            {
                console.log(res[0].stock_quantity);
                if (res[0].stock_quantity<quantity)
                {
                    console.log("insufficient quantity!");
                    askAgain();
                }
                else
                {
                    var query = "UPDATE products Set ? Where ?";
                    var new_stock = res[0].stock_quantity-quantity;
                    var new_sales = res[0].product_sales + quantity*res[0].price;
                    console.log("new stock is: " + new_stock);
                    console.log("total sales is: " + new_sales);
                    var params = [{stock_quantity: new_stock, product_sales: new_sales}, {item_id: itemID}];
                    console.log("SELECT * FROM departments WHERE department_name = '"+ res[0].department_name+"'");
                    connection.query("SELECT * FROM departments WHERE department_name = '"+ res[0].department_name+"'", function(err, data)
                    {
                        //console.log(data);
                        if (data != undefined)
                        {
                            console.log("NewTotalSales: "+ new_sales);
                            console.log(data[0].department_name);
                            connection.query("UPDATE departments SET ? WHERE department_name ='"+data[0].department_name+"'", {total_sales: new_sales});
                        }
                    });
                    connection.query(query, params, function(err, temp)
                    {
                        console.log("Your total order comes to: " + quantity*res[0].price);
                        askAgain();
                    })
                    
                }
            });
        });
    });
}

start();

function exit()
{
    connection.end();
    return;
}

function askAgain()
{
    inquirer.prompt([
            {
                type: "list", 
                name: "again", 
                message: "Do you want to purchase another item?",
                choices: ["yes", "no"]
            }
        ]).then(function(value)
        {
            if (value.again === "yes")
            {
                start();
            }
            else
            {
                exit();
            }
        })
}