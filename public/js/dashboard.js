// global constants
const newPostTitle = 'New Post';
const newPostContent = `What's on your mind?`

const allPostsEl = document.getElementById('all-posts');
if (allPostsEl) {
  
  // display new post button
  const newPostButton = document.getElementById('new-post-button')
  setTimeout(() => {
    newPostButton.classList.add('visible')  
  }, 100);

  // event listener for new post button click
  newPostButton.addEventListener('click', async function (event) {
    
    console.log('new post button clicked')
    handleNewPostButtonClick(event);
  });
  
  init();
}


// define new confirm delete post modal
const confirmDeletePostModalEl = document.getElementById('confirmDeletePostModal');
const confirmDeletePostModal = new bootstrap.Modal(confirmDeletePostModalEl, {
  keyboard: false
});

// define new unable to delete post modal
const unableToDeletePostModalEl = document.getElementById('unableToDeletePostModal');
const unableToDeletePostModal = new bootstrap.Modal(unableToDeletePostModalEl, {
  keyboard: false
});

// define new unable to save post modal
const unableToSavePostModalEl = document.getElementById('unableToSavePostModal');
const unableToSavePostModal = new bootstrap.Modal(unableToSavePostModalEl, {
  keyboard: false
});

// set global variable to prevent adding multiple confirm delete post event listeners
let isConfirmDeletePostEventListenerAdded = false;

// if unchanged new post, go straight to edit mode on dashboard load
function init() {
  const allPostsEl = document.getElementById('all-posts');
  if (allPostsEl.hasChildNodes()) {
    const firstPost = allPostsEl.querySelector('.post-card');
    console.log('allPostsEl');
    console.log(allPostsEl);
    console.log('firstPost');
    console.log(firstPost);

    const firstPostTitleEl = firstPost.querySelector('.card-title');
    if (firstPostTitleEl && firstPostTitleEl.textContent.trim() === newPostTitle) {
      firstPostTitleEl.click();
      enableEditMode(firstPost);
    }
  }
}



    ///////////////////////
   //  NEW POST BUTTON  //
  ///////////////////////
 //
// function for new post button click
async function handleNewPostButtonClick(event) {
  console.log('new button clicked');
  console.log(event.target);
  try {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify({
        title: newPostTitle,
        content: newPostContent,
      }),
    });
    
    if (response.ok) {

      location.reload();

    } else {
      const errorMessage = await response.text();
      console.error('Failed to create post:', errorMessage);
    }
  } catch (err) {
    console.error('An unexpected error occurred:', err);
  }

}



    ///////////////////
   //  EDIT BUTTON  //
  ///////////////////
 //
// function for edit button click
async function handleEditPostButtonClick(event) {
  console.log('edit button clicked');
  
  const postCard = event.target.closest('.post-card');
  
  enableEditMode(postCard);
}



    /////////////////////
   //  DELETE BUTTON  //
  /////////////////////
 //
// function for delete button click
async function handleDeletePostButtonClick(event) {
  console.log('delete button clicked');
  const postCard = event.target.closest('.post-card');
  
  const postId = postCard.dataset.postId;
  console.log('postId');
  console.log(postId);
  
  // store the postId in the modal for later retrieval
  confirmDeletePostModalEl.dataset.postId = postId;

  confirmDeletePostModal.show();
  
  console.log(`ok to delete post ${postId}`);

  if (!isConfirmDeletePostEventListenerAdded) {
    
    confirmDeletePostModalEl.addEventListener('click', async function (event) {
      
      // retrieve the postId from the modal data attribute
      const postId = confirmDeletePostModalEl.dataset.postId;
      
      if (event.target.id === 'ok-delete') {
        
        console.log(`confirm: ok to delete post ${postId}`);

        deletePost(postId)
      }
    });
    isConfirmDeletePostEventListenerAdded = true;
  }
}


async function deletePost(postId) {
  try {
    const response = await fetch(`/api/posts/${postId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      const elementId = `post${postId}-card`;
      const elementToRemove = document.getElementById(elementId);
      if (elementToRemove) {
        elementToRemove.remove();
      } else {
        console.log('Element not found');
      }
    } else {
      const errorMessage = await response.text();
      console.error(`Failed to delete post. Server response: ${errorMessage}`);
      
      unableToDeletePostModal.show();
    }
  } catch (err) {
    console.error('An unexpected error occurred:', err);
  }
}


    //////////////////////
   //  PUBLISH BUTTON  //
  //////////////////////
 //
// function for publish button click
async function handlePublishPostButtonClick(event) {
  const publishButton = event.target;
  
  const postId = publishButton.dataset.postId;
  const isPublished = publishButton.dataset.published === 'true'; // converting string to boolean
  const publicationDateElement = document.getElementById(`post${postId}-publication-date`);
  
  try {
    const response = await fetch(`/api/posts/${postId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !isPublished }),
    });
    
    if (response.ok) {
      if (isPublished) {
        // change publication date to draft
        publicationDateElement.textContent = "DRAFT"
        
        // switch button to 'unpublished' mode
        publishButton.classList.add('btn-outline-success');
        publishButton.classList.remove('btn-success');
        publishButton.textContent = 'Publish'
        
        publishButton.dataset.published = 'false';
        
      } else {
        // add publication date
        publicationDateElement.textContent = formatDate(Date.now());
        
        // switch button to 'published' mode
        publishButton.classList.remove('btn-outline-success');
        publishButton.classList.add('btn-success');
        publishButton.textContent = 'Unpublish'
        
        publishButton.dataset.published = 'true';
      }
      
    } else {
      const errorMessage = await response.text();
      console.error(`Failed to delete post. Server response: ${errorMessage}`);
      
      unableToDeletePostModal.show();
    }
  } catch (err) {
    console.error('An unexpected error occurred:', err);
  }
  
}



    ///////////////////
   //  SAVE BUTTON  //
  ///////////////////
 //
// function for save button click
async function handleSavePostEditButtonClick(event) {
  console.log('save button clicked');

  const postCard = event.target.closest('.post-card');

  const postId = postCard.dataset.postId;

  // retrieve updated title and content from input fields
  const titleInputEl = postCard.querySelector('.title-input');
  const pubDateEl = postCard.querySelector('.publication-date');
  const contentInputEl = postCard.querySelector('.content-input');

  const savedTitle = titleInputEl.value.trim();
  const savedPubDate = pubDateEl.textContent.trim();
  const savedContent = contentInputEl.value.trim();

  if (savedTitle === postCard.dataset.currentTitle && savedContent === postCard.dataset.currentContent) {
    disableEditMode(postCard);
    return;
  }

  try {
    const response = await fetch(`/api/posts/${postId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        published: false,
        title: savedTitle,
        content: savedContent,
      }),
    });
    console.log('save response');
    console.log(response);
    
    if (response.ok) {
      
      // save updated title and content in data attributes
      postCard.dataset.currentTitle = savedTitle;
      postCard.dataset.currentPubDate = savedPubDate;
      postCard.dataset.currentContent = savedContent;

      const publishButtonEl = postCard.querySelector('.publish-post-button');
      publishButtonEl.classList.remove('btn-success');
      publishButtonEl.classList.add('btn-outline-success');
      publishButtonEl.dataset.published='false';
      publishButtonEl.textContent='Publish';
      
      disableEditMode(postCard);

    } else {
      const errorMessage = await response.text();
      console.error(`Failed to update post. Server response: ${errorMessage}`);
      
      unableToSavePostModal.show();
    }
  } catch (err) {
    console.error('An unexpected error occurred:', err);
  }
}



    /////////////////////
   //  CANCEL BUTTON  //
  /////////////////////
 //
// function for cancel button click
async function handleCancelPostEditButtonClick(event) {
  console.log('cancel button clicked');
  
  const postCard = event.target.closest('.post-card');
  const postId = postCard.dataset.postId;

  const savedTitle = postCard.dataset.currentTitle;
  const savedContent = postCard.dataset.currentContent;

  if (savedTitle === newPostTitle && savedContent === newPostContent) {

    deletePost(postId);

  } else {
    
    disableEditMode(postCard);
  }
}



    ////////////////////////
   //  Enable Edit Mode  //
  ////////////////////////
 //
// function to enable edit mode
function enableEditMode(postCard) {

  postCard.dataset.editMode = 'true';

  // convert title and content elements into input field and textarea
  
  const cardTitleEl = postCard.querySelector('.card-title');
  const pubDateEl = postCard.querySelector('.publication-date');
  const cardContentEl = postCard.querySelector('.card-content');

  // save current title, publication date, and content in data attributes
  const currentTitle = cardTitleEl.textContent.trim();
  const currentPubDate = pubDateEl.textContent.trim();
  const currentContent = cardContentEl.textContent.trim();
  
  postCard.dataset.currentTitle = currentTitle; 
  postCard.dataset.currentPubDate = currentPubDate
  postCard.dataset.currentContent = currentContent;
  
  // replace title element with title input element
  
  const titleInputEl = document.createElement('input');
  titleInputEl.type = 'text';
  titleInputEl.classList.add('title-input', 'mb-3');
  titleInputEl.value = currentTitle;

  const inputFieldLength = currentTitle.length + 10;
  titleInputEl.setAttribute('size', inputFieldLength.toString());

  cardTitleEl.parentNode.replaceChild(titleInputEl, cardTitleEl);

  // Replace publication data with 'DRAFT'
  pubDateEl.textContent = 'DRAFT';
      
  // replace content element with content textarea input element
  const contentInputEl = document.createElement('textarea');
  contentInputEl.classList.add('content-input', 'mb-3');
  contentInputEl.value = currentContent;
  contentInputEl.setAttribute('rows', '10');

  cardContentEl.parentNode.replaceChild(contentInputEl, cardContentEl);


  // update button configuration:
  // hide main button group, show edit button group
  const showPostButtonGroup = false;
  const showPostEditButtonGroup = true;
  
  const postId = postCard.dataset.postId;
  
  const postButtonGroupId = `post${postId}-button-group`;
  const postButtons = [
    'edit-post-button',
    'delete-post-button',
    'publish-post-button',
  ];

  const postEditButtonGroupId = `post${postId}-edit-post-button-group`;
  const editPostButtons = [
    'save-post-edit-button',
    'cancel-post-edit-button',
  ];

  showButtons(showPostButtonGroup, postButtonGroupId, postButtons);
  setTimeout(() => {
    showButtons(showPostEditButtonGroup, postEditButtonGroupId, editPostButtons);
  }, 500);
}



    /////////////////////////
   //  Disable Edit Mode  //
  /////////////////////////
 //
// function to disable edit mode
function disableEditMode(postCard) {

  postCard.dataset.editMode = 'false';

  // change input field & textarea back to read-only elements

  const titleInputEl = postCard.querySelector('.title-input');
  const pubDateEl = postCard.querySelector('.publication-date');
  const contentInputEl = postCard.querySelector('.content-input');
  
  // replace title and content with data saved in data attributes
  const savedTitle = postCard.dataset.currentTitle;
  const savedPubDate = postCard.dataset.currentPubDate;
  const savedContent = postCard.dataset.currentContent;
  
  // empty data attributes
  postCard.dataset.currentTitle = '';
  postCard.dataset.currentPubDate = '';
  postCard.dataset.currentContent = '';

  // replace title input element with title element
  const cardTitleEl = document.createElement('h4');
  cardTitleEl.classList.add('card-title');
  cardTitleEl.textContent = savedTitle;
  
  titleInputEl.parentNode.replaceChild(cardTitleEl, titleInputEl);

  // replace publication date
  pubDateEl.textContent = savedPubDate;
  
  // replace content input element with content element
  const cardContentEl = document.createElement('p')
  cardContentEl.classList.add('card-content', 'mb-2');
  cardContentEl.textContent = savedContent;
  
  contentInputEl.parentNode.replaceChild(cardContentEl, contentInputEl);  
  

  // update button configuration:
  // show main button group, hide edit button group
  const showPostButtonGroup = true;
  const showPostEditButtonGroup = false;
  
  const postId = postCard.dataset.postId;

  const postButtonGroupId = `post${postId}-button-group`;
  const postButtons = [
    'edit-post-button',
    'delete-post-button',
    'publish-post-button',
  ];
  
  const postEditButtonGroupId = `post${postId}-edit-post-button-group`;
  const editPostButtons = [
    'save-post-edit-button',
    'cancel-post-edit-button',
  ];
  
  showButtons(showPostEditButtonGroup, postEditButtonGroupId, editPostButtons);
  setTimeout(() => {
    showButtons(showPostButtonGroup, postButtonGroupId, postButtons);
  }, 500);
}




// event listener for post buttons
const allPostsContainer = document.getElementById('all-posts');
const postCardContainers = document.querySelectorAll('.post-card');

const listenerTarget = allPostsContainer
  ? allPostsContainer
  : postCardContainers.length >= 1
    ? postCardContainers[0]
    : null;

listenerTarget.addEventListener('click', async function (event) {

  const editPostButton = event.target.closest('.edit-post-button');
  const deletePostButton = event.target.closest('.delete-post-button');
  const publishPostButton = event.target.closest('.publish-post-button');
  const savePostEditButton = event.target.closest('.save-post-edit-button');
  const cancelPostEditButton = event.target.closest('.cancel-post-edit-button');

  if (editPostButton) {
    handleEditPostButtonClick(event);

  } else if (deletePostButton) {
    handleDeletePostButtonClick(event);

  } else if (publishPostButton) {
    handlePublishPostButtonClick(event);
    
  } else if (savePostEditButton) {
    handleSavePostEditButtonClick(event);
    
  } else if (cancelPostEditButton) {
    handleCancelPostEditButtonClick(event);
  }
});


// event listener for custom event postCollapse
document.addEventListener('postCollapse', postCollapseHandler); 

async function postCollapseHandler(event) {
  const postId = event.detail.postId;
  const isCollapsed = event.detail.isCollapsed;
  // if collapse state is true then need to un-collapse,
  // need to show the post button group
  const showPostButtonGroup = isCollapsed; 

  const buttonGroupId = `post${postId}-button-group`;
  const buttons = [
    'edit-post-button',
    'delete-post-button',
    'publish-post-button',
  ];
  console.log('buttons');
  console.log(buttons);

  showButtons(showPostButtonGroup, buttonGroupId, buttons);

}
