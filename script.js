const API_URL = "https://jsonplaceholder.typicode.com/users";
let contacts = [];
// Get Data
async function getContacts() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    contacts = data;
    contacts = [];
    displayContacts(contacts);
  } catch (error) {
    console.log("Error: ", error);
  }
}
// Display Data
function displayContacts(data) {
  const contactList = document.getElementById("contactList");
  contactList.innerHTML = "";
  contactList.innerHTML += `<h1>Contact List</h1>`;
  data.forEach(function (contact) {
    contactList.innerHTML += `<div class="contact"><div><h5>${contact.name}</h5>
        <h5>${contact.phone}</h5></div> <div class="actions">
        <button class="edit" onclick="editContact(${contact.id})">Edit</button>
        <button class="delete" onclick="deleteContact(${contact.id})">Delete</button>
        </div></div>`;
  });
}
//  Add Data
async function addContact(name, phone) {
  try {
    const newContact = {
      name: name,
      phone: phone,
    };
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newContact),
    });
    const data = await response.json();
    const nextId =
      contacts.length > 0 ? Math.max(...contacts.map((c) => c.id)) + 1 : 1;

    data.id = nextId;
    console.log(data);
    contacts.push(data);
    displayContacts(contacts);
  } catch (error) {
    console.log("Error: ", error);
  }
}
const form = document.getElementById("contactForm");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  addContact(name, phone);
  form.reset();
});
// Delete Data
async function deleteContact(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      contacts = contacts.filter(function (contact) {
        return contact.id !== id;
      });
      displayContacts(contacts);
    }
  } catch (error) {
    console.log("Error: ", error);
  }
}

//  Edit Data
async function editContact(id) {
  const contact = contacts.find(function (contact) {
    return contact.id === id;
  });
  const newName = prompt("Enter Name: ", contact.name);
  const newPhone = prompt("Enter Phone: ", contact.phone);
  if (!newName) {
    return;
  }
  const updatedContact = {
    id: id,
    name: newName,
    phone: newPhone,
  };
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedContact),
    });
    const data = await response.json();
    console.log(data);
    contacts = contacts.map(function (contact) {
      if (contact.id === id) {
        return updatedContact;
      }
      return contact;
    });
    displayContacts(contacts);
  } catch (error) {
    console.log("Error: ", error);
  }
}
// Search Data
const searchInput = document.getElementById("search");
searchInput.addEventListener("input", function () {
  const searchValue = searchInput.value.toLowerCase();
  const filteredContacts = contacts.filter(function (contact) {
    return (
      contact.name.toLowerCase().includes(searchValue) ||
      contact.phone.toLowerCase().includes(searchValue)
    );
  });
  displayContacts(filteredContacts);
});
getContacts();
