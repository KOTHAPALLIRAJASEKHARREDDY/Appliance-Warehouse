document.addEventListener("DOMContentLoaded", function () {
  const products_list = localStorage.getItem("checkoutProducts");
  const products = JSON.parse(products_list);
  let total_amount = products.reduce((acc, product) => {
    const rentalRate = parseFloat(product.rental_rate);
    const depositAmount = parseFloat(product.deposit_amount);
    const quantity = parseInt(product.quantity);
    return acc + (rentalRate + depositAmount) * quantity;
  }, 0);

  document.getElementById(
    "cart-total-amount"
  ).innerText = `$${total_amount.toFixed(2)}`;
});

function formatCardNumber(event) {
  let input = event.target;
  let value = input.value.replace(/\D/g, ""); // Remove non-digit characters
  let formattedValue = "";

  // Format the value in groups of 4 digits
  for (let i = 0; i < value.length; i++) {
    if (i > 0 && i % 4 === 0) {
      formattedValue += "-";
    }
    formattedValue += value[i];
  }

  input.value = formattedValue;
}

function formatExpirationDate(event) {
  let input = event.target;
  let value = input.value.replace(/\D/g, ""); // Remove non-digit characters
  let formattedValue = "";

  // Add a slash after two digits (MM/YY format)
  if (value.length >= 2) {
    formattedValue = value.slice(0, 2) + "/" + value.slice(2, 4);
  } else {
    formattedValue = value;
  }

  input.value = formattedValue;
}
