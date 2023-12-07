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
  
  const isCollapsed = postCardElement.dataset.collapseState === 'true'; // convert string to boolean
  
  // if collapse state is true then uncollapse post content
  if (isCollapsed === true) {
    bsPostContentCollapse.show();
    bsPostContentCollapse2.show();
    postCardElement.dataset.collapseState = 'false';
    
  // otherwise collapse post content
  } else {
    bsPostContentCollapse.hide();
    bsPostContentCollapse2.hide();
    postCardElement.dataset.collapseState = 'true';
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
    
  showButtons(displayButton, newCommentButtonId, newCommentButton);
}  


    //////////////////////////
   //  NEW COMMENT BUTTON  //
  //////////////////////////
 //
// function for new comment button click
function handleNewCommentButtonClick(event) {
  console.log('new comment button click');
  // const 
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
    allPostsEl.addEventListener('click', async function (event) {
      const newCommentButton = event.target.closest('.new-comment-button');
      const postCard = event.target.closest('.post-card');

      if (newCommentButton) {
        handleNewCommentButtonClick(event);

      } else if (postCard) {
        handlePostCardClick(event);
      }
    });
    
  } else { // single post mode: there is only one post, and it needs to be uncollapsed

    console.log('single post');
    const postCard = document.querySelector('.post-card');

    setTimeout(() => {
      toggleCollapsePost(postCard);
    }, 100);
  }

  // event listener for uncollapsing sections
  document.addEventListener('show.bs.collapse', function (event) {
    handleCommentCollapseEvent({ isHide: false, event })
    // alert(`uncollapse: ${event.target}`);
  });
  
  // event listener for collapsing sections
  document.addEventListener('hide.bs.collapse', function (event) {
    handleCommentCollapseEvent({ isHide: true, event })
    // alert(`collapse: ${event.target}`);
  }); 
}  
  
viewPostsInit();
