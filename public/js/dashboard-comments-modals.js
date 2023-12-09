    // define new confirm delete comment modal
    const confirmDeleteCommentModalEl = document.getElementById('confirmDeleteCommentModal');
    confirmDeleteCommentModal = new bootstrap.Modal(confirmDeleteCommentModalEl, {
      keyboard: false
    });
    
    // define new unable to delete comment modal
    const unableToDeleteCommentModalEl = document.getElementById('unableToDeleteCommentModal');
    unableToDeleteCommentModal = new bootstrap.Modal(unableToDeleteCommentModalEl, {
      keyboard: false
    });
    
    // define new unable to save comment modal
    const unableToSaveCommentModalEl = document.getElementById('unableToSaveCommentModal');
    unableToSaveCommentModal = new bootstrap.Modal(unableToSaveCommentModalEl, {
      keyboard: false
    });
