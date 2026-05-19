// ✅ Genesys Config
const clientConfig = {
    clientIds: {
        'usw2.pure.cloud': '226182a8-bb53-435b-bc3c-2140f077768f'
    }
};

// ✅ Load CRM data
document.addEventListener("DOMContentLoaded", loadCustomers);

function getCustomers() {
    return JSON.parse(localStorage.getItem("customers")) || [];
}

function saveCustomers(customers) {
    localStorage.setItem("customers", JSON.stringify(customers));
}

function addCustomer() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;

    if (!name || !email || !phone) {
        alert("Fill all fields");
        return;
    }

    let customers = getCustomers();
    customers.push({ name, email, phone });
    saveCustomers(customers);

    loadCustomers();
}

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

        row.insertCell(3).innerHTML =
            `<button onclick="deleteCustomer(${index})">Delete</button>`;
    });
}

function deleteCustomer(index) {
    let customers = getCustomers();
    customers.splice(index, 1);
    saveCustomers(customers);
    loadCustomers();
}
