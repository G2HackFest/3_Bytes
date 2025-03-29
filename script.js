document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();
    let role = document.getElementById("role").value;
    if (role === "buyer") {
        window.location.href = "buyer-dashboard.html";
    } else {
        window.location.href = "seller-dashboard.html";
    }
});
document.addEventListener('DOMContentLoaded', function () {
    // Registration Form Submission
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;

            // Store user data in local storage (for demo purposes)
            localStorage.setItem('userName', name);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userPhone', phone);
            localStorage.setItem('userPassword', password);
            localStorage.setItem('userRole', role);

            alert("Registration successful! Please log in.");
            window.location.href = "login.html";
        });
    }

    // Login Form Submission
    
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Retrieve stored credentials
            const storedEmail = localStorage.getItem('userEmail');
            const storedPassword = localStorage.getItem('userPassword');
            const storedName = localStorage.getItem('userName');
            const storedRole = localStorage.getItem('userRole');

            if (email === storedEmail && password === storedPassword) {
                alert("Login successful!");
                localStorage.setItem('loggedInUser', storedName);
                if (storedRole === 'buyer') {
                    window.location.href = "buyer-dashboard.html";
                } else {
                    window.location.href = "seller-dashboard.html";
                }
            } else {
                alert("Invalid email or password. Please try again.");
            }
        });
    }
});
