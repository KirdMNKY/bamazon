var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazonDB"
});

connection.connect(function(err){
    if(err) throw err;
    displayItems();
    runBuy();
});

function displayItems(){
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res){
        for(var i = 0; i < res.length; i++){
            console.log("\n--------------------------------------------------------------------------------\n" + `${res[i].item_id} )\t` + formatText(res[i].product_name) + " || " + formatText(res[i].department_name) + " || " + `${res[i].price} \t|| ${res[i].stock_quantity}
            `  
            );
        }
    });
}

function formatText(text){
    var len = text.length;
    var totalLen = 20-len;
    var newText = text;
    var spacer = " ";
    for(var i =0; i < totalLen; i++){
        spacer += "\x20";
    }
    return newText + spacer;
        
}

function runBuy(){
    inquirer.prompt({
        type: "list",
        message: "Would you like to POST or BID: ",
        name: "postBid",
        choices: ["POST", "BID"]
    }).then(function(err, res){
        switch(res){
            case "POST":
                postItem();
            break;
            case "BID":
                postBid();
            break;
        }
    });
}

function postItem(){
    inquirer.prompt([
        //maybe get dept names
        {
            type: "input",
            message: "What is the name of the item: ",
            name: "itemName"
        },
        {
            type: "list",
            message: "Choose a category for your item: ",
            name: "itemCat",
            choices: ["Electronics", "Pet Supplies", "Household Items", "Pet", "Personal Care"]
        },
        {
            type: "input",
            message: "How much will you sell it for: ",
            name: "itemPrice"
        },
        {
            type: "input",
            message: "How many will you sell: ",
            name: "itemAmt"
        }
    ]).then(function(res){
        //get info from prompt
        var itemName = res.itemName;
        var itemCat = res.itemCat;
        var itemPrice = res.itemPrice;
        var itemAmt = res.itemAmt;

        //query
        connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity VALUES (?, ?, ?, ?",[itemName, itemCat, itemPrice, itemAmt], function(err, res){
            if(err) throw err;
            //show item info and full list
            console.log("Your item has been added as " + itemName + ".");
        });

    });
}

function postBid(){
    inquirer.prompt([
        {
            type: "input",
            message: "What item number would you like to BID on: ",
            name: "itemBid"
        }
    ]).then(function(res){
        var itemNum = res.itemBid;
        connection.query("SELECT ? FROM products",[itemNum] , function(err, ans){
            if(err) throw err;
            inquirer.prompt([
                {
                type: "input",
                message: "How much would you like to BID: ",
                name: "bidAmt"
                }
            ]).then(function(res){
                //check if bidAmt > or < current bid
                if(res.bidAmt > ans.price)
                {
                    connection.query("UPDATE price FROM products WHERE price=" + ans.price, function(err, res){
                        if(err) throw err;
                        console.log("You have the high bid now");
                    });
                }else{
                    console.log("Your bid is not high enough.");
                }
            });
        });
    });
}