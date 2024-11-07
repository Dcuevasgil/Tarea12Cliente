function getParams() {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    var params = {};
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
}

function handleSubmit(event) {
    event.preventDefault();
    const params = getParams();
    fetchData(params);
}

async function fetchData(params) {
    try {
        const response = await fetch(params.baseUrl + params.getEndpoint);
        if (response.ok) {
            const data = await response.json();
            createTable(data, params);
        } else {
            alert("Error al obtener los datos de la API.");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}

function createTable(data, params) {
    const tableContainer = document.getElementById("tableContainer");
    tableContainer.innerHTML = "";

    const table = document.createElement("table");
    const headerRow = document.createElement("tr");

    for (const key in data[0]) {
        const header = document.createElement("th");
        header.textContent = key;
        headerRow.appendChild(header);
    }

    const actionHeader = document.createElement("th");
    actionHeader.textContent = "Acciones";
    headerRow.appendChild(actionHeader);
    table.appendChild(headerRow);

    data.forEach(item => {
        const row = document.createElement("tr");
        for (const key in item) {
            const cell = document.createElement("td");
            cell.textContent = item[key];
            row.appendChild(cell);
        }

        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Editar";
        editButton.onclick = () => openEditForm(item, params);
        actionCell.appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";
        deleteButton.onclick = () => deleteProduct(item.id, params);
        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);
        table.appendChild(row);
    });

    tableContainer.appendChild(table);
}

function openEditForm(item, params) {
    const editForm = document.getElementById("editForm");
    document.getElementById("editProductName").value = item.name;
    document.getElementById("editProductPrice").value = item.price;
    editForm.dataset.productId = item.id;
    editForm.style.display = "block";  
}

function closeEditForm() {
    const editForm = document.getElementById("editForm");
    editForm.style.display = "none";  
}

async function handleEditSubmit(event) {
    event.preventDefault();
    const productId = document.getElementById("editForm").dataset.productId;
    const updatedProduct = {
        name: document.getElementById("editProductName").value,
        price: document.getElementById("editProductPrice").value,
    };

    try {
        const response = await fetch(`${getParams().baseUrl}${getParams().editEndpoint.replace("{id}", productId)}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProduct),
        });

        if (response.ok) {
            alert("Producto actualizado exitosamente.");
            closeEditForm();
            fetchData(getParams()); 
        } else {
            alert("Error al actualizar el producto.");
        }
    } catch (error) {
        console.error("Error en la solicitud de actualización:", error);
    }
}

function deleteProduct(productId, params) {
    const confirmDelete = confirm("¿Estás seguro de que quieres eliminar este producto?");
    if (confirmDelete) {
        try {
            fetch(`${params.baseUrl}${params.deleteEndpoint.replace("{id}", productId)}`, {
                method: "DELETE",
            })
                .then(response => {
                    if (response.ok) {
                        alert("Producto eliminado exitosamente.");
                        fetchData(params); 
                    } else {
                        alert("Error al eliminar el producto.");
                    }
                })
                .catch(error => {
                    console.error("Error en la solicitud de eliminación:", error);
                });
        } catch (error) {
            console.error("Error en la solicitud de eliminación:", error);
        }
    }
}

async function handleInsertSubmit(event) {
    event.preventDefault();

    const newProduct = {
        name: document.getElementById("productName").value,
        price: document.getElementById("productPrice").value,
    };

    try {
        const response = await fetch(`${getParams().baseUrl}${getParams().insertEndpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newProduct),
        });

        if (response.ok) {
            alert("Producto insertado exitosamente.");
            fetchData(getParams()); 
        } else {
            alert("Error al insertar el producto.");
        }
    } catch (error) {
        console.error("Error en la solicitud de inserción:", error);
    }
}
