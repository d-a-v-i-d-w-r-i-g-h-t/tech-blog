// function to handle clicks on posts, to collapse and uncollapse posts and comment sections
async function handlePostCardClick(event, postCard) {
  event.preventDefault();
  
  console.log('event.target');
  console.log(event.target);
  
  // ignore the click if user is trying to click on the Comments title or the dashboard buttons
  if (event.target.dataset.noCollapse === 'true' || postCard.dataset.editMode === 'true') {
    return;
  }
  const postId = postCard.dataset.postId;
  const loggedIn = postCard.dataset.loggedIn;
  const collapseElementId = `collapsePost${postId}`;
  const collapseElement2Id = `collapse2Post${postId}`;
  console.log('collapseElementId');
  console.log(collapseElementId);

  const collapseElement = document.getElementById(collapseElementId);
  const collapseElement2 = document.getElementById(collapseElement2Id);
  console.log('collapseElement');
  console.log(collapseElement);

  const bsPostContentCollapse = bootstrap.Collapse.getOrCreateInstance(collapseElement, {
    toggle: false
  });
  const bsPostContentCollapse2 = bootstrap.Collapse.getOrCreateInstance(collapseElement2, {
    toggle: false
  });
  
  const isCollapsed = postCard.dataset.collapseState === 'true';
  
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
    postCard.dataset.collapseState = 'false'
    
    console.log('shown');
    
  // otherwise collapse post content
  } else {
    bsPostContentCollapse.hide();
    bsPostContentCollapse2.hide();
    postCard.dataset.collapseState = 'true'
    
    console.log('hidden');
  }
}


// event listener for clicks on posts
document.getElementById('all-posts').addEventListener('click', async function (event) {

  const postCard = event.target.closest('.post-card');

  if (postCard) {
    handlePostCardClick(event, postCard);
  }
});