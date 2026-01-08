export const fireExternalReadyEvent = (theComponent) => {
    const event = new CustomEvent('veri-good-is-ready', {
      bubbles: true,   // Allow the event to bubble up through the DOM
      composed: true,  // Allow the event to pass through the shadow DOM boundary
    });
    theComponent.dispatchEvent(event);
}