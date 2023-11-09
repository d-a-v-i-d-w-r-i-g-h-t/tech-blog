const signupFormHandler = async (event) => {
  event.preventDefault();

  // gather the data from the form elements on the page
  const username = document.querySelector('#username-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();
  const passwordCheck = document.querySelector('#password2-signup').value.trim();

  // check if the passwords match
  if (password !== passwordCheck) {
    alert("Passwords do not match. Please re-enter your password.");
    return; // stop form submission
  }

  if (username && password) {
    try {
      // send the e-mail and password to the server
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
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
  }
};

document
  .querySelector('.signup-form')
  .addEventListener('submit', signupFormHandler);
