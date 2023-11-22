// function to handle clicks on comments, to collapse and uncollapse post sections
async function handleCommentCardClick(event, commentCard) {
  
  console.log('event.target');
  console.log(event.target);
  
  // ignore the click if user is trying to click on the post, post author, comment author, or the dashboard buttons
  if (event.target.dataset.noCollapse === 'true' || commentCard.dataset.editMode === 'true') {
    return;

  } else {
    event.preventDefault();
  }

  const commentId = commentCard.dataset.commentId;
  const loggedIn = commentCard.dataset.loggedIn;
  const collapseElementId = `collapsePostComment${commentId}`;
  console.log('collapseElementId');
  console.log(collapseElementId);

  const collapseElement = document.getElementById(collapseElementId);
  console.log('collapseElement');
  console.log(collapseElement);

  const bsCommentPostCollapse = bootstrap.Collapse.getOrCreateInstance(collapseElement, {
    toggle: false
  });
  
  const isCollapsed = commentCard.dataset.collapseState === 'true';
  
  if (loggedIn) {
    
    // Create a custom event to communicate with dashboard-comments.js if it is active
    var event = new CustomEvent('commentPostCollapse', {
      detail: { 
        commentId: commentId,
        isCollapsed: isCollapsed,
      }
    });
    
    // dispatch the event
    document.dispatchEvent(event);
  }
  
  // if collapse state is true then uncollapse post
  if (isCollapsed === true) {
    bsCommentPostCollapse.show();
    commentCard.dataset.collapseState = 'false'
    
    console.log('shown');
    
  // otherwise collapse post
  } else {
    bsCommentPostCollapse.hide();
    commentCard.dataset.collapseState = 'true'
    
    console.log('hidden');
  }
}


// event listener for clicks on comments
document.getElementById('all-comments').addEventListener('click', async function (event) {

  const commentCard = event.target.closest('.comment-card');

  if (commentCard) {
    handleCommentCardClick(event, commentCard);
  }
});
