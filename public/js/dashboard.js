const newPostButton = document.getElementById('new-post-button')
setTimeout(() => {
  newPostButton.classList.add('visible')  
}, 100);

// define new confirm delete modal
const confirmDeleteModalEl = document.getElementById('confirmDeleteModal');
const confirmDeleteModal = new bootstrap.Modal(confirmDeleteModalEl, {
  keyboard: false
});

// define new unable to delete modal
const unableToDeleteModalEl = document.getElementById('unableToDeleteModal');
const unableToDeleteModal = new bootstrap.Modal(unableToDeleteModalEl, {
  keyboard: false
});

// set global variable to prevent adding multiple confirm delete event listeners
let isConfirmDeleteEventListenerAdded = false;


// function to format date when publishing post
function formatDate(date) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  return new Date(date).toLocaleDateString('en-US', options);
}



    /////////////////////
   //  DELETE BUTTON  //
  /////////////////////
 //
// function for delete button click
async function handleDeleteButtonClick(event, deleteButton) {
  const postId = deleteButton.dataset.postId;
  
  confirmDeleteModal.show();
  
  console.log('ok to delete');
  return;
  if (!isConfirmDeleteEventListenerAdded) {
    
    confirmDeleteModalEl.addEventListener('click', async function (event) {
      if (event.target.id === 'ok-delete') {
        
        console.log('ok to delete');
        try {
          const response = await fetch(`/api/posts/${postId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
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
            
            unableToDeleteModal.show();
          }
        } catch (err) {
          console.error('An unexpected error occurred:', err);
        }
      }
    });
    isConfirmDeleteEventListenerAdded = true;
  }
}


/////////////////////
//  CANCEL BUTTON  //
/////////////////////
//
// function for cancel button click
async function handleCancelButtonClick(event, cancelButton) {
  console.log('cancel button clicked');
  
  // change input field & textarea back to read-only elements
  
  const postCard = event.target.closest('.post-card');
  const titleInputEl = postCard.querySelector('.title-input');
  const pubDateEl = postCard.querySelector('.publication-date');
  const contentInputEl = postCard.querySelector('.content-input');

  // disable edit mode
  postCard.dataset.editMode = 'false';
  
  // discard changes, replace original title and content saved in data attributes
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
  
  const postId = cancelButton.dataset.postId;

  const postButtonGroupId = `post${postId}-button-group`;
  const postButtons = [
    'edit-button',
    'delete-button',
    'publish-button',
  ];
  
  const postEditButtonGroupId = `post${postId}-edit-button-group`;
  const editPostButtons = [
    'save-edit-button',
    'cancel-edit-button',
  ];
  
  showPostButtons(showPostEditButtonGroup, postEditButtonGroupId, editPostButtons);
  setTimeout(() => {
    showPostButtons(showPostButtonGroup, postButtonGroupId, postButtons);
  }, 500);
}



///////////////////
//  EDIT BUTTON  //
///////////////////
//
// function for edit button click
async function handleEditButtonClick(event, editButton) {
  console.log('edit button clicked');
  
  // convert title and content elements into input field and textarea
  
  const postCard = event.target.closest('.post-card');
  const cardTitleEl = postCard.querySelector('.card-title');
  const pubDateEl = postCard.querySelector('.publication-date');
  const cardContentEl = postCard.querySelector('.card-content');

  // set edit mode
  postCard.dataset.editMode = 'true';

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
  
  const postId = editButton.dataset.postId;
  
  const postButtonGroupId = `post${postId}-button-group`;
  const postButtons = [
    'edit-button',
    'delete-button',
    'publish-button',
  ];

  const postEditButtonGroupId = `post${postId}-edit-button-group`;
  const editPostButtons = [
    'save-edit-button',
    'cancel-edit-button',
  ];

  showPostButtons(showPostButtonGroup, postButtonGroupId, postButtons);
  setTimeout(() => {
    showPostButtons(showPostEditButtonGroup, postEditButtonGroupId, editPostButtons);
  }, 500);
}



    //////////////////////
   //  PUBLISH BUTTON  //
  //////////////////////
 //
// function for publish button click
async function handlePublishButtonClick(event) {
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
      
      unableToDeleteModal.show();
    }
  } catch (err) {
    console.error('An unexpected error occurred:', err);
  }
  
}



    /////////////////////////
   //  Show Post Buttons  //
  /////////////////////////
 //
// function to show/hide dashboard post buttons
function showPostButtons(showState, buttonGroupId = '', buttons = []) {

  // do nothing if no button group ID or buttons array is empty
  if (buttonGroupId === '' || buttons.length === 0) {
    return;
  }
  const buttonGroupElement = document.getElementById(buttonGroupId);
  console.log('buttonGroupElement');
  console.log(buttonGroupElement);

  const button = {};
  
  buttons.forEach(buttonClass => {
    button[buttonClass] = buttonGroupElement.querySelector(`.${buttonClass}`);
  });
  console.log('button');
  console.log(button);
  console.log('showState');
  console.log(showState);
  console.log('buttonGroupId');
  console.log(buttonGroupId);
  console.log('buttons');
  console.log(buttons);
  
  if (showState === true) {
    console.log('show buttons')
    // show post buttons
    buttonGroupElement.classList.remove('display-none')
    
    // delay adding visible and removing disabled for 0.1s
    setTimeout(() => {
      buttonGroupElement.classList.add('visible')
      
      buttons.forEach(buttonClass => {
        button[buttonClass].removeAttribute('disabled');
      });    
    
    }, 100);
    
  } else {
    console.log('hide buttons (else case)')
    // disable post buttons
    buttons.forEach(buttonClass => {
      button[buttonClass].setAttribute('disabled', 'true');
    });    

    buttonGroupElement.classList.remove('visible')
    
    // add display-none after opacity has reached 0
    setTimeout(() => {
      buttonGroupElement.classList.add('display-none')
    }, 500);
  }
}


// event listener for post buttons
document.getElementById('all-posts').addEventListener('click', async function (event) {

  // const cardArea = event.target.closest('.post-card');
  const editButton = event.target.closest('.edit-button');
  const deleteButton = event.target.closest('.delete-button');
  const publishButton = event.target.closest('.publish-button');
  const saveButton = event.target.closest('.save-edit-button');
  const cancelButton = event.target.closest('.cancel-edit-button');

  if (editButton) {
    handleEditButtonClick(event, editButton);

  } else if (deleteButton) {
    handleDeleteButtonClick(event, deleteButton);

  } else if (publishButton) {
    handlePublishButtonClick(event, publishButton);
    
  } else if (saveButton) {
    handleSaveButtonClick(event, saveButton);
    
  } else if (cancelButton) {
    handleCancelButtonClick(event, cancelButton);
  }
});


// event listener for custom event postCollapse
document.addEventListener('postCollapse', async function (event) {
  const postId = event.detail.postId;
  const isCollapsed = event.detail.isCollapsed;
  // if collapse state is true then need to un-collapse,
  // need to show the post button group
  const showPostButtonGroup = isCollapsed; 

  const buttonGroupId = `post${postId}-button-group`;
  const buttons = [
    'edit-button',
    'delete-button',
    'publish-button',
  ];
  console.log('buttons');
  console.log(buttons);

  showPostButtons(showPostButtonGroup, buttonGroupId, buttons);
});

// event listener for new post button click
newPostButton.addEventListener('click', async function (event) {
  
  console.log('new post button clicked')
  
});