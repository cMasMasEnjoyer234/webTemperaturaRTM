document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que la página se recargue
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
  
    // Validación básica (puedes conectar esto con un backend)
    if (username === 'admin' && password === '12345') {
      alert('Inicio de sesión exitoso');
      errorMessage.textContent = '';
      // Aquí puedes redirigir a otra página
      window.location.href = 'index2.html';
    } else {
      errorMessage.textContent = 'Usuario o contraseña incorrectos';
    }
  });
  