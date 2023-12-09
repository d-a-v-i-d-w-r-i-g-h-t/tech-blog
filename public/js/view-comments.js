    //////////////////////////////////
   //  HANDLE COMMENT CLICK EVENT  //
  //////////////////////////////////
 //
// function to handle clicks on comments, to collapse and uncollapse post sections
async function handleCommentCardClick(event) {
  const commentCard = event.target.closest('.comment-card');

  // ignore the click if user is trying to click on the post, post author, comment author, or the dashboard buttons
  if (event.target.dataset.noCollapse === 'true' || commentCard.dataset.editMode === 'true') {
    return;
  }
  toggleCollapseCommentPost(commentCard);
}



    ////////////////////////////////////
   //  TOGGLE COLLAPSE COMMENT POST  //
  ////////////////////////////////////
 //
// function to collapse and uncollapse comment post
function toggleCollapseCommentPost(commentCardEl) {

  const commentId = commentCardEl.dataset.commentId;
  const loggedIn = commentCardEl.dataset.loggedIn;
  const collapseElementId = `collapsePostComment${commentId}`;

  const collapseElement = document.getElementById(collapseElementId);

  const bsCommentPostCollapse = bootstrap.Collapse.getOrCreateInstance(collapseElement, {
    toggle: false
  });
  
  const isCollapsed = !collapseElement.classList.contains('show');
  
  // if collapse state is true then uncollapse post
  if (isCollapsed === true) {
    bsCommentPostCollapse.show();
    
  // otherwise collapse post
  } else {
    bsCommentPostCollapse.hide();
  }
}


// event listener for clicks on comments
const allCommentsEl = document.getElementById('all-comments');

if (allCommentsEl) {

  allCommentsEl.addEventListener('click', async event => handleCommentCardClick(event));

}

