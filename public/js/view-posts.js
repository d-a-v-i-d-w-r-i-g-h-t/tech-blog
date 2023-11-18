function formatDate(date) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  return new Date(date).toLocaleDateString('en-US', options);
}

document.getElementById('new-post-button').addEventListener('click', async function (event) {
  console.log('new post button clicked')
})

document.getElementById('all-posts').addEventListener('click', async function (event) {

  const newPostButton = event.target.closest('#new-post-button')
  const cardArea = event.target.closest('.post-card');
  const deleteButton = event.target.closest('.delete-button');
  const editButton = event.target.closest('.edit-button');
  const publishButton = event.target.closest('.publish-button');


  if (deleteButton) {
    handleDeleteButtonClick(event, deleteButton);

  } else if (editButton) {
    handleEditButtonClick(event, editButton);

  // } else if (event.target.classList.contains('publish-button')) {
  } else if (publishButton) {
    handlePublishButtonClick(event, publishButton);

  } else if (cardArea) {
    handleCardAreaClick(event, cardArea);
  }
});

const confirmDeleteModalEl = document.getElementById('confirmDeleteModal');
const confirmDeleteModal = new bootstrap.Modal(confirmDeleteModalEl, {
  keyboard: false
});
const unableToDeleteModalEl = document.getElementById('unableToDeleteModal');
const unableToDeleteModal = new bootstrap.Modal(unableToDeleteModalEl, {
  keyboard: false
});

let isEventListenerAdded = false;
async function handleDeleteButtonClick(event, deleteButton) {
  const postId = deleteButton.dataset.postId;

  confirmDeleteModal.show();

  if (!isEventListenerAdded) {

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
    isEventListenerAdded = true;
  }
}



async function handleEditButtonClick(event, editButton) {
  const postId = editButton.dataset.postId;
  console.log('edit button clicked');

}



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



async function handleCardAreaClick(event, cardArea) {
  event.preventDefault();

  console.log('event.target');
  console.log(event.target);
  
  // ignore the click if user is trying to click on the Comments title or the dashboard buttons
  if (event.target.dataset.meInstead === 'true') {
    return;
  }
  const postId = cardArea.dataset.postId;
  const collapseElementId = `collapsePost${postId}`;
  const collapseElement2Id = `collapse2Post${postId}`;
  console.log('collapseElementId');
  console.log(collapseElementId);
  const collapseElement = document.getElementById(collapseElementId);
  const collapseElement2 = document.getElementById(collapseElement2Id);
  console.log('collapseElement');
  console.log(collapseElement);
  const postButtonGroupElement = document.getElementById(`post${postId}-button-group`);
  console.log('postButtonGroupElement');
  console.log(postButtonGroupElement);
  const bsPostContentCollapse = bootstrap.Collapse.getOrCreateInstance(collapseElement, {
    toggle: false
  });
  const bsPostContentCollapse2 = bootstrap.Collapse.getOrCreateInstance(collapseElement2, {
    toggle: false
  });

  const isCollapsed = cardArea.dataset.collapseState === 'true';
  const deleteButton = cardArea.querySelector('.delete-button');
  const editButton = cardArea.querySelector('.edit-button');
  const publishButton = cardArea.querySelector('.publish-button');
  
  if (isCollapsed === true) {
    bsPostContentCollapse.show();
    bsPostContentCollapse2.show();
    cardArea.dataset.collapseState = 'false'
    
    // show post buttons
    postButtonGroupElement.classList.add('visible')
    // delay removing disabled for 0.5s
    setTimeout(() => {
      deleteButton.removeAttribute('disabled');
      editButton.removeAttribute('disabled');
      publishButton.removeAttribute('disabled');
    }, 500);

    console.log('shown');

  } else {
    bsPostContentCollapse.hide();
    bsPostContentCollapse2.hide();
    cardArea.dataset.collapseState = 'true'
    
    // disable post buttons
    deleteButton.setAttribute('disabled', 'true');
    editButton.setAttribute('disabled', 'true');
    publishButton.setAttribute('disabled', 'true');
    postButtonGroupElement.classList.remove('visible')
    
    console.log('hidden');
  }
}