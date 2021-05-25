interface SearchForm {
    title: string;
    amount: number;
    color: string;
}

SELECT * FROM PRODUCT WHERE title = :title AND price = :price

name, price, color, ...
