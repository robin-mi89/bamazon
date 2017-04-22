Create database Bamazon;

use Bamazon;

Create table products(
item_id int not null auto_increment, 
product_name varchar(50) not null,
department_name varchar(100) null,
price double(10, 2) not null,
stock_quantity int not null,
primary key (item_id)
);

insert into Bamazon.products(product_name, department_name, price, stock_quantity) values
("bananas", "grocery", 1.99, 100), ("cola", "grocery", 0.99, 200), ("gtx 1080", "electronics", 500.00, 20), 
("x-wing miniature", "hobby", 15.00, 20), ("javascript the good parts", "books", 60.00, 30), ("macbook pro", "electronics", 2250.00, 5),
("iphone", "electronics", 700.00, 25), ("bees", "garden", 3.50, 10000), ("bees?", "garden", 0.01, 50000), ("monopoly", "hobby", 20.00, 99) ;