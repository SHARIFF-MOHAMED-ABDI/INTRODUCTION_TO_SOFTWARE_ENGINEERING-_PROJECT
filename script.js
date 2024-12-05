let cart = [];

function showSection(sectionId) {
    document.querySelectorAll("section").forEach(section => section.classList.add("hidden"));
    document.getElementById(sectionId).classList.remove("hidden");
}

function addToCart(item, price) {
    cart.push({ item, price });
    updateCartDisplay();
    showNotification("Item added to cart!");
}

function updateCartDisplay() {
    const cartItems = document.getElementById("cartItems");
    cartItems.innerHTML = cart.map((cartItem, index) => `
        <div class="cart-item">
            <p>${cartItem.item}</p>
            <p>Ksh ${cartItem.price.toFixed(2)}</p>
            <button onclick="removeFromCart(${index})">Remove</button>
        </div>
    `).join("");
    cartItems.innerHTML += `<div class="cart-item"><strong>Total:</strong> Ksh ${cart.reduce((sum, cartItem) => sum + cartItem.price, 0).toFixed(2)}</strong></div>`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

function showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification show";
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.classList.remove("show");
        notification.remove();
    }, 2000);
}

function showPaymentOptions() {
    showSection("paymentSection");
}

function showPaymentDetails(method) {
    document.getElementById("paymentDetails").classList.remove("hidden");
    ["visaDetails", "mpesaDetails", "studentDetails"].forEach(id => document.getElementById(id).classList.add("hidden"));
    document.getElementById(`${method}Details`).classList.remove("hidden");
}

function processPayment(method) {
    if (method === "visa") {
        const cardNumber = document.getElementById("cardNumber").value;
        const expiryDate = document.getElementById("expiryDate").value;
        const cvv = document.getElementById("cvv").value;
        if (!cardNumber || !expiryDate || !cvv) {
            alert("Please fill in all VISA card details.");
            return;
        }
    } else if (method === "mpesa") {
        const mpesaNumber = document.getElementById("mpesaNumber").value;
        if (!mpesaNumber) {
            alert("Please enter your phone number.");
            return;
        }
        alert(`STK Push sent to ${mpesaNumber}! Enter your PIN on your phone to complete the payment.`);
    } else if (method === "student") {
        const studentID = document.getElementById("studentID").value;
        const fullName = document.getElementById("fullName").value;
        if (!studentID || !fullName) {
            alert("Please enter your Student ID and Full Name.");
            return;
        }
        localStorage.setItem('fullName', fullName); // Save the name for the receipt
    }

    alert("Payment Successful!");
    const customerName = localStorage.getItem('fullName') || "Customer";
    const contactNumber = prompt("Please enter your active phone number:");
    const initials = prompt("Please enter your initials for the signature:");

    generateReceipt(customerName, initials, contactNumber, method);
}

function generateReceipt(customerName, initials, contactNumber, paymentMethod) {
    showSection("receiptSection");
    const receiptItems = document.getElementById("receiptItems");
    receiptItems.innerHTML = `
        <div id="receiptHeader">
            <h3>USIU Online Food Ordering Receipt</h3>
            <p>USIU CAFFE</p>
            <p>USIU RESTAURANT</p>
            <p>Thika Road, Nairobi, Kenya</p>
            <p>Order Date: ${new Date().toLocaleString()}</p>
            <div class="receipt-divider"></div>
        </div>
    `;

    cart.forEach((item) => {
        receiptItems.innerHTML += `<p>${item.item}================Ksh ${item.price.toFixed(2)}</p>`;
    });
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    receiptItems.innerHTML += `
        <div class="receipt-divider"></div>
        <p>Total: Ksh ${total.toFixed(2)}</p>
        <p>Payment Method: ${paymentMethod.toUpperCase()}</p>
        <p>Name: ${customerName}</p>
        <p>Signature: ${initials}</p>
        <p>Contact Number: ${contactNumber}</p>
        <div class="receipt-divider"></div>
        <div id="receiptFooter">Thank you for dining with us!</div>
    `;
}

function selectDeliveryOption(option) {
    if (option === "pickup") {
        alert("Your order will be ready for pickup in 10 minutes.");
        resetOrderPrompt();
    } else {
        document.getElementById("deliveryLocationSection").classList.remove("hidden");
    }
}

function confirmOrder() {
    const location = document.getElementById("deliveryLocation").value;
    alert(`Your order will be delivered to: ${location}. Your delivery will arrive soon. Thank you for shopping with us!`);
    resetOrderPrompt();
}

function resetOrderPrompt() {
    const orderAgain = confirm("Would you like to place another order?");
    if (orderAgain) {
        cart = [];
        updateCartDisplay();
        showSection("menuSection");
    } else {
        alert("Thank you for using the USIU Online Food Ordering System!");
        showSection("homeSection");
    }
}
