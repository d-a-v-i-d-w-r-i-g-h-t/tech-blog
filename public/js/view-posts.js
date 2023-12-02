// function to handle clicks on posts, to collapse and uncollapse posts and comment sections
async function handlePostCardClick(event, postCardElement) {
  
  console.log('postCardClick event.target');
  console.log(event.target);
  
  // ignore the click if user is trying to click on designated links such as Comments title, or the dashboard buttons
  if (event.target.dataset.noCollapse === 'true' || postCardElement.dataset.editMode === 'true') {
    return;

  } else {
    event.preventDefault();
  }

  toggleCollapsePost(postCardElement);
}


function toggleCollapsePost(postCardElement) {

  const postId = postCardElement.dataset.postId;
  const loggedIn = postCardElement.dataset.loggedIn;
  const collapseElementId = `collapsePost${postId}`;
  const collapseElement2Id = `collapse2Post${postId}`;

  const collapseElement = document.getElementById(collapseElementId);
  const collapseElement2 = document.getElementById(collapseElement2Id);

  const bsPostContentCollapse = bootstrap.Collapse.getOrCreateInstance(collapseElement, {
    toggle: false
  });
  const bsPostContentCollapse2 = bootstrap.Collapse.getOrCreateInstance(collapseElement2, {
    toggle: false
  });
  
  const isCollapsed = postCardElement.dataset.collapseState === 'true'; // convert string to boolean
  
  if (loggedIn) {
    
    // Create a custom event to communicate with dashboard.js if it is active
    var event = new CustomEvent('postCollapse', {
      detail: { 
        postId: postId,
        isCollapsed: isCollapsed,
      }
    });
    
    // dispatch the event
    document.dispatchEvent(event);
  }
  
  // if collapse state is true then uncollapse post content
  if (isCollapsed === true) {
    bsPostContentCollapse.show();
    bsPostContentCollapse2.show();
    postCardElement.dataset.collapseState = 'false'
    
    console.log('shown');
    
  // otherwise collapse post content
  } else {
    bsPostContentCollapse.hide();
    bsPostContentCollapse2.hide();
    postCardElement.dataset.collapseState = 'true'
    
    console.log('hidden');
  }
}


function displayNewCommentButton({ displayButton, postId }) {
  
  const newCommentButtonId = `post${postId}-new-comment-button`;
  const newCommentButton = [ 'new-comment-button' ];
    
  showButtons(displayButton, newCommentButtonId, newCommentButton);
}


function handleCollapseEvent({ isHide, event }) {
  const collapseSection = event.target;
  const collapseType = collapseSection.dataset.collapseType;

  if (collapseType === "comments") {
    const postCard = event.target.closest('.post-card');
    const postId = postCard.dataset.postId;

    displayNewCommentButton({ displayButton: !isHide, postId })
  }
}


function viewPostsInit() {
  
  const allPostsEl = document.getElementById('all-posts');
  
  if (allPostsEl) {
    // event listener for clicks on posts
    allPostsEl.addEventListener('click', async function (event) {
      
      const postCard = event.target.closest('.post-card');
      
      if (postCard) {
        handlePostCardClick(event, postCard);
      }
    });
    
  } else {
    // there is only one post, and it needs to be uncollapsed
    const postCard = document.querySelector('.post-card');
    toggleCollapsePost(postCard);
  }
  
  // event listener for uncollapsing sections
  document.addEventListener('show.bs.collapse', function (event) {
    handleCollapseEvent({ isHide: false, event })
  });
  
  // event listener for collapsing sections
  document.addEventListener('hide.bs.collapse', function (event) {
    handleCollapseEvent({ isHide: true, event })
  }); 
}

viewPostsInit();