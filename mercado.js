let itemsList = [];

let htmlGenerator = (arrayItems) => {

    let result = "";
    let container1 = document.getElementById("container1");
    arrayItems.forEach((item, index) => {

        let variable = `
<div id="${item.id}" class="card column is-full-mobile is-one-quarter-desktop draggable alignProduct" draggable="true" data-name="${item.name}" data-price="${item.price}">
    <div class="card-image">
      <figure class="image is-4by3">
        <img
          src="${item.image}"
          alt="Placeholder image"
        />
      </figure>
    </div>
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="title is-4">${item.name}</p>
        </div>
      </div>
      <div class="content">
        ${item.description} ${item.price}
      </div>
    </div>
  </div>
</div>
</div> `
        result += variable;
    });
    container1.innerHTML = result;

    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
        const modal = $trigger.dataset.target;
        const $target = document.getElementById(modal);

        $trigger.addEventListener('click', () => {
            openModal($target);
        });
    });

    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
        const $target = $close.closest('.modal');

        $close.addEventListener('click', () => {
            closeModal($target);
        });
    });

    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
        if (event.key === "Escape") {
            closeAllModals();
        }
    });

    itemsList.forEach((product) => {
        document.getElementById(product.id).addEventListener("click", () => {
            modalBody(product.id);
        });
    });

    const draggables = document.querySelectorAll('.draggable');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('is-dragging');
        });

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('is-dragging');
        });
    });


}




// MODAL FUNCTIONS
function openModal($el) {
    $el.classList.add('is-active');
}

function closeModal($el) {
    $el.classList.remove('is-active');
}

function closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
        closeModal($modal);
    });
}


const noProductsFound = () => {
    const noProducts = document.getElementById("noProducts");
    const products = document.getElementById("products");

    products.classList.add("hidden");
    noProducts.classList.add("is-flex");
}

//EJECUTA LUEGO DE CARGADO EL HTML, ASEGURA PODER HACER document.[funcionParaObtenerElemento/s] dado que se agregan elementos
document.addEventListener('DOMContentLoaded', () => {
    htmlGenerator(itemsList);

    const cart = document.getElementById('cart');

    cart.addEventListener('dragover', e => {
        e.preventDefault();
        cart.classList.add('drag-over');
    });

    cart.addEventListener('dragleave', () => {
        cart.classList.remove('drag-over');
    });

    cart.addEventListener('drop', e => {
        e.preventDefault();
        cart.classList.remove('drag-over');

        const draggable = document.querySelector('.is-dragging');
        const itemName = draggable.getAttribute('data-name');
        const itemPrice = draggable.getAttribute('data-price');
        const itemElement = document.createElement('div');
        itemElement.className = 'card';
        itemElement.innerHTML = `
                <div class="card-content">
                    <p class="title">${itemName}</p>
                    <p class="content">${itemPrice}</p>
                </div>
            `;
        cart.appendChild(itemElement);
    });
});


let filterByName = (text) => {
    const products = document.getElementById("products");
    products.classList.remove("hidden");
    const noProducts = document.getElementById("noProducts");
    noProducts.classList.remove("is-flex");

    const inputText = text.toLowerCase();
    if (!inputText) {
        htmlGenerator(itemsList);
    } else {
        const filteredProducts = itemsList.filter((item) => {
            return item.name.toLowerCase().includes(inputText);
        });
        if (filteredProducts.length > 0) {
            htmlGenerator(filteredProducts);
        } else {
            noProductsFound();
        }
    }
};


const orderByPrice = (order) => {
    let auxList = [...itemsList];
    switch (order) {
        case "lowPrice":
            auxList.sort((a, b) => a.price - b.price);
            break;

        case "highPrice":
            auxList.sort((a, b) => b.price - a.price);
            break;
    }
    htmlGenerator(auxList);
};

const createProduct = () => {
    let name = document.getElementById("name").value;
    let description = document.getElementById("description").value;
    let image = document.getElementById("image").value;
    let price = document.getElementById("price").value;
    let category = document.getElementById("category").value;

    let newProduct = {
        id: itemsList.length + 1,
        name: name,
        description: description,
        image: image,
        price: price,
        category: category
    }

    addTask(newProduct);

    document.getElementById("name").value = '';
    document.getElementById("description").value = '';
    document.getElementById("image").value = '';
    document.getElementById("price").value = '';
    document.getElementById("category").value = 'electrónica';

    closeModal(document.getElementById("modal-create-product"));
}

const modalBody = (productId) => {
    console.log(productId);
    const item = itemsList.find(item => item.id == parseInt(productId));
    console.log(item);
    const modalTitle = document.getElementById("ModalTitle");
    const modalDescription = document.getElementById("ModalDescription");
    const modalImage = document.getElementById("modalImage");
    document.getElementById("modal-create-product")["data-product-id"] = item.id;

    modalTitle.innerHTML = item.name;
    modalDescription.innerHTML = item.description + " " + item.price;
    modalImage.src = item.image;
    document.getElementById("modal-js-example").classList.add('is-active');
    document.getElementById('edit-button').addEventListener('click', () => openEditModal(item));
};

const orderProducts = document.getElementById("orderProducts");
const inputText = document.getElementById("input1");
const save = document.getElementById("save");
const deleteButton = document.getElementById("delete-button");

deleteButton.addEventListener("click", (e) => {
    const deleteItemId = document.getElementById("modal-create-product")["data-product-id"];
    deleteTask(deleteItemId);
});


inputText.addEventListener("input", () => {
    filterByName(inputText.value);
});

orderProducts.addEventListener("change", () => {
    orderByPrice(orderProducts.value);
});

save.addEventListener("click", createProduct);


document.getElementById('categorySelect').addEventListener('change', function () {
    const selectedCategory = this.value;
    filterProductsByCategory(selectedCategory);
});

function filterProductsByCategory(category) {
    let filteredItems;
    if (category === 'todo') {
        filteredItems = itemsList;
    } else {
        filteredItems = itemsList.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }
    htmlGenerator(filteredItems);
}


const getTasks = async () => {
    try {
        const response = await fetch("http://localhost:3000/api/products");
        if (response.ok) {
            const jsonResponse = await response.json();
            itemsList = jsonResponse;
            htmlGenerator(jsonResponse);
        }
    } catch (error) {
        console.error(error);
    }
};

getTasks();

const addTask = async (producto) => {
    try {
        const response = await fetch("http://localhost:3000/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(producto),
        });
        if (response.ok) {
            const newProduct = await response.json();
            console.log(newProduct);
            itemsList.push(newProduct);
            htmlGenerator(itemsList);
        }
    } catch (error) {
        console.log(error)
    }
};

const deleteTask = async (idProdcut) => {
    try {
        const response = await fetch(`http://localhost:3000/api/products/${idProdcut}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            itemsList = itemsList.filter(item => item.id !== idProdcut);
            htmlGenerator(itemsList);
        }
    } catch (error) {
        console.log(error)
    }
}

const openEditModal = (product) => {
    document.getElementById('edit-name').value = product.name;
    document.getElementById('edit-description').value = product.description;
    document.getElementById('edit-image').value = product.image;
    document.getElementById('edit-price').value = product.price;
    document.getElementById('edit-category').value = product.category;
    document.getElementById('modal-edit-product').dataset.productId = product.id;
    openModal(document.getElementById('modal-edit-product'));
};

const updateProduct = async () => {
    const id = document.getElementById('modal-edit-product').dataset.productId;
    const name = document.getElementById('edit-name').value;
    const description = document.getElementById('edit-description').value;
    const image = document.getElementById('edit-image').value;
    const price = document.getElementById('edit-price').value;
    const category = document.getElementById('edit-category').value;

    const updatedProduct = {
        name,
        description,
        image,
        price,
        category
    };

    try {
        const response = await fetch(`http://localhost:3000/api/products/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProduct),
        });

        if (response.ok) {
            const updated = await response.json();
            itemsList = itemsList.map(item => item.id === id ? updated : item);
            htmlGenerator(itemsList);
            closeModal(document.getElementById('modal-edit-product'));
        } else {
            console.error('Failed to update product');
        }
    } catch (error) {
        console.error('Error updating product:', error);
    }
};

document.getElementById('update-product').addEventListener('click', updateProduct);