    ///////////////////////////////
   //  HANDLE POST CLICK EVENT  //
  ///////////////////////////////
 //
// function to handle clicks on posts, to collapse and uncollapse posts and comment sections
async function handlePostCardClick(event) {
  const postCard = event.target.closest('.post-card');

  // ignore the click if user is trying to click on designated links such as Comments title, or the dashboard buttons
  if (event.target.dataset.noCollapse === 'true' || postCard.dataset.editMode === 'true') {
    return;
  }
  toggleCollapsePost(postCard);
}


    ////////////////////////////
   //  TOGGLE COLLAPSE POST  //
  ////////////////////////////
 //
// function to collapse and uncollapse posts
function toggleCollapsePost(postCardElement) {
  if (!postCardElement) {
    return;
  }
  const postId = postCardElement.dataset.postId;
  // post collapse is made up of two collapse elements
  const collapseElementId = `collapsePost${postId}`;
  const collapseElement2Id = `collapse2Post${postId}`;

  const collapseElement = document.getElementById(collapseElementId);
  const collapseElement2 = document.getElementById(collapseElement2Id);

  const bsPostContentCollapse = bootstrap.Collapse.getOrCreateInstance(collapseElement, {
    toggle: false,
  });
  const bsPostContentCollapse2 = bootstrap.Collapse.getOrCreateInstance(collapseElement2, {
    toggle: false,
  });
  
  const isCollapsed = !collapseElement.classList.contains('show');

  // if collapse state is true then uncollapse post content
  if (isCollapsed === true) {
    bsPostContentCollapse.show();
    bsPostContentCollapse2.show();
    
  // otherwise collapse post content
  } else {
    bsPostContentCollapse.hide();
    bsPostContentCollapse2.hide();
  }
}


    ////////////////////////////////
   //  TOGGLE COLLAPSE COMMENTS  //
  ////////////////////////////////
 //
// function to collapse and uncollapse comments
function toggleCollapseComments(postCardElement) {
  if (!postCardElement) {
    return;
  }
  const postId = postCardElement.dataset.postId;
  const collapseElementId = `collapseComments-post${postId}`;
  const collapseElement = document.getElementById(collapseElementId);

  const bsPostCommentsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseElement, {
    toggle: false,
  });
  
  const isCollapsed = !collapseElement.classList.contains('show');
  
  // if collapse state is true then uncollapse post content
  if (isCollapsed === true) {
    bsPostCommentsCollapse.show();
    
  // otherwise collapse post content
  } else {
    bsPostCommentsCollapse.hide();
  }
}


    /////////////////////////////////////
   //  HANDLE COMMENT COLLAPSE EVENT  //
  /////////////////////////////////////
 //
// function to handle comment collapse events
function handleCommentCollapseEvent({ isHide, event }) {
  const collapseSection = event.target;
  const collapseType = collapseSection.dataset.collapseType;
  if (collapseType === "comments") {
    const postCard = collapseSection.closest('.post-card');
    const postId = postCard.dataset.postId;

    // don't display new comment button if still in global edit mode or comment edit mode
    const commentCard = collapseSection.querySelector('.comment-card');
  
    const isCommentEditMode = commentCard
      ? commentCard.dataset.editMode === 'true' // convert string to boolean
      : false;
    const isGlobalEditMode = document.querySelector('.navbar').dataset.globalEditMode === 'true'; // convert string to boolean
    
    if ( ( isCommentEditMode || isGlobalEditMode ) && !isHide ) {
      return;
    }
    displayNewCommentButton({ displayButton: !isHide, postId })
  }
}


    ////////////////////////////////////
   //  SHOW/HIDE NEW COMMENT BUTTON  //
  ////////////////////////////////////
 //
// function to show or hide new comment button
function displayNewCommentButton({ displayButton, postId }) {
  const newCommentButtonId = `post${postId}-new-comment-button`;
  const newCommentButton = [ 'new-comment-button' ];
    
  setTimeout(() => {
    showButtons(displayButton, newCommentButtonId, newCommentButton);
  }, 50);

}



    /////////////////////////////
   //  INITIALIZE VIEW POSTS  //
  /////////////////////////////
 //
// function to initialize view posts
function viewPostsInit() {
  const allPostsEl = document.getElementById('all-posts');
  
  if (allPostsEl) { // multiple posts mode

    // add event listener for clicks on posts
    allPostsEl.addEventListener('click', async event => handlePostCardClick(event));
    
  } else { // single post mode: there is only one post, and it needs to be uncollapsed

    const postCard = document.querySelector('.post-card');
    
    setTimeout(() => {
      toggleCollapsePost(postCard);
    }, 0);

    setTimeout(() => {
      toggleCollapseComments(postCard);
    }, 0);
  }

  // event listener for uncollapsing sections
  document.addEventListener('show.bs.collapse', event =>
    handleCommentCollapseEvent({ isHide: false, event }));
  
  // event listener for collapsing sections
  document.addEventListener('hide.bs.collapse', event =>
    handleCommentCollapseEvent({ isHide: true, event })); 
}  
  
viewPostsInit();
