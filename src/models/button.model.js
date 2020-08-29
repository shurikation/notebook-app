export function renderButton(post) {
  return `<button 
        data-id="${post.id}" 
        class="button">
            Удалить
        </button>`;
}