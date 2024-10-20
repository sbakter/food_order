const form = document.querySelector('.form-container');          // The form containing the pancake order options
const checkboxes = document.querySelectorAll('input[type="checkbox"]');  // All topping and extra checkboxes
const typeSelect = document.querySelector('#type');              // Dropdown for pancake type
const deliveryOptions = document.querySelectorAll('input[name="delivery"]'); // Radio buttons for delivery options
const totalPriceElement = document.querySelector('#totalPrice'); // Element where total price is displayed
const button = document.querySelector('button');                 // Button to submit the order

// Variables to store order details
let total = 0;                    // Stores the total price
let orders = [];                  // Stores all the placed orders
let selectedToppings = [];        // Stores selected toppings
let selectedExtras = [];          // Stores selected extras
let selectedDelivery = '';        // Stores selected delivery method

// Function to calculate the total price based on selected options
const pancakePriceCalc = () => {
    // Get the selected pancake type and base price
    const selectedTypeOption = typeSelect.selectedOptions[0];
    const basePrice = parseInt(selectedTypeOption.dataset.price) || 0;
    selectedPancakeType = selectedTypeOption.dataset.name; // Get the pancake type name

    // Reset total price to the base price of the selected pancake
    total = basePrice;

    // Reset toppings, extras, and delivery variables
    selectedToppings = [];
    selectedExtras = [];
    selectedDelivery = '';

    // Check selected toppings and extras
    checkToppings();

    // Check selected delivery option (eat-in or delivery)
    checkDeliveryOptions();

    // Update the total price in the UI
    totalPriceElement.textContent = `${total.toFixed(0)}€`;

    // Add a simple animation to the price display when updated
    const priceBanner = document.querySelector('.price-banner');
    priceBanner.animate(
        [
            { transform: 'scale(1)' },
            { transform: 'scale(1.05)' },
            { transform: 'scale(1)' }
        ],
        {
            duration: 100,
            iterations: 1
        }
    );
};

// Function to check which toppings and extras are selected and add their prices
const checkToppings = () => {
    checkboxes.forEach(item => {
        // If the checkbox is checked, add its price to the total
        if (item.checked) {
            const itemPrice = parseInt(item.value) || 0;
            total += itemPrice;

            // Separate selected items into toppings and extras
            if (item.dataset.category === 'toppings') {
                selectedToppings.push(item.dataset.name);
            } else if (item.dataset.category === 'extras') {
                selectedExtras.push(item.dataset.name);
            }
        }
    });
};

// Function to check the selected delivery option and adjust the price accordingly
const checkDeliveryOptions = () => {
    // Get the selected delivery method (eat-in or delivery)
    selectedDelivery = [...deliveryOptions].find(option => option.checked)?.value || 'eat_in';

    // If delivery is selected, add a delivery fee of 5€ to the total
    if (selectedDelivery === 'delivery') {
        total += 5;
    }
};

// Function to display the order summary
const displayOrder = () => {
    // Get the customer name from the input field (or default to 'Guest' if empty)
    const customerName = document.querySelector('#customerName').value || 'Guest';

    // Select elements where the order summary will be displayed
    const orderType = document.querySelector('#order_type');
    const orderToppings = document.querySelector('#order_toppings');
    const orderExtras = document.querySelector('#order_extras');
    const orderName = document.querySelector('#order_name');
    const orderDelivery = document.querySelector('#order_delivery');
    const orderPrice = document.querySelector('#order_price');
    const displayOrder = document.querySelector('.order-summary');

    // Toggle functionality: if the order summary is already visible, hide it
    if (displayOrder.style.display === 'block') {
        displayOrder.style.display = 'none';
        return; // Exit the function early
    }

    // Update the order summary with the selected options
    orderType.textContent = selectedPancakeType;  // Pancake type
    orderToppings.textContent = selectedToppings.length ? selectedToppings.join(', ') : 'No Toppings';  // Toppings or 'No Toppings' if none
    orderExtras.textContent = selectedExtras.length ? selectedExtras.join(', ') : 'No Extras';  // Extras or 'No Extras' if none
    orderName.textContent = customerName;  // Customer name
    orderDelivery.textContent = selectedDelivery.charAt(0).toUpperCase() + selectedDelivery.slice(1);  // Capitalize delivery method
    orderPrice.textContent = `${total.toFixed(2)}€`;  // Total price with 2 decimal points

    // Display the order summary
    displayOrder.style.display = 'block';

    // Create an order object to store the current order details
    const order = {
        name: customerName,
        pancakeType: typeSelect.selectedOptions[0].text,  // Pancake type
        toppings: selectedToppings,  // Selected toppings
        extras: selectedExtras,  // Selected extras
        deliveryMethod: selectedDelivery,  // Delivery method
        totalPrice: total.toFixed(2)  // Total price
    };

    // Add the current order to the orders array
    orders.push(order);

    console.log('Orders:', orders);
};

// Event listener to recalculate the total price whenever any form element changes
form.addEventListener('change', pancakePriceCalc);

// Event listener to display the order summary when the button is clicked
button.addEventListener('click', displayOrder);

// Call the price calculation function initially to set the correct total when the page loads
pancakePriceCalc();
