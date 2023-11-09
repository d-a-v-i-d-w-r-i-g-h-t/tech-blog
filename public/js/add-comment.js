async function newFormHandler(event) {
  event.preventDefault();

  const text = document.querySelector('#comment_text').value;

  // window.location gives us access to the URL. We then use the .split() method to access the number at the end of the URL and set that equal to id.
  const id = window.location.toString().split('/')[
    window.location.toString().split('/').length - 1
  ];  

  const response = await fetch(`/api/comment`, {
    method: 'POST',
    body: JSON.stringify({
      text,
      user_id: req.session.user_id,
      post_id: id,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    document.location.replace(`/posts/${id}`);
  } else {
    alert('Failed to add comment');
  }
}

document.querySelector('.new-comment-form').addEventListener('submit', newFormHandler);
