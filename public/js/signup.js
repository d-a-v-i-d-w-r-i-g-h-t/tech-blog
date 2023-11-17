const signupFormHandler = async (event) => {
  event.preventDefault();

  const passwordInput = document.querySelector('#password-signup');
  const passwordVerifyInput = document.querySelector('#password-verify-signup');

  // gather the data from the form elements on the page
  const username = document.querySelector('#username-signup').value.trim();
  const email = document.querySelector('#email-signup').value.trim();
  const password = passwordInput.value.trim();
  const passwordVerify = passwordVerifyInput.value.trim();

  // check if the passwords match
  if (password !== passwordVerify) {
    alert("Passwords do not match. Please re-enter your password.");

    // clear password input fields
    passwordInput.value = '';
    passwordVerifyInput.value = '';

    // reset focus back on first password input
    passwordInput.focus();

    return; // stop form submission
  }

  if (username && email && password) {
    try {
      // send the username, e-mail, and password to the server
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.replace('/');
      } else {
        const errorData = await response.json();
        alert(`Failed to sign up: ${errorData.message || 'Unknown error'}`);
      } 
    } catch (err) {
      console.err('Error during form submission: ', err);
      alert('An unexpected error occurred. Please try again later.');
    }
  } else {
    alert(`Signup information incomplete. Please try again.`);
    return;
  }
};

// event listener on the signup form submit button
document
  .querySelector('.signup-form')
  .addEventListener('submit', signupFormHandler);
