
// event listener for new comment buttons
document.querySelector('main').addEventListener('click', async function (event) {

  const newCommentButton = event.target.closest('.new-comment-button');

  if (newCommentButton) {
    handleNewCommentButtonClick(event);
  }
});



    //////////////////////////
   //  NEW COMMENT BUTTON  //
  //////////////////////////
 //
// function for new comment button click
async function handleNewCommentButtonClick(event) {
  // console.log('new comment button click');
  const postCard = event.target.closest('.post-card');
  const postId = postCard.dataset.postId;

  const navEl = document.querySelector('.navbar');
  const userId = navEl.dataset.userId;

  try {
    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify({
        text: '',
        user_id: userId,
        post_id: postId,
      }),
    });
    
    if (response.ok) {

      // reload the page, init will handle shifting the new comment to edit mode
      window.location.href = `/post/${postId}`;

    } else if (response.redirected) {
      window.location.href = '/login';
    } else {  
      const errorMessage = await response.text();
      console.error('Failed to create comment:', errorMessage);
    }
  } catch (err) {
    console.error('An unexpected error occurred:', err);
  }
}
