export function renderTag(post) {
  switch (post.type) {
    case 'note':
     return `<li class="tag">#Заметка</li>`;
    case 'idea':
      return `<li class="tag">#Идея</li>`;
    case 'quote':
      return `<li class="tag">#Цитата</li>`;
  }
}
