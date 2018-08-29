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
    runBuy();
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
    }).then(function(res){
        console.log(res.postBid);
        var userResp = res.postBid;
        switch(userResp){
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
        connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)",[itemName, itemCat, parseFloat(itemPrice), parseInt(itemAmt)], function(err, res){
            if(err) throw err;
            //show item info and full list
            console.log("Your item has been added as " + itemName + ".");
            displayItems();
        });

    });
}

function postBid(){
    console.log("postBid run");
    inquirer.prompt([
        {
            type: "input",
            message: "What item number would you like to BID on: ",
            name: "itemBid"
        }
    ]).then(function(res){
        console.log(res.itemBid);
        var itemNum = res.itemBid;
        connection.query("SELECT ? FROM products",[itemNum] , function(err, ans){
            if(err) throw err;
            //Function to get amount
            getBidAmt(itemNum);
        });

    });
}

function getBidAmt(itemNum){
    inquirer.prompt([
        {
        type: "input",
        message: "How much would you like to BID: ",
        name: "bidAmt"
        }
    ]).then(function(ans){
        //check if bidAmt > or < current bid
        connection.query("SELECT price FROM products WHERE item_id=" + itemNum + ";", function(err, res){
        if(err) throw err;
        console.log(ans.bidAmt + " / " + res[0].price);
        if(parseFloat(ans.bidAmt) > parseFloat(res[0].price))
        {
            console.log("You have the high bid on item number " +  itemNum + " .");
            //change the bid
            var query = "UPDATE products SET price=? WHERE item_id=" + itemNum;
            connection.query(query, [parseFloat(ans.bidAmt)], function(err, res){
                console.log()
                displayItems();
            });
        }else{
            console.log("Your bid is not high enough.");
            displayItems();
        }
    });
})
 
}
