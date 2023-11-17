const loginFailModalEl = document.getElementById('loginFailModal');
const loginFailModal = new bootstrap.Modal(loginFailModalEl, {
  keyboard: true
});

const usernameInputField = document.getElementById('username-login');
const passwordInputField = document.getElementById('password-login');

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

    // after successful login, go to the home page
    if (response.ok) {
      document.location.replace('/');
    } else {
      
      // clear username and password input fields
      usernameInputField.value = '';
      passwordInputField.value = '';
      
      // display modal to inform user
      loginFailModal.show();
    }
  }
};

// event listener for when missing data modal is fully hidden
loginFailModalEl.addEventListener('hidden.bs.modal', () => {
  // reset focus on username input field
  usernameInputField.focus();
});



// redirect to the sign up page
const redirectToSignUp = async (event) => {
  event.preventDefault();

  window.location.href = '/signup';
}

// event listener on the login form submit button
document
  .getElementById('login-submit')
  .addEventListener('click', loginFormHandler);

  // event listener to redirect to the sign up page
document
  .getElementById('sign-up-redirect')
  .addEventListener('click', redirectToSignUp);
