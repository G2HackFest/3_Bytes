// State management
let currentUser = null;
let authToken = localStorage.getItem('authToken');

// DOM Elements
const loginForm = document.querySelector('#login-form');
const registerForm = document.querySelector('#register-form');
const marketplace = document.querySelector('#marketplace');
const messages = document.querySelector('#messages');
const productsContainer = document.querySelector('#products-container');
const newProductForm = document.querySelector('#new-product-form');
const messageList = document.querySelector('#message-list');
const newMessageForm = document.querySelector('#new-message-form form');

// Auth button handlers
document.querySelector('#loginBtn').addEventListener('click', () => {
  loginForm.classList.remove('hidden');
  registerForm.classList.add('hidden');
});

document.querySelector('#registerBtn').addEventListener('click', () => {
  registerForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
});

document.querySelector('#logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('authToken');
  window.location.reload();
});

// Form submissions
loginForm.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.querySelector('#login-username').value;
  const password = document.querySelector('#login-password').value;

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('authToken', data.token);
      window.location.reload();
    } else {
      alert(data.error);
    }
  } catch (error) {
    alert('Error logging in');
  }
});

registerForm.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.querySelector('#register-username').value;
  const password = document.querySelector('#register-password').value;
  const role = document.querySelector('#register-role').value;

  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role })
    });

    const data = await response.json();
    if (response.ok) {
      alert('Registration successful! Please login.');
      loginForm.classList.remove('hidden');
      registerForm.classList.add('hidden');
    } else {
      alert(data.error);
    }
  } catch (error) {
    alert('Error registering');
  }
});

// Product management
async function loadProducts() {
  try {
    const response = await fetch('/api/products');
    const products = await response.json();
    
    productsContainer.innerHTML = products.map(product => `
      <div class="product-card">
        <h3>${product.name}</h3>
        <p>Price: $${product.price}</p>
        <p>Quantity: ${product.quantity}</p>
        <p>Farmer: ${product.farmer}</p>
        <p>${product.description}</p>
        <button onclick="contactFarmer('${product.farmer}')">Contact Farmer</button>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

newProductForm?.querySelector('form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.querySelector('#product-name').value;
  const price = document.querySelector('#product-price').value;
  const quantity = document.querySelector('#product-quantity').value;
  const description = document.querySelector('#product-description').value;

  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ name, price, quantity, description })
    });

    if (response.ok) {
      loadProducts();
      e.target.reset();
    } else {
      const data = await response.json();
      alert(data.error);
    }
  } catch (error) {
    alert('Error adding product');
  }
});

// Message handling
newMessageForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const to = document.querySelector('#message-to').value;
  const content = document.querySelector('#message-content').value;

  try {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ to, content })
    });

    if (response.ok) {
      loadMessages();
      e.target.reset();
    } else {
      const data = await response.json();
      alert(data.error);
    }
  } catch (error) {
    alert('Error sending message');
  }
});

async function loadMessages() {
  try {
    const response = await fetch('/api/messages', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    const messages = await response.json();
    
    messageList.innerHTML = messages.map(message => `
      <div class="message">
        <p><strong>From:</strong> ${message.from}</p>
        <p><strong>To:</strong> ${message.to}</p>
        <p>${message.content}</p>
        <small>${new Date(message.timestamp).toLocaleString()}</small>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading messages:', error);
  }
}

// Initialize app
if (authToken) {
  document.querySelector('#loginBtn').classList.add('hidden');
  document.querySelector('#registerBtn').classList.add('hidden');
  document.querySelector('#logoutBtn').classList.remove('hidden');
  marketplace.classList.remove('hidden');
  messages.classList.remove('hidden');
  loadProducts();
  loadMessages();
}

// Helper function to contact farmers
window.contactFarmer = (farmer) => {
  document.querySelector('#message-to').value = farmer;
  document.querySelector('#message-content').focus();
  messages.scrollIntoView({ behavior: 'smooth' });
};