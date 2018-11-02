// DROP DATABASE IF EXISTS bamazonDB;
// CREATE database bamazonDB;

// USE bamazonDB; 

// CREATE TABLE products (
//   item_id INTEGER AUTO_INCREMENT NOT NULL,
//   product_name VARCHAR(100) NULL,
//   department_name VARCHAR(100) NULL,
//   price INTEGER (10) NULL,
//   stock_quanity INTEGER (200) NULL,
//   PRIMARY KEY (item_id)
// );



// Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
// The app should then prompt users with two messages.



// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.

var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazonDB"
});

connection.connect(function(err) {
    if (err) throw err;
    start();
  });

  function start() {
    inquirer
      .prompt({
        name: "item-choice",
        type: "rawlist",
        message: "What would you like to buy?",
        choices: ["Milk", "Eggs","Flour", "Sugar", "Butter"]
      })
      .then(function(answer) {
        inquirer
        .prompt({
          name: "item-choice",
          type: "rawlist",
          message: "How many items would you like?",
          choices: function (){
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].item_name);
          }
          return choiceArray; 
        }
      });
    }
    };