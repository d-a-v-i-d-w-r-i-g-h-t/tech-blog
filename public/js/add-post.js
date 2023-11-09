async function newFormHandler(event) {
  event.preventDefault();

  const title = document.querySelector('#post_title').value;
  const content = document.querySelector('#post_content').value;

  // window.location gives us access to the URL. We then use the .split() method to access the number at the end of the URL and set that equal to id.
  const username = window.location.toString().split('/')[
    window.location.toString().split('/').length - 1
  ];  

  const response = await fetch(`/api/posts`, {
    method: 'POST',
    body: JSON.stringify({
      title,
      content,
      user_id: req.session.user_id,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    document.location.replace(`/posts/${username}`);
  } else {
    alert('Failed to add post');
  }
}

document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);
