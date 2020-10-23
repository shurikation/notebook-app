export function renderButton(id, type = 'delete', buttonText = 'Удалить') { //класс, текст
  return `<button 
        data-id="${id}"
        data-type="${type}" 
        class="button">
            ${buttonText}
        </button>`;
}