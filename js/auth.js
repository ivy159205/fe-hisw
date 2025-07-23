document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const username = localStorage.getItem("loggedInUser");

    if (isLoggedIn === "true" && username) {
      const nameSpan = document.getElementById("current-user-name");
      if (nameSpan) {
        nameSpan.textContent = username;
      }

      const helloHeading = document.querySelector("header h2");
      if (helloHeading) {
        helloHeading.textContent = `Hello, ${username}!`;
      }
    } else {
      window.location.href = "login.html";
    }
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Handle Login Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission

            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            // In a real application, you would send this data to a server
            // and handle the response (e.g., check credentials).
            console.log('Đăng nhập với:', { username, password });

            // Dummy authentication logic
            if (username === 'nguyenvana' && password === '123321') {
                alert('Đăng nhập thành công!');
                localStorage.setItem('isLoggedIn', 'true'); // Lưu trạng thái đăng nhập
                localStorage.setItem('loggedInUser', 'Admin'); // Lưu tên người dùng
                window.location.href = 'admin.html'; // Chuyển hướng đến trang admin
            } else if (username === 'user' && password === 'user123') {
                alert('Đăng nhập thành công! (Tài khoản người dùng)');
                localStorage.setItem('isLoggedIn', 'true'); // Lưu trạng thái đăng nhập
                localStorage.setItem('loggedInUser', 'User'); // Lưu tên người dùng
                window.location.href = 'main-page.html'; // Chuyển hướng đến trang user (hoặc index)
            } else {
                alert('Tên đăng nhập hoặc mật khẩu không đúng!');
            }
        });
    }

    // Handle Register Form Submission
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission

            const username = document.getElementById('reg-username').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;

            if (password !== confirmPassword) {
                alert('Mật khẩu xác nhận không khớp!');
                return;
            }

            console.log('Đăng ký với:', { username, email, password });

            alert('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
            window.location.href = 'login.html'; // Chuyển hướng về trang đăng nhập
        });
    }
});