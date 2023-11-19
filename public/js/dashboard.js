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




// function for DELETE BUTTON click
async function handleDeleteButtonClick(event, deleteButton) {
  const postId = deleteButton.dataset.postId;
  
  confirmDeleteModal.show();
  
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



// function for EDIT BUTTON click
async function handleEditButtonClick(event, editButton) {
  const postId = editButton.dataset.postId;
  console.log('edit button clicked');
  
  const postCard = event.target.closest('.post-card');
  const cardTitleEl = postCard.querySelector('.card-title');
  const cardContentEl = postCard.querySelector('.card-content');
  console.log('cardTitleEl');
  console.log(cardTitleEl);
  console.log('cardContentEl');
  console.log(cardContentEl);

  const currentTitle = cardTitleEl.textContent; // save current title in temp var
  const currentContent = cardContentEl.textContent; // save current content in temp var
  
  console.log('currentTitle');
  console.log(currentTitle);
  console.log('currentContent');
  console.log(currentContent);
  
  // change buttons
  // cancel, save
  
  // change textcontent to input field & textarea
  
  
  // if edit is cancelled, replace title and content with temp var values
  
}



// function for PUBLISH BUTTON click
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




function showPostButtons(postId, showState) {
  
  const postButtonGroupElement = document.getElementById(`post${postId}-button-group`);
  console.log('postButtonGroupElement');
  console.log(postButtonGroupElement);
  
  const deleteButton = postButtonGroupElement.querySelector('.delete-button');
  const editButton = postButtonGroupElement.querySelector('.edit-button');
  const publishButton = postButtonGroupElement.querySelector('.publish-button');
  
  if (showState === true) {
    console.log('show buttons')
    // show post buttons
    postButtonGroupElement.classList.remove('display-none')
    
    // delay adding visible and removing disabled for 0.1s
    setTimeout(() => {
      postButtonGroupElement.classList.add('visible')
      
      deleteButton.removeAttribute('disabled');
      editButton.removeAttribute('disabled');
      publishButton.removeAttribute('disabled');
    }, 100);
    
  } else {
    console.log('hide buttons')
    // disable post buttons
    deleteButton.setAttribute('disabled', 'true');
    editButton.setAttribute('disabled', 'true');
    publishButton.setAttribute('disabled', 'true');
    
    postButtonGroupElement.classList.remove('visible')
    
    // add display-none after opacity has reached 0
    setTimeout(() => {
      postButtonGroupElement.classList.add('display-none')
    }, 500);
  }
}

// event listener for post buttons
document.getElementById('all-posts').addEventListener('click', async function (event) {

  const cardArea = event.target.closest('.post-card');
  const deleteButton = event.target.closest('.delete-button');
  const editButton = event.target.closest('.edit-button');
  const publishButton = event.target.closest('.publish-button');


  if (deleteButton) {
    handleDeleteButtonClick(event, deleteButton);

  } else if (editButton) {
    handleEditButtonClick(event, editButton);

  } else if (publishButton) {
    handlePublishButtonClick(event, publishButton);
  }
});


// event listener for custom event postCollapse
document.addEventListener('postCollapse', async function (event) {
  const postId = event.detail.postId;
  const isCollapsed = event.detail.isCollapsed;

  showPostButtons(postId, isCollapsed);
});

// event listener for new post button click
document.getElementById('new-post-button').addEventListener('click', async function (event) {
  
  console.log('new post button clicked')
  
});