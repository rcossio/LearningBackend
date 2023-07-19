const socket = io();

const updateProducts = (products) => {
  const productsContainer = document.querySelector('#products-container');
  productsContainer.innerHTML = '';

  products.forEach((product) => {
    const card = document.createElement('div');
    card.className = 'card';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const title = document.createElement('h5');
    title.className = 'card-title';
    title.textContent = product.title;

    const description = document.createElement('p');
    description.className = 'card-text';
    description.textContent = product.description;

    const details = document.createElement('div');
    details.className = 'row';

    const leftcol = document.createElement('div');
    leftcol.className = 'col';

    const price = document.createElement('p');
    price.className = 'card-text';
    price.textContent = `Price: ${product.price}`;

    const code = document.createElement('p');
    code.className = 'card-text';
    code.textContent = `Code: ${product.code}`;

    const rightcol = document.createElement('div');
    rightcol.className = 'col';

    const stock = document.createElement('p');
    stock.className = 'card-text';
    stock.textContent = `Stock: ${product.stock}`;

    const category = document.createElement('p');
    category.className = 'card-text';
    category.textContent = `Category: ${product.category}`;

    leftcol.appendChild(price);
    leftcol.appendChild(code);

    rightcol.appendChild(stock);
    rightcol.appendChild(category);

    details.appendChild(leftcol);
    details.appendChild(rightcol);

    cardBody.appendChild(title);
    cardBody.appendChild(description);
    cardBody.appendChild(details);

    card.appendChild(cardBody);
    productsContainer.appendChild(card);
  });
};

socket.on('initialProducts', (products) => {
  updateProducts(products);
});