// ✅ Genesys Cloud configuration
const clientConfig = {
    clientIds: {
        'usw2.pure.cloud': '226182a8-bb53-435b-bc3c-2140f077768f'
    }
};

// Example: Initialize Genesys Embeddable Framework (if used)
if (window.PureCloud) {
    PureCloud.subscribe('App.ready', function () {
        console.log("Genesys App Ready");

        PureCloud.addConfig({
            clientConfig: clientConfig
        });
    });
}

// ✅ Load existing customers
document.addEventListener("DOMContentLoaded", loadCustomers);

function getCustomers() {
    return JSON.parse(localStorage.getItem("customers")) || [];
}

function saveCustomers(customers) {
    localStorage.setItem("customers", JSON.stringify(customers));
}

// ✅ Add customer
function addCustomer() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;

    if (name === "" || email === "" || phone === "") {
        alert("Please fill all fields");
        return;
    }

    let customers = getCustomers();
    customers.push({ name, email, phone });
    saveCustomers(customers);

    clearFields();
    loadCustomers();
}

// ✅ Load customers into table
function loadCustomers() {
    let table = document.getElementById("customerTable");

    table.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Action</th>
        </tr>
    `;

    let customers = getCustomers();

    customers.forEach((cust, index) => {
        let row = table.insertRow();

        row.insertCell(0).innerText = cust.name;
        row.insertCell(1).innerText = cust.email;
        row.insertCell(2).innerText = cust.phone;

        let actionCell = row.insertCell(3);
        actionCell.innerHTML = `
            <button onclick="deleteCustomer(${index})">Delete</button>
        `;
    });
}

// ✅ Delete customer
function deleteCustomer(index) {
    let customers = getCustomers();
    customers.splice(index, 1);
    saveCustomers(customers);
    loadCustomers();
}

// ✅ Clear input fields
function clearFields() {
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";
}
``
