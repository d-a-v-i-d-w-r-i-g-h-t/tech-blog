async function editFormHandler(event) {
  event.preventDefault();
  
  const comment_text = document.querySelector('#comment_text').value;

  // window.location gives us access to the URL. We then use the .split() method to access the number at the end of the URL and set that equal to id.
  const id = window.location.toString().split('/')[
    window.location.toString().split('/').length - 1
  ];

  const response = await fetch(`/api/comments/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      comment_text,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    document.location.replace(`/comments/${id}`);
  } else {
    alert('Failed to edit comment');
  }
}

document.querySelector('.edit-comment-form').addEventListener('submit', editFormHandler);
