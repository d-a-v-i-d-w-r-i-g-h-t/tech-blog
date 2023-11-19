document.getElementById('all-posts').addEventListener('click', async function (event) {

  // const newPostButton = event.target.closest('#new-post-button')
  const cardArea = event.target.closest('.post-card');
  // const deleteButton = event.target.closest('.delete-button');
  // const editButton = event.target.closest('.edit-button');
  // const publishButton = event.target.closest('.publish-button');


  // if (deleteButton) {
  //   handleDeleteButtonClick(event, deleteButton);

  // } else if (editButton) {
  //   handleEditButtonClick(event, editButton);

  // } else if (publishButton) {
  //   handlePublishButtonClick(event, publishButton);

  if (cardArea) {
    handleCardAreaClick(event, cardArea);
  }
});

async function handleCardAreaClick(event, cardArea) {
  event.preventDefault();

  console.log('event.target');
  console.log(event.target);
  
  // ignore the click if user is trying to click on the Comments title or the dashboard buttons
  if (event.target.dataset.noCollapse === 'true') {
    return;
  }
  const postId = cardArea.dataset.postId;
  const loggedIn = cardArea.dataset.loggedIn;
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
  
  const isCollapsed = cardArea.dataset.collapseState === 'true';
  
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


  if (isCollapsed === true) {
    bsPostContentCollapse.show();
    bsPostContentCollapse2.show();
    cardArea.dataset.collapseState = 'false'
    
    console.log('shown');

  } else {
    bsPostContentCollapse.hide();
    bsPostContentCollapse2.hide();
    cardArea.dataset.collapseState = 'true'
        
    console.log('hidden');
  }
}