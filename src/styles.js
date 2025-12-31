const styles = new CSSStyleSheet();



const componentStyles = `
  :host {

    --default-color: grey;
    --default-radius: 6px;
    --default-depth: 5px;

    display: inline-block;
    contain: content;
    color: white;
    background: var(--color, var(--default-color));
    border-radius: var(--radius, var(--default-radius));
    min-width: 325px;
    max-width: 800px;
    text-align: center;
    box-shadow: 0 0 var(--depth, var(--default-depth)) rgba(0,0,0,.5);
  }

  .header {
    margin: 16px 0;
    position: relative;
  }

  h3 {
    font-weight: bold;
    font-family: sans-serif;
    letter-spacing: 4px;
    font-size: 32px;
    margin: 0;
    padding: 0;
  }

  h4 {
    font-family: sans-serif;
    font-size: 18px;
    margin: 0;
    padding: 0;
  }

  .body {
    text: #414856;
    color: white;
    padding: 32px 8px;
    font-size: 20px;
    font-family: sans-serif;
  }

  .footer {
    height: 16px;
    background: var(--color, var(--default-color));
    border-radius: 0 0 var(--radius, var(--default-radius)) var(--radius, var(--default-radius));
  }

  .result-cont {
    background: #B0BF1A;
}

  .vc-area {
    height: 100px;
    width: 600px;
    }



    .resultLine {
        display: none;
        flex-direction: row;
        align-items: center;
    }

   

#result-list {
  height: 10vh;
  font: 400 16px 'Varela Round', sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
`






   const verifyingStyles = `
.circle-loader {
  margin-right: 2em;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-left-color: #5cb85c;
  animation: loader-spin 1.2s infinite linear;
  position: relative;
  display: inline-block;
  vertical-align: top;
  border-radius: 50%;
  width: 1.5em;
  height: 1.5em;
}
.btn-success {
  background: #08c42e;
  border: none;
  color: #fff;
  font-size: 16px;
  padding: 10px 15px;
  border-radius: 5px;
	cursor: pointer;
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

.cross {
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
`

styles.replaceSync(componentStyles + verifyingStyles);

export default styles