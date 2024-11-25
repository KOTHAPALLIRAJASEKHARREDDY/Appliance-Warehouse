// Function to handle redirection back to the homepage or another page
function redirectToHome() {
    // Redirecting to the homepage or you can provide any URL you'd like
    window.location.href = 'https://www.yourhomepage.com';  // Replace with your actual homepage URL
}

// Function to display the correct order details based on pickup or delivery selection
function showOrderDetails(orderType) {
    // Hide both sections initially
    document.getElementById('pickup-details').style.display = 'none';
    document.getElementById('delivery-details').style.display = 'none';
    
    // Show the appropriate details based on the order type
    if (orderType === 'pickup') {
        document.getElementById('pickup-details').style.display = 'block';
    } else if (orderType === 'delivery') {
        document.getElementById('delivery-details').style.display = 'block';
    }
    
    // Always show the "Back to Homepage" button
    document.getElementById('back-home-btn').style.display = 'inline-block'; 
}

// Call showOrderDetails based on the predefined order type
// Replace 'pickup' with 'delivery' to test the delivery case
window.onload = function() {
    showOrderDetails('pickup'); // Change 'pickup' to 'delivery' based on the order type
};
