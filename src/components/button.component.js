export function renderButton(id, buttonText, className) {
  return `<button 
        data-id="${id}"
        class="button ${className}">
            ${buttonText}
        </button>`;
}