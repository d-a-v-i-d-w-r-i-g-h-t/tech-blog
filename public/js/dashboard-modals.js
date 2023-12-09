// set up modals

// define new confirm delete post modal
const confirmDeletePostModalEl = document.getElementById('confirmDeletePostModal');
confirmDeletePostModal = new bootstrap.Modal(confirmDeletePostModalEl, {
  keyboard: false
});

// define new unable to delete post modal
const unableToDeletePostModalEl = document.getElementById('unableToDeletePostModal');
unableToDeletePostModal = new bootstrap.Modal(unableToDeletePostModalEl, {
  keyboard: false
});

// define new unable to save post modal
const unableToSavePostModalEl = document.getElementById('unableToSavePostModal');
unableToSavePostModal = new bootstrap.Modal(unableToSavePostModalEl, {
  keyboard: false
});
