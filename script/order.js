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
            deliveryDateInput.removeAttribute('required'); // Remove 'required' from delivery date when hidden
            pickupDateInput.setAttribute('required', 'true');
        } else if (deliveryRadio.checked) {
            deliveryDateContainer.style.display = 'block';
            pickupDateContainer.style.display = 'none'; // Hide pick-up date
            pickupDateInput.removeAttribute('required'); // Remove 'required' from pickup date when hidden
            deliveryDateInput.setAttribute('required', 'true');
        } else {
            // Hide both if neither is selected (initial state)
            pickupDateContainer.style.display = 'none';
            deliveryDateContainer.style.display = 'none';
            pickupDateInput.removeAttribute('required'); // Remove 'required' from pickup date
            deliveryDateInput.removeAttribute('required');
        }
    }

    // Attach event listeners to radio buttons to toggle the visibility of the pick-up date input
    pickupRadio.addEventListener('change', togglePickupDateVisibility);
    deliveryRadio.addEventListener('change', togglePickupDateVisibility);

    // Initialize visibility based on the current radio button state
    togglePickupDateVisibility();

    deliveryRadio.addEventListener('change', function() {
        if (deliveryRadio.checked) {
            deliveryDateInput.setAttribute('required', 'true');
        } else {
            deliveryDateInput.removeAttribute('required');
        }
    });

    // Form validation before submission (Optional: you can add more checks if needed)
    const form = document.querySelector('form');
    form.addEventListener('submit', function (event) {
        // Ensure the form is valid before submitting
        if (pickupRadio.checked && !pickupDateInput.value) {
            event.preventDefault(); // Prevent form submission
            alert('Please select a valid pick-up date.');
        } else if (deliveryRadio.checked && !deliveryDateInput.value) {
            event.preventDefault(); // Prevent form submission
            if (deliveryDateInput.style.display !== 'none' && !deliveryDateInput.value) {
                event.preventDefault();
                alert('Please select a valid delivery date.');
            }
        }
    });
});

// Price calculation function
function calculate_price(price, deposit) {
    let quantity = parseInt(document.getElementById("quantity").value);
    console.log(quantity);console.log(price);console.log(deposit);

    let updated_price = 0;
    let updated_deposit = 0;

    if (quantity === 1) {
        updated_price = price;
        updated_deposit = deposit;
    } else if (quantity > 1 && quantity <= 10) {
        updated_price = quantity * price;
        updated_deposit = deposit * quantity;
    } else {
        alert("Please note that quantity must be between 1 and 10");
        return;
    }

    // Update the total price and deposit display
    document.getElementById("price").textContent = "$" + updated_price.toFixed(2);
    document.getElementById("deposit").textContent = "$" + updated_deposit.toFixed(2);
    document.getElementById("total-price").textContent = "Total amount is: $" + (updated_price + updated_deposit).toFixed(2);
}
