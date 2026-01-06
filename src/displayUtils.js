export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const showElement = (selector, ancestor,displayType='block') => {
    ancestor.querySelector(selector).style.display = displayType
}

export const hideElement = (selector, ancestor) => {
    ancestor.querySelector(selector).style.display = 'none'
}

export const showText = (selector, ancestor, text) => {
    ancestor.querySelector(selector).textContent = text
}