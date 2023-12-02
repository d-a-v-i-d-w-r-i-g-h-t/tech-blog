// define new confirm delete comment modal
const confirmDeleteCommentModalEl = document.getElementById('confirmDeleteCommentModal');
const confirmDeleteCommentModal = new bootstrap.Modal(confirmDeleteCommentModalEl, {
  keyboard: false
});

// define new unable to delete comment modal
const unableToDeleteCommentModalEl = document.getElementById('unableToDeleteCommentModal');
const unableToDeleteCommentModal = new bootstrap.Modal(unableToDeleteCommentModalEl, {
  keyboard: false
});

// define new unable to save comment modal
const unableToSaveCommentModalEl = document.getElementById('unableToSaveCommentModal');
const unableToSaveCommentModal = new bootstrap.Modal(unableToSaveCommentModalEl, {
  keyboard: false
});

// set global variable to prevent adding multiple confirm delete comment event listeners
let isConfirmDeleteCommentEventListenerAdded = false;



    ///////////////////
   //  EDIT BUTTON  //
  ///////////////////
 //
// function for edit button click
async function handleEditCommentButtonClick(event) {
  console.log('edit button clicked');
  
  const commentCard = event.target.closest('.comment-card');
  
  enableEditMode(commentCard);
}



    /////////////////////
   //  DELETE BUTTON  //
  /////////////////////
 //
// function for delete button click
async function handleDeleteCommentButtonClick(event) {
  console.log('delete button clicked');
  const commentCard = event.target.closest('.comment-card');
  
  const commentId = commentCard.dataset.commentId;
  console.log('commentId');
  console.log(commentId);
  
  // store the commentId in the modal for later retrieval
  confirmDeleteCommentModalEl.dataset.commentId = commentId;

  confirmDeleteCommentModal.show();
  
  console.log(`ok to delete comment ${commentId}`);

  if (!isConfirmDeleteCommentEventListenerAdded) {
    
    confirmDeleteCommentModalEl.addEventListener('click', async function (event) {
      
      // retrieve the commentId from the modal data attribute
      const commentId = confirmDeleteCommentModalEl.dataset.commentId;
      
      if (event.target.id === 'ok-delete') {
        
        console.log(`confirm: ok to delete comment ${commentId}`);

        deleteComment(commentId)
      }
    });
    isConfirmDeleteCommentEventListenerAdded = true;
  }
}


async function deleteComment(commentId) {
  try {
    const response = await fetch(`/api/comments/${commentId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      const elementId = `comment${commentId}-card`;
      const elementToRemove = document.getElementById(elementId);
      if (elementToRemove) {
        elementToRemove.remove();
      } else {
        console.log('Element not found');
      }
    } else {
      const errorMessage = await response.text();
      console.error(`Failed to delete comment. Server response: ${errorMessage}`);
      
      unableToDeleteCommentModal.show();
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
async function handleSaveCommentEditButtonClick(event) {
  console.log('save button clicked');

  const commentCard = event.target.closest('.comment-card');

  const commentId = commentCard.dataset.commentId;

  // retrieve updated text from input fields
  const textInputEl = commentCard.querySelector('.text-input');

  const savedText = textInputEl.value.trim();

  if (savedText === commentCard.dataset.currentText) {
    disableEditMode(commentCard);
    return;
  }

  try {
    const response = await fetch(`/api/comments/${commentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        published: false,
        title: savedText,
      }),
    });
    console.log('save response');
    console.log(response);
    
    if (response.ok) {
      
      // save updated title and content in data attributes
      commentCard.dataset.currentText = savedText;

      disableEditMode(commentCard);

    } else {
      const errorMessage = await response.text();
      console.error(`Failed to update comment. Server response: ${errorMessage}`);
      
      unableToSaveCommentModal.show();
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
async function handleCancelCommentEditButtonClick(event) {
  console.log('cancel button clicked');
  
  const commentCard = event.target.closest('.comment-card');
  const commentId = commentCard.dataset.commentId;

  const savedText = commentCard.dataset.currentText;

  if (savedText === '') {

    deleteComment(commentId);

  } else {
    
    disableEditMode(commentCard);
  }
}



    ////////////////////////
   //  Enable Edit Mode  //
  ////////////////////////
 //
// function to enable edit mode
function enableEditMode(commentCard) {
console.log('Enable Edit Mode');

  commentCard.dataset.editMode = 'true';

  // convert comment text into input field
  
  const commentTextEl = commentCard.querySelector('.comment-text');

  // save current comment text in data attributes
  const currentText = commentTextEl.textContent.trim();
  
  commentCard.dataset.currentText = currentText; 
  
  // replace comment text element with text input element
  
  const textInputEl = document.createElement('input');
  textInputEl.type = 'text';
  textInputEl.classList.add('text-input', 'mb-3');
  textInputEl.value = currentText;

  const inputFieldLength = currentText.length + 10;
  textInputEl.setAttribute('size', inputFieldLength.toString());

  commentTextEl.parentNode.replaceChild(textInputEl, commentTextEl);


  // update button configuration:
  // hide main button group, show edit button group
  const showCommentButtonGroup = false;
  const showCommentEditButtonGroup = true;
  
  const commentId = commentCard.dataset.commentId;
  
  const commentButtonGroupId = `comment${commentId}-button-group`;
  const commentButtons = [
    'edit-comment-button',
    'delete-comment-button',
  ];

  const commentEditButtonGroupId = `comment${commentId}-edit-comment-button-group`;
  const editCommentButtons = [
    'save-comment-edit-button',
    'cancel-comment-edit-button',
  ];

  showButtons(showCommentButtonGroup, commentButtonGroupId, commentButtons);
  setTimeout(() => {
    showButtons(showCommentEditButtonGroup, commentEditButtonGroupId, editCommentButtons);
  }, 500);
}



    /////////////////////////
   //  Disable Edit Mode  //
  /////////////////////////
 //
// function to disable edit mode
function disableEditMode(commentCard) {
  console.log('Disable Edit Mode');

  commentCard.dataset.editMode = 'false';

  // change comment text input field back to read-only element

  const textInputEl = commentCard.querySelector('.text-input');
  
  // replace text with data saved in data attribute
  const savedText = commentCard.dataset.currentText;
  
  // empty data attribute
  commentCard.dataset.currentText = '';

  // replace title input element with title element
  const commentTextEl = document.createElement('p');
  commentTextEl.classList.add('comment-text');
  commentTextEl.textContent = savedText;
  
  textInputEl.parentNode.replaceChild(commentTextEl, textInputEl);
  

  // update button configuration:
  // show main button group, hide edit button group
  const showCommentButtonGroup = true;
  const showCommentEditButtonGroup = false;
  
  const commentId = commentCard.dataset.commentId;

  const commentButtonGroupId = `comment${commentId}-button-group`;
  const commentButtons = [
    'edit-comment-button',
    'delete-comment-button',
  ];
  
  const commentEditButtonGroupId = `comment${commentId}-edit-comment-button-group`;
  const editCommentButtons = [
    'save-comment-edit-button',
    'cancel-comment-edit-button',
  ];
  
  showButtons(showCommentEditButtonGroup, commentEditButtonGroupId, editCommentButtons);
  setTimeout(() => {
    showButtons(showCommentButtonGroup, commentButtonGroupId, commentButtons);
  }, 500);
}




// event listener for comment buttons
document.getElementById('all-comments').addEventListener('click', async function (event) {

  const editCommentButton = event.target.closest('.edit-comment-button');
  const deleteCommentButton = event.target.closest('.delete-comment-button');
  const saveCommentEditButton = event.target.closest('.save-comment-edit-button');
  const cancelCommentEditButton = event.target.closest('.cancel-comment-edit-button');

  if (editCommentButton) {
    handleEditCommentButtonClick(event);

  } else if (deleteCommentButton) {
    handleDeleteCommentButtonClick(event);

  } else if (saveCommentEditButton) {
    handleSaveCommentEditButtonClick(event);
    
  } else if (cancelCommentEditButton) {
    handleCancelCommentEditButtonClick(event);
  }
});


// event listener for custom event commentPostCollapse
document.addEventListener('commentPostCollapse', async function (event) {
  const commentId = event.detail.commentId;
  const isCollapsed = event.detail.isCollapsed;
  // if collapse state is true then need to un-collapse,
  // need to show the comment button group
  const showCommentButtonGroup = isCollapsed; 

  const buttonGroupId = `comment${commentId}-button-group`;
  const buttons = [
    'edit-comment-button',
    'delete-comment-button',
  ];
  console.log('buttons');
  console.log(buttons);

  showButtons(showCommentButtonGroup, buttonGroupId, buttons);
});

