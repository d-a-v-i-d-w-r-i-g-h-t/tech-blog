
document.getElementById('all-posts').addEventListener('click', async function (event) {
  const cardArea = event.target.closest('.post-card');

  if (cardArea) {
    handleCardAreaClick(event, cardArea);
  }
});


async function handleCardAreaClick(event, cardArea) {
  event.preventDefault();
  
  // ignore the click if user is trying to click on the Comments title
  if (event.target.dataset.collapseComment === 'true') {
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

  const bsPostContentCollapse = bootstrap.Collapse.getOrCreateInstance(collapseElement, {
    toggle: false
  });
  const bsPostContentCollapse2 = bootstrap.Collapse.getOrCreateInstance(collapseElement2, {
    toggle: false
  });

  // const collapseStateData = cardArea.dataset.collapseState;
  const isCollapsed = cardArea.dataset.collapseState === 'true';

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