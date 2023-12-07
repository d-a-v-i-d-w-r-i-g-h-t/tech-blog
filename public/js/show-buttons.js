    ////////////////////
   //  Show Buttons  //
  ////////////////////
 //
// function to show/hide dashboard buttons
function showButtons(showState, buttonGroupId = '', buttons = []) {

  // do nothing if no button group ID or buttons array is empty
  if (buttonGroupId === '' || buttons.length === 0) {
    return;
  }
  const buttonGroupElement = document.getElementById(buttonGroupId);
  const button = {};

  // do nothing if buttonGroupElement doesn't exist
  if (!buttonGroupElement) {
    return;
  }
  
  buttons.forEach(buttonClass => {
    button[buttonClass] = buttonGroupElement.querySelector(`.${buttonClass}`);
  });

  if (showState === true) {
    // show and enable buttons
    buttonGroupElement.classList.remove('display-none')
    
    // delay adding visible and removing disabled for 0.1s
    setTimeout(() => {
      buttonGroupElement.classList.add('visible')
      
      buttons.forEach(buttonClass => button[buttonClass].removeAttribute('disabled'));    
      
    }, 100);

  } else {
    // hide and disable post buttons
    buttonGroupElement.classList.remove('visible')
    
    buttons.forEach(buttonClass => button[buttonClass].setAttribute('disabled', 'true'));    
    
    // add display-none after opacity has reached 0
    setTimeout(() => {
      buttonGroupElement.classList.add('display-none')
    }, 500);
  }
}
