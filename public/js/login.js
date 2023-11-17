const loginFormHandler = async (event) => {
  // Stop the browser from submitting the form so we can do so with JavaScript
  event.preventDefault();

  // Gather the data from the form elements on the page
  const username = document.getElementById('username-login').value.trim();
  const password = document.getElementById('password-login').value.trim();

  if (username && password) {
    // Send the username and password to the server
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/');
    } else {
      alert('Failed to log in');
    }
  }
};

const redirectToSignUp = async (event) => {
  event.preventDefault();

  window.location.href = '/signup';
}

document
  .getElementById('login-form')
  .addEventListener('submit', loginFormHandler);

document
  .getElementById('sign-up')
  .addEventListener('click', redirectToSignUp);
