// scope modal variables to global
let confirmDeleteCommentModal;
let unableToDeleteCommentModal;
let unableToSaveCommentModal;

// set global variable to prevent adding multiple confirm delete comment event listeners
let isConfirmDeleteCommentEventListenerAdded = false;



    ///////////////////
   //  EDIT BUTTON  //
  ///////////////////
 //
// function for edit button click
async function handleEditCommentButtonClick(event) {
  // console.log('edit button clicked');

  const commentCard = event.target.closest('.comment-card');
  enableCommentEditMode(commentCard);
}



    /////////////////////
   //  DELETE BUTTON  //
  /////////////////////
 //
// function for delete button click
async function handleDeleteCommentButtonClick(event) {
  // console.log('delete button clicked');
  const commentCard = event.target.closest('.comment-card');
  const commentId = commentCard.dataset.commentId;
  
  // store the commentId in the modal for later retrieval
  confirmDeleteCommentModalEl.dataset.commentId = commentId;

  confirmDeleteCommentModal.show();
  
  // console.log(`ok to delete comment ${commentId}`);

  if (!isConfirmDeleteCommentEventListenerAdded) {
    
    confirmDeleteCommentModalEl.addEventListener('click', async function (event) {
      
      // retrieve the commentId from the modal data attribute
      const commentId = confirmDeleteCommentModalEl.dataset.commentId;
      
      if (event.target.id === 'ok-delete') {
        
        // console.log(`confirm: ok to delete comment ${commentId}`);

        deleteComment(commentId)
      }
    });
    isConfirmDeleteCommentEventListenerAdded = true;
  }
}


    //////////////////////
   //  DELETE COMMENT  //
  //////////////////////
 //
// delete comment from the database
async function deleteComment(commentId) {
  // console.log('delete comment ', commentId);
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
  const commentCard = event.target.closest('.comment-card');
  const commentId = commentCard.dataset.commentId;

  // retrieve updated text from input fields
  const textInputEl = commentCard.querySelector('.text-input');

  const savedText = textInputEl.value.trim();

  if (savedText === commentCard.dataset.currentText) {
    disableCommentEditMode(commentCard);
    return;
  }

  try {
    const response = await fetch(`/api/comments/${commentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: savedText,
      }),
    });
    // console.log('save response');
    // console.log(response);
    
    if (response.ok) {
      
      // save updated title and content in data attributes
      commentCard.dataset.currentText = savedText;

      commentCard.dataset.newComment = "false";
      disableCommentEditMode(commentCard);

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
  // console.log('cancel button clicked');

  const commentCard = event.target.closest('.comment-card');
  const commentId = commentCard.dataset.commentId;
  const isNewComment = commentCard.dataset.newComment === 'true'; // convert string to boolean

  if (isNewComment === true) {
    postCard = commentCard.closest('.post-card');
    postId = postCard.dataset.postId;

    deleteComment(commentId);
    displayNewCommentButton({ displayButton: true, postId });

  } else {
    
    disableCommentEditMode(commentCard);
  }
}



    ////////////////////////////////
   //  ENABLE COMMENT EDIT MODE  //
  ////////////////////////////////
 //
// function to enable comment edit mode
function enableCommentEditMode(commentCard) {
  // console.log('Enable Comment Edit Mode');

  commentCard.dataset.editMode = 'true';

  // convert comment text into input field
  
  const commentTextEl = commentCard.querySelector('.comment-text');

  // save current comment text in data attributes
  const currentText = commentTextEl.textContent.trim();
  
  commentCard.dataset.currentText = currentText; 
  
  // replace comment text element with text input element
  
  const textInputEl = document.createElement('textarea');
  textInputEl.type = 'text';
  textInputEl.classList.add('text-input');
  textInputEl.value = currentText;

  textInputEl.style.width = '100%';
  textInputEl.rows = 2;

  // const inputFieldLength = currentText.length + 10;
  // textInputEl.setAttribute('size', inputFieldLength.toString());

  commentTextEl.parentNode.replaceChild(textInputEl, commentTextEl);
textInputEl.focus();

  // update button configuration:
  // hide main button group, show edit button group
  const commentId = commentCard.dataset.commentId;
  const postCard = commentCard.closest('.post-card');

  if (postCard) {
    const postId = postCard.dataset.postId;
    displayNewCommentButton({ displayButton: false, postId });
  }
  
  displayCommentButtonGroup({ displayButtonGroup: false, commentId });
  setTimeout(() => {
    displayEditCommentButtonGroup({ displayButtonGroup: true, commentId });
  }, 500);
}



    /////////////////////////////////
   //  DISABLE COMMENT EDIT MODE  //
  /////////////////////////////////
 //
// function to disable comment edit mode
function disableCommentEditMode(commentCard) {
  // console.log('Disable Comment Edit Mode');

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
  const commentId = commentCard.dataset.commentId;
  const postCard = commentCard.closest('.post-card');
  
  const navEl = document.querySelector('.navbar');
  const isSinglePost = navEl.dataset.singlePost === 'true'; // convert string to boolean

  displayEditCommentButtonGroup({ displayButtonGroup: false, commentId });
  setTimeout(() => {
    if (!isSinglePost) {
      displayCommentButtonGroup({ displayButtonGroup: true, commentId });
    }
    if (postCard) {
      const postId = postCard.dataset.postId;
      displayNewCommentButton({ displayButton: true, postId });
    }
  }, 500);
}





    /////////////////////////////////////
   //  SHOW/HIDE COMMENT BUTTON GROUP //
  /////////////////////////////////////
 //
// function to show or hide comment button group
function displayCommentButtonGroup({ displayButtonGroup, commentId }) {
  // console.log('show comment button group: ', displayButtonGroup);
  const commentButtonGroupId = `comment${commentId}-button-group`;
  const commentButtons = [
    'edit-comment-button',
    'delete-comment-button',
  ];
  showButtons(displayButtonGroup, commentButtonGroupId, commentButtons);
}



    //////////////////////////////////////////
   //  SHOW/HIDE EDIT COMMENT BUTTON GROUP //
  //////////////////////////////////////////
 //
// function to show or hide comment button group
function displayEditCommentButtonGroup({ displayButtonGroup, commentId }) {
  // console.log('show edit comment button group: ', displayButtonGroup);
  const editCommentButtonGroupId = `comment${commentId}-edit-comment-button-group`;
  const editCommentButtons = [
    'save-comment-edit-button',
    'cancel-comment-edit-button',
  ];
  showButtons(displayButtonGroup, editCommentButtonGroupId, editCommentButtons);
}



    //////////////////////////////////////////
   //  HANDLE COMMENT POST COLLAPSE EVENT  //
  //////////////////////////////////////////
 //
// function to handle comment post collapse events
function handleCommentPostCollapseEvent({ isHide, event }) {
  
  const collapseSection = event.target;
  const collapseType = collapseSection.dataset.collapseType;
  
  if (collapseType === 'commentPost') {
    // console.log('handle comment post collapse event');
    const showCommentButtonGroup = !isHide; 
    const commentCard = collapseSection.closest('.comment-card');
    const commentId = commentCard.dataset.commentId;
    
    const isNewComment = commentCard.dataset.newComment === 'true' // convert string to boolean
    
    if (!isNewComment) {
      // console.log('display comment button group');
      displayCommentButtonGroup({ displayButtonGroup: showCommentButtonGroup, commentId });
    }
  }
}



    ////////////////////////////////////
   //  INITIALIZE COMMENT DASHBOARD  //
  ////////////////////////////////////
 //
// initialize page:
//   - add collapse & uncollapse event listeners
//   - add comment edit buttons event listener
//   - deal with new comment if there is one
function initCommentDashboard() {

  // add event listener for collapsing sections
  document.addEventListener('hide.bs.collapse', event =>
    handleCommentPostCollapseEvent({ isHide: true, event }));
  
  // add event listener for uncollapsing sections 
  document.addEventListener('show.bs.collapse', event =>
  handleCommentPostCollapseEvent({ isHide: false, event }));  

  // event listener for COMMENT EDIT BUTTONS (event delegation)
  document.querySelector('main').addEventListener('click', async function (event) {

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

  const navEl = document.querySelector('.navbar');
  const isSinglePost = navEl.dataset.singlePost === 'true'; // convert string to boolean

  if (!isSinglePost) { // dashboard comments mode

    // // define new confirm delete comment modal
    // const confirmDeleteCommentModalEl = document.getElementById('confirmDeleteCommentModal');
    // confirmDeleteCommentModal = new bootstrap.Modal(confirmDeleteCommentModalEl, {
    //   keyboard: false
    // });
    
    // // define new unable to delete comment modal
    // const unableToDeleteCommentModalEl = document.getElementById('unableToDeleteCommentModal');
    // unableToDeleteCommentModal = new bootstrap.Modal(unableToDeleteCommentModalEl, {
    //   keyboard: false
    // });
    
    // // define new unable to save comment modal
    // const unableToSaveCommentModalEl = document.getElementById('unableToSaveCommentModal');
    // unableToSaveCommentModal = new bootstrap.Modal(unableToSaveCommentModalEl, {
    //   keyboard: false
    // });
  }
}

// window.onload = function () {
  initCommentDashboard();
// };
