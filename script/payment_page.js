function formatCardNumber(event) {
        let input = event.target;
        let value = input.value.replace(/\D/g, '');  // Remove non-digit characters
        let formattedValue = '';

        // Format the value in groups of 4 digits
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += '-';
            }
            formattedValue += value[i];
        }

        input.value = formattedValue;
    }

    function formatExpirationDate(event) {
    let input = event.target;
    let value = input.value.replace(/\D/g, '');  // Remove non-digit characters
    let formattedValue = '';

    // Add a slash after two digits (MM/YY format)
    if (value.length >= 2) {
        formattedValue = value.slice(0, 2) + '/' + value.slice(2, 4);
    } else {
        formattedValue = value;
    }

    input.value = formattedValue;
}
