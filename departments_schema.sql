use Bamazon;

Create table departments(
    department_id int not null auto_increment, 

    department_name varchar(50) not null,

    over_head_costs double(10,2) not null,

    total_sales double(20,2) not null,
    primary key (department_id)
    );
    
    insert into departments(department_name, over_head_costs, total_sales) values 
    ("grocery", 4, 0), ("electronics", 2, 0);
