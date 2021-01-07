/* Read GET parameter */
export function getParameter(parameterName) {
  let result = false, tmp = []
  let items = location.search.substr(1).split("&")
  for (let index = 0; index < items.length; index++) {
    tmp = items[index].split("=")
    if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1])
  }
  return result
}

/* Decode HTML entities */
export let decodeEntities = (function() {
  let element = document.createElement('div');

  function decodeHTMLEntities (str) {
    if(str && typeof str === 'string') {
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
      element.innerHTML = str;
      str = element.textContent;
      element.textContent = '';
    }
    return str;
  }
  return decodeHTMLEntities;
})();
