// Fetch restaurant data
let restaurantData = {};

async function fetchData() {
    try {
        const response = await fetch('data.json');
        restaurantData = await response.json();
        renderRestaurantCards();
        setupFilters();
    } catch (error) {
        console.error('Error loading restaurant data:', error);
    }
}

// Function to render restaurant cards
function renderRestaurantCards() {
    const grid = document.querySelector('.restaurant-grid');
    grid.innerHTML = ''; // Clear existing cards
    
    Object.entries(restaurantData).forEach(([id, restaurant]) => {
        const card = document.createElement('div');
        card.className = 'restaurant-card';
        card.onclick = () => showDetails(id);
        
        card.innerHTML = `
            <h2>${restaurant.name}</h2>
            <p class="style">${restaurant.style}</p>
            <p class="corkage">Corkage: ${restaurant.corkageFee}</p>
        `;
        
        grid.appendChild(card);
    });
}

// Setup filter buttons
function setupFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    
    buttons.forEach(button => {
        // Remove any existing event listeners
        button.removeEventListener('click', handleFilterClick);
        // Add new event listener
        button.addEventListener('click', handleFilterClick);
    });
}

// Handle filter button clicks
function handleFilterClick(e) {
    const buttons = document.querySelectorAll('.filter-btn');
    
    buttons.forEach(button => {
        // Remove active class from all buttons
        buttons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        e.target.classList.add('active');
        
        const selectedArea = e.target.dataset.area;
        const cards = document.querySelectorAll('.restaurant-card');
        
        cards.forEach(card => {
            const restaurantId = card.getAttribute('onclick').match(/'(.*?)'/)[1];
            const restaurant = restaurantData[restaurantId];
            
            if (selectedArea === 'all' || restaurant.area === selectedArea) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', fetchData);

function showDetails(restaurantId) {
    const restaurant = restaurantData[restaurantId];
    const modal = document.getElementById('restaurantDetails');
    const content = document.getElementById('modalContent');
    
    content.innerHTML = `
        <h2>${restaurant.name}</h2>
        <div class="restaurant-details">
            <span class="detail-label">Corkage Fee:</span>
            <span>${restaurant.corkageFee}</span>
            
            <span class="detail-label">Address:</span>
            <span>${restaurant.address}</span>
            
            <span class="detail-label">Postcode:</span>
            <span>${restaurant.postcode}</span>
            
            <span class="detail-label">Contact:</span>
            <span>${restaurant.contact}</span>
            
            <span class="detail-label">Style:</span>
            <span>${restaurant.style}</span>
            
            <span class="detail-label">Website:</span>
            <span><a href="${restaurant.website}" class="website-link" target="_blank">${restaurant.website}</a></span>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Modal functions
function closeDetails() {
    document.getElementById('restaurantDetails').style.display = 'none';
}

function openSuggestionModal() {
    document.getElementById('suggestionModal').style.display = 'block';
}

function closeSuggestionModal() {
    document.getElementById('suggestionModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const detailsModal = document.getElementById('restaurantDetails');
    const suggestionModal = document.getElementById('suggestionModal');
    if (event.target === detailsModal || event.target === suggestionModal) {
        detailsModal.style.display = 'none';
        suggestionModal.style.display = 'none';
    }
}

// Expose functions to window object for HTML onclick attributes
window.showDetails = showDetails;
window.closeDetails = closeDetails;
window.openSuggestionModal = openSuggestionModal;
window.closeSuggestionModal = closeSuggestionModal;

// Form submission handler
document.getElementById('suggestionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const restaurantName = document.getElementById('restaurantName').value;
    let website = document.getElementById('website').value;
    const corkage = document.getElementById('corkage').value;
    
    // Add https:// if no protocol is specified
    if (website && !website.startsWith('http://') && !website.startsWith('https://')) {
        website = 'https://' + website;
    }
    
    // Create form data
    const formData = new FormData();
    formData.append('entry.648641937', restaurantName);
    formData.append('entry.1146551704', website);
    formData.append('entry.401103829', corkage);
    
    // Submit to Google Form
    fetch('https://docs.google.com/forms/u/0/d/e/1FAIpQLSdCTlbrDc3I1dgKsh0318ZYgo0CrjSVevpBZJhyBJZzJYbpGw/formResponse', {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
    })
    .then(response => {
        // Clear form
        document.getElementById('suggestionForm').reset();
        
        // Close modal
        closeSuggestionModal();
        
        // Show success message
        alert('Thank you for your suggestion!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error submitting your suggestion. Please try again.');
    });
});