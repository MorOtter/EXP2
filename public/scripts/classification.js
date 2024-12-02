// Variable to hold the currently selected classification
let selectedClassification = null;

// Object containing classification button elements
const classificationButtons = {
  trusted: document.getElementById("trusted"),
  suspect: document.getElementById("suspect"),
  hostile: document.getElementById("hostile")
};

// Initialize classification buttons with click event listeners
export const initializeClassificationButtons = () => {
  classificationButtons.trusted.addEventListener("click", () => setClassification("trusted"));
  classificationButtons.suspect.addEventListener("click", () => setClassification("suspect"));
  classificationButtons.hostile.addEventListener("click", () => setClassification("hostile"));
};

// Set the currently selected classification and update button states
const setClassification = (classification) => {
  // Remove 'active' class from all buttons
  Object.values(classificationButtons).forEach(button => button.classList.remove('active'));

  // Set the new classification and add 'active' class to the selected button
  selectedClassification = classification;
  classificationButtons[classification].classList.add('active');

};

// Confirm the classification for the selected point
export const confirmClassification = (dotElement, selectedDotInfo, classification) => {

  setClassification(classification);

  classificationButtons[classification].classList.remove('active');
  
  if ((classification && selectedDotInfo)) {

    // Update the corresponding dot element's class based on the classification
    
    dotElement.classList.remove('trusted', 'suspect', 'hostile');

    switch (selectedClassification) {
      case "trusted":
        dotElement.classList.add('trusted');
        break;
      case "suspect":
        dotElement.classList.add('suspect');
        break;
      case "hostile":
        dotElement.classList.add('hostile');
        break;
    }

    // Update the classification field in the connection information panel
    document.getElementById('info-classification').textContent = `${selectedClassification}`;
    
    // update packet data
    selectedDotInfo.classification = selectedClassification;
    selectedDotInfo['inputTime'] = new Date().toISOString();
  } else {
    console.log("No classification selected.");
  }
};

