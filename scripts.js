// Mock user data for demonstration
const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123', favorites: [] }
];

let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

const products = [
    { id: 1, name: "Pizza", price: 9.99, category: "Fast Food" },
    { id: 2, name: "Burger", price: 5.99, category: "Fast Food" },
    { id: 3, name: "Sushi", price: 14.99, category: "Japanese" },
    { id: 4, name: "Pasta", price: 7.99, category: "Italian" }
];

const cart = JSON.parse(localStorage.getItem('cart')) || [];

function renderProducts(filter = '') {
    const productContainer = document.getElementById('product-list');
    if (!productContainer) return; // Ensure the element exists before proceeding
    productContainer.innerHTML = '';
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(filter.toLowerCase()) || 
        product.category.toLowerCase().includes(filter.toLowerCase())
    );
    filteredProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        if (cart.some(item => item.id === product.id)) {
            productElement.classList.add('added');
        }
        productElement.innerHTML = `
            <div class="added-to-cart">✔</div>
            <img src="" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
            <button onclick="toggleFavorite(${product.id})" class="favorite-btn">${currentUser?.favorites.includes(product.id) ? 'Remove from Favorites' : 'Add to Favorites'}</button>
        `;
        productContainer.appendChild(productElement);
    });
}

function renderCart() {
    const cartContainer = document.getElementById('cart-items');
    if (!cartContainer) return; // Ensure the element exists before proceeding
    cartContainer.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <p>${item.name} - $${item.price.toFixed(2)} x ${item.quantity}</p>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartContainer.appendChild(cartItem);
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    renderProducts(document.getElementById('search')?.value || '');
    renderCart();
}

function removeFromCart(productId) {
    const cartIndex = cart.findIndex(item => item.id === productId);
    if (cart[cartIndex].quantity > 1) {
        cart[cartIndex].quantity -= 1;
    } else {
        cart.splice(cartIndex, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    renderProducts(document.getElementById('search')?.value || '');
    renderCart();
}

function toggleFavorite(productId) {
    if (!currentUser) {
        alert('Please login to add to favorites');
        return;
    }
    const favoriteIndex = currentUser.favorites.indexOf(productId);
    if (favoriteIndex > -1) {
        currentUser.favorites.splice(favoriteIndex, 1);
    } else {
        currentUser.favorites.push(productId);
    }
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    renderProducts(document.getElementById('search')?.value || '');
}

function handleLogin(email, password) {
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'products.html';
    } else {
        alert('Invalid email or password');
    }
}

function handleSignup(name, email, password) {
    const user = { id: users.length + 1, name, email, password, favorites: [] };
    users.push(user);
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    window.location.href = 'products.html';
}

document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    handleLogin(email, password);
});

document.getElementById('signup-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    handleSignup(name, email, password);
});

document.getElementById('search')?.addEventListener('input', (e) => {
    renderProducts(e.target.value);
});

document.getElementById('checkout-btn')?.addEventListener('click', () => {
    alert('Checkout functionality not implemented');
});

document.getElementById('contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Form submitted');
});

document.getElementById('donate-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const foodType = document.getElementById('food-type').value;
    const quantity = document.getElementById('quantity').value;
    const expiry = document.getElementById('expiry').value;
    const location = document.getElementById('location').value;

    // Save donation details to localStorage for use on the next page
    localStorage.setItem('donationDetails', JSON.stringify({ foodType, quantity, expiry, location }));

    // Redirect to the page where the user can select organizations or charities
    window.location.href = 'organizations.html';
});



document.addEventListener('DOMContentLoaded', () => {
    renderOrganizations();
});

function renderOrganizations() {
    const organizationsContainer = document.getElementById('organizations-list');
    if (!organizationsContainer) return; // Ensure the element exists before proceeding
    organizationsContainer.innerHTML = '';

    // Retrieve donation details from localStorage
    const donationDetails = JSON.parse(localStorage.getItem('donationDetails'));
    if (!donationDetails) return; // Exit if donation details are not found

    // Example organizations data (mock data)
    const organizations = [
        { name: 'Charity A', contact: '123-456-7890', location: 'City A', readyToPickup: 'Weekdays', reward: '10% off coupon' },
        { name: 'Charity B', contact: '987-654-3210', location: 'City B', readyToPickup: 'Anytime', reward: '20 coins' },
        { name: 'Charity C', contact: '555-123-4567', location: 'City C', readyToPickup: 'Weekends', reward: 'Free meal voucher' }
    ];

    organizations.forEach(org => {
        const orgCard = createOrganizationCard(org);
        organizationsContainer.appendChild(orgCard);
    });
}

function createOrganizationCard(organization) {
    const orgCard = document.createElement('div');
    orgCard.classList.add('organization-card');
    orgCard.innerHTML = `
        <h3>${organization.name}</h3>
        <p>Contact: ${organization.contact}</p>
        <p>Location: ${organization.location}</p>
        <p>Ready to Pickup: ${organization.readyToPickup}</p>
        <p>Reward: ${organization.reward}</p>
        <button onclick="donateToOrganization('${organization.name}')">Donate</button>
    `;
    return orgCard;
}

function donateToOrganization(orgName) {
    // Implement donation process here
    alert(`Thank you for choosing ${orgName} for your donation!`);
}



renderProducts();
renderCart();
