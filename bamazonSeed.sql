DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
	item_id INTEGER NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(50) NULL,
	department_name VARCHAR(50) NULL,
	price DECIMAL(10,2) NULL,
	stock_quantity INTEGER(10) NULL,
	PRIMARY KEY(item_id)
);

SELECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES	("MacBook Air", "Electronics", 500.00, 20),
        ("Nintendo Switch", "Electronics", 300.00, 25),
        ("Litter Robot", "Pet Supplies", 250.00, 10),
        ("Pet Gate", "Household Items", 60.00, 30),
        ("TARDIS Painting", "Household Items", 120.00, 5),
        ("Beard Oil", "Personal Care", 20.00, 50),
        ("Marshall", "Pet", 50.00, 10),
        ("Gandalf", "Pet", 250.00, 2),
        ("Beard Balm", "Personal Care", 25.00, 50),
        ("Cat Litter", "Pet Supplies", 30.00, 50);

				