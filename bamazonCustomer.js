// Initializes the npm packages used/ Shows the npm packages we are requiring. By putting the work "require" it tells node that when I run npm install that node needs to use those packages. This is saying I require to have both mysql and inquirer in my appicalation. The inquirer package is important because it helps create the prompts. The mysql helps my terminal communicate with the database. 

var mysql = require("mysql");
var inquirer = require("inquirer");


// Initializes the connection variable to sync with a MySQL database. This is the code that has the actual connection take place. The mysql package is what allows me to connect to the actual database. Setting up the paramenters for the connection. It is not actually where the conncection takes place. 
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password // bamazon is my database name 
  password: "root",
  database: "bamazon" 
});

// Creates the connection with the server and loads the product data upon a successful connection. Connection.connect is the command to connect... it's a built in function. Below says that in the chance the server does not connect to notify us with an error. With-out this the console would not show an error. If I don't connect throw an error are lines 23-26. On line 27 it says once I connect evoke the funciton of loadProducts. Evoke means to make the funciton happen. 
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
  }
  loadProducts();
});

// Function to load the products table from the database and print results to the console
function loadProducts() {
  // Selects all of the data from the MySQL products table. A query is a request you are making to your database. Once the connection to the database take place the connection.query is stating that a request is going to be made to the database. In the code below it is stating to select all (*) from the table name. In this example the table name is "products". The code below makes the entire table from mySQL show in the terminal . 
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    // Draw the table in the terminal using the response. If there is not an error (err) throw an error... above... below is if no error console the result... (res)
    console.table(res);

    // Then prompt the customer for their choice of product, pass all the products to promptCustomerForItem. After the table loads the code below is invoking the function "promptCustomerForItem". 
    promptCustomerForItem(res);
  });
}

// Prompt the customer for a product ID
function promptCustomerForItem(inventory) {
  // Prompts user for what they would like to purchase
  inquirer
    .prompt([
      {
        type: "input",
        name: "choice",
        message: "What is the ID of the item you would you like to purchase? [Quit with Q]",
        validate: function(val) {
          return !isNaN(val) || val.toLowerCase() === "q";
        }
      }
    ])
    .then(function(val) {
      // Check if the user wants to quit the program
      checkIfShouldExit(val.choice);
      var choiceId = parseInt(val.choice);
      var product = checkInventory(choiceId, inventory);

      // If there is a product with the id the user chose, prompt the customer for a desired quantity
      if (product) {
        // Pass the chosen product to promptCustomerForQuantity
        promptCustomerForQuantity(product);
      }
      else {
        // Otherwise let them know the item is not in the inventory, re-run loadProducts
        console.log("\nThat item is not in the inventory.");
        loadProducts();
      }
    });
}

// Prompt the customer for a product quantity
function promptCustomerForQuantity(product) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "quantity",
        message: "How many would you like? [Quit with Q]",
        validate: function(val) {
          return val > 0 || val.toLowerCase() === "q";
        }
      }
    ])
    .then(function(val) {
      // Check if the user wants to quit the program
      checkIfShouldExit(val.quantity);
      var quantity = parseInt(val.quantity);

      // If there isn't enough of the chosen product and quantity, let the user know and re-run loadProducts
      if (quantity > product.stock_quantity) {
        console.log("\nInsufficient quantity!");
        loadProducts();
      }
      else {
        // Otherwise run makePurchase, give it the product information and desired quantity to purchase
        makePurchase(product, quantity);
      }
    });
}

// Purchase the desired quantity of the desired item
function makePurchase(product, quantity) {
  connection.query(
    "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
    [quantity, product.item_id],
    function(err, res) {
      // Let the user know the purchase was successful, re-run loadProducts
      console.log("\nSuccessfully purchased " + quantity + " " + product.product_name + "'s!");
      loadProducts();
    }
  );
}

// Check to see if the product the user chose exists in the inventory
function checkInventory(choiceId, inventory) {
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].item_id === choiceId) {
      // If a matching product is found, return the product
      return inventory[i];
    }
  }
  // Otherwise return null
  return null;
}

// Check to see if the user wants to quit the program
function checkIfShouldExit(choice) {
  if (choice.toLowerCase() === "q") {
    // Log a message and exit the current node process
    console.log("Goodbye!");
    process.exit(0);
  }
}
