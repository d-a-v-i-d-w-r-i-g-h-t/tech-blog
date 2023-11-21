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