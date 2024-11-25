document.addEventListener('DOMContentLoaded', function () {
    // Get radio buttons for pickup and delivery
    const pickupRadio = document.getElementById('pickup');
    const deliveryRadio = document.getElementById('delivery');
    const pickupDateContainer = document.getElementById('pickup-date-container');
    const deliveryDateContainer = document.getElementById('delivery-date-container');
    const pickupDateInput = document.getElementById('pickup-date');
    const deliveryDateInput = document.getElementById('delivery-date');

    // Get the current date and time
    const today = new Date();

    // Set the date to tomorrow for the delivery date (since today is not allowed for delivery)
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];

    // Format today's date (in case it's needed for pickup date)
    const todayDate = today.toISOString().split('T')[0];

    // Check if the current time is before 5 PM or not for pick-up date
    const currentTime = today.getHours();
    let pickupMinDate = todayDate; // Default for pickup date

    // If current time is after 5 PM, disable today's date for pick-up
    if (currentTime >= 17) {
        pickupMinDate = tomorrowDate; // Disable today's date if it's after 5 PM
    }

    // Set the 'min' attribute for the delivery date input (tomorrow's date or later)
    deliveryDateInput.setAttribute('min', tomorrowDate);

    // Set the 'min' attribute for the pick-up date input (today or tomorrow depending on time)
    pickupDateInput.setAttribute('min', pickupMinDate);

    // Function to toggle the visibility of the pick-up date input
    function togglePickupDateVisibility() {
        if (pickupRadio.checked) {
            pickupDateContainer.style.display = 'block';
            deliveryDateContainer.style.display = 'none'; // Hide delivery date
        }
        // Show the delivery date if "Delivery" is selected
        else if (deliveryRadio.checked) {
            deliveryDateContainer.style.display = 'block';
            pickupDateContainer.style.display = 'none'; // Hide pick-up date
        } else {
            // Hide both if neither is selected (initial state)
            pickupDateContainer.style.display = 'none';
            deliveryDateContainer.style.display = 'none';
        }
    }

    // Attach event listeners to radio buttons to toggle the visibility of the pick-up date input
    pickupRadio.addEventListener('change', togglePickupDateVisibility);
    deliveryRadio.addEventListener('change', togglePickupDateVisibility);

    // Initialize visibility based on the current radio button state
    togglePickupDateVisibility();
});


function calculate_price(price, deposit) {
    let quantity = parseInt(document.getElementById("quantity").value);

    let updated_price = 0;
    let updated_deposit = 0;
    if(quantity === 1)
    {
        document.getElementById("price").innerHTML = "$" + price.toFixed(2);
        document.getElementById("deposit").innerHTML = "$" + deposit.toFixed(2);
    }
    else if(quantity > 1 && quantity <= 10)
    {
        updated_price = quantity * price;
        updated_deposit = deposit * quantity;
        document.getElementById("price").innerHTML = "$" + updated_price.toFixed(2);
        document.getElementById("deposit").innerHTML = "$" + updated_deposit.toFixed(2);
    }
    else {
        alert("please note that quantity is must be between 0 and 10");
    }
}