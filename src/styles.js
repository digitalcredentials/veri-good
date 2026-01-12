const styles = new CSSStyleSheet();



const componentStyles = `
  :host {
    --default-radius: 6px;
    --default-depth: 5px;
    --default-blue: #002147;

    display: inline-block;
    contain: content;
    color: var(--default-blue);
    background: #c9ccc6;
    border-radius: var(--default-radius);
    width: 380px;
    height: 450px;
    text-align: center;
    box-shadow: 0 0 var(--default-depth) rgba(0,0,0,.5);
  }

  .header {
    margin-top: 1.5em;
    position: relative;
  }

  .title {
    font-weight: bold;
    font-size: 16px;
  }

  .cred-label {
    font-style: italic;
    font-size: 12px;
    font-weight: 400;
    padding:.2em;
  }

.btn {
  background-color: var(--default-blue); /* Blue background */
  border: none;
  color: #78b13f; /* green text/icon color */
  padding: 8px 20px; /* Some padding */
  font-weight: 600;
  font-size:15px;
  cursor: pointer; /* Add a mouse pointer on hover */
  border-radius: 8px; /* Rounded corners */
  display: flex; /* Use flexbox to align icon and text */
  align-items: center; 
  gap: 12px; /* space between icon and text */
}



#verifyAnotherBtn {
  margin-top: 2em;
}

.check {
  display: inline-block;
  transform: rotate(45deg);
  height: 12px;
  width: 6px;
  border-bottom: 3px solid;
  border-right: 3px solid;
  margin-bottom: 2px;
}

.btn:hover {
  background-color: #78b13f;
  color: var(--default-blue);
}

.resultLine {
    display: none;
    flex-direction: row;
    justify-content: left;
    padding: 0 4em .5em 4em;
    font-weight: 500;
    align-items: center;
}

#result-container, #error-container, #details-container, #verify-spinner, #verifyAnotherBtn, #error-message {
  display: none;
}

.vc-area {
  height: 150px;
  width: 200px;
  max-height: 180px;
  max-width: 250px;
  padding: 10px;
  margin: 20px;
  background: #e3e8df;
  border-radius: var(--radius, var(--default-radius));
  box-shadow: 0 0 var(--default-depth) rgba(0,0,0,.5);
}

#verify-spinner {
    flex-direction: column;
    align-items: center; 
    justify-content: center;
    height: 200px;
}

#spinner-message {
  font: 600 16px 'Varela Round', sans-serif;
}

.hide-on-reset {
  display: none;
}
  
#input-container {
    display: flex; 
    flex-direction: column;
    align-items: center; 
}

  #details-container {
    font: 550 14px 'Varela Round', sans-serif;
    margin: 25px 0 40px 0;
    flex-direction: column;
    justify-content: center;
  }

  #result-container {
    flex-direction: column;
    justify-content: center;
  }

  #error-container {
  margin:3em;
  }

  .error-lines {
    padding-bottom: .5em;
  }

  #error-message {
      margin:1em;
      padding: 1em;
      background: #e3e8df;
  }

  #button-container {
    display: flex; 
    flex-direction: column;
    justify-content: center;
    align-items: center; 
  }

  #result-list {
    height: 100px;
    padding-left:2em;
    font: 400 14px 'Varela Round', sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: top;
    align-items: left;
  }
`;

const verifyingStyles = `

.circle-loader {
  margin-right: 2em;
  border: 3px solid rgba(0, 0, 0, 0.2);
  border-left-color: #5cb85c;
  animation: loader-spin 1.2s infinite linear;
  position: relative;
  display: inline-block;
  vertical-align: top;
  border-radius: 50%;
  width: 1.5em;
  height: 1.5em;
}

.big-circle-loader {
  border: 5px solid rgba(0, 0, 0, 0.2);
  border-left-color: #5cb85c;
  animation: loader-spin 3s infinite linear;
  border-radius: 50%;
  width: 5em;
  height: 5em;
  margin: 2em;
}

.load-complete {
  -webkit-animation: none;
  animation: none;
  border-color: #5cb85c;
  transition: border 500ms ease-out;
}

.checkmark {
  display: none;
}

.checkmark.draw:after {
  animation-duration: 800ms;
  animation-timing-function: ease;
  animation-name: checkmark;
  transform: scaleX(-1) rotate(135deg);
}
  
.checkmark:after {
  opacity: 1;
  height: .8em;
  width: .4em;
  transform-origin: left top;
  border-right: 3px solid #5cb85c;
  border-top: 3px solid #5cb85c;
  content: "";
  left: .2em;
  top: .8em;
  position: absolute;
}

@keyframes loader-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes checkmark {
  0% {
    height: 0;
    width: 0;
    opacity: 1;
  }
  20% {
    height: 0;
    width: 0.4em;
    opacity: 1;
  }
  40% {
    height: 0.8em;
    width: 0.4em;
    opacity: 1;
  }
  100% {
    height: 0.8em;
    width: 0.4em;
    opacity: 1;
  }
}
`;

const crossStyles = `.cross {
  position: relative;
  height: 1.1em;
  width: 1.1em;
  display: none; 
}

.cross::before,
.cross::after {
  content: "";
  position: absolute;
  left: .2em;
  top: .7em;
  background-color: #d00; /* Color of the 'X' */
  /* Initially set the size to 0 for the animation start point */
  width: 0;
  height: 0; 
  /* Apply animation over a specific duration and timing function */
  animation: drawX 1s ease-in-out forwards;
}

/* Rotate the two pseudo-elements to form the 'X' shape */
.cross::before {
  transform: rotate(45deg);
}

.cross::after {
  transform: rotate(-45deg);
}

/* Keyframes define the animation sequence */
@keyframes drawX {
  0% {
    width: 0;
    height: 0;
  }
  50% {
    /* Draw the first half (e.g., width) of both lines simultaneously */
    width: 100%;
    height: 2px; /* Desired thickness of the lines */
  }
  100% {
    /* Draw the second half (e.g., height) after the first part is complete */
    width: 100%;
    height: 2px; /* Desired thickness of the lines */
  }
}`;

const dragNDropStyles = `
.drop-zone {
  height: 10px;
  width: 200px;
  margin: 0 0 25px;
  padding: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  border: 2px dashed grey;
  border-radius: 10px;
  font-family: sans-serif;
  transition: background-color 0.3s; 
}

.drop-zone:hover {
  background-color: #f1f1f1;
}

/* Style applied when a file is being dragged over the zone */
.drop-zone--over {
  border-style: solid;
  background-color: #e9e9e9;
}

.drop-zone__input {
  display: none; /* Hide the actual file input */
}
`
const dialogStyles = `

#more-link {
    font-style: italic;
    font-size: 12px;    
    font-weight: 400;
    padding-top:.5em;
    text-decoration: underline;
    cursor: pointer;
}

#more-link:hover {
  color: #78b13f;
}

#dialog-wrapper {
  position: relative;
}

dialog:focus {outline:none;}

button:focus {outline:none;}

dialog {
  font: 550 14px 'Varela Round', sans-serif;
  flex-direction: column;
  justify-content: center;
  background: lightgrey;
  border: none;
  border-radius: .5rem;
  margin: 0;
  position: absolute;
  height: 340px;
  width: 270px;
}

#more-criteria p {
  font: 400 13px 'Varela Round', sans-serif;
  padding: 0;
  margin: 0 0 .3em 0;
}

#dialog-button {
  font-size:13px;
  padding: 7px 12px;
  margin-top:1em;
}

.dialog-lines {
  font: 400 13px 'Varela Round', sans-serif;
  margin-bottom: 1em;
}
  
#more-title {
  font: 550 15px 'Varela Round', sans-serif;
  margin-bottom: 1em;
}

.dialog-heading {
  font: 550 14px 'Varela Round', sans-serif;
  margin: .2em;
}

#criteria-heading {
  margin-bottom: .1em;
}

dialog::backdrop {
  background-color: hsl(90, 5.56%, 78.82%, 0.5);
}

`

styles.replaceSync(componentStyles + verifyingStyles + crossStyles + dragNDropStyles + dialogStyles);

export default styles;
