const logout = async () => {
  // Make a POST request to destroy the session on the back end
  const response = await fetch('/api/users/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    // If successfully logged out, redirect to the login page
    document.location.replace('/login');
  } else if (response.redirected) {
    window.location.href = '/login';
  } else {  
    console.log(response.statusText);
  }
};


// event listener for logout link
document.getElementById('logout-link').addEventListener('click', async (event) => {
  event.preventDefault();
  await logout();
});