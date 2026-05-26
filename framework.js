// NAVIGATION
document.querySelectorAll('.sb-item').forEach(item => {
  item.onclick = () => {
    document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + item.dataset.page).classList.add('active');
  };
});


// SAMPLE DATA
let contacts = [
  {name: "Ravi", company: "TCS"},
  {name: "Meena", company: "Infosys"}
];

// RENDER CONTACTS
function renderContacts() {
  const tbody = document.getElementById('contactTbody');
  tbody.innerHTML = '';

  contacts.forEach(c => {
    tbody.innerHTML += `<tr><td>${c.name}</td><td>${c.company}</td></tr>`;
  });
}

renderContacts();


// CHART
const ctx = document.getElementById('revChart');

new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Jan','Feb','Mar'],
    datasets: [{
      data: [10,20,30],
      borderColor: '#3b82f6'
    }]
  }
});
