const socket = io();

let btn = document.getElementById("updateButton")
btn.onclick = () => {
    socket.emit("update",true)
}

socket.on('realTimeProducts', (products)=>{

    let productListDiv = document.getElementById("productList")
    let content = ''
    for (let i = 0; i < products.length; i++) {
        let {title, id, description,stock,code,category,price,status} = products[i]
        content += `<li>
                    <h6>${title}</h6>
                    <p>ID: ${id}</p>
                    <p>Description: ${description}</p>
                    <p>Stock: ${stock}</p>
                    <p>Code: ${code}</p>
                    <p>Category ${category}</p>
                    <p>Price: ${price}</p>
                    <p>Status: ${status}</p>
                </li>`
    }
    productListDiv.innerHTML = content

})

