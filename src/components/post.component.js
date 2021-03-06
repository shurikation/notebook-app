import {renderTag} from "./tag.component";
import {renderButton} from "./button.component";

export function renderPost(post) {
  const tag = renderTag(post);

  const deleteButton = renderButton(post.id, 'Удалить', 'button--delete');
  const editButton = renderButton(post.id,  'Редактировать', 'button--edit');

  return `<section data-postId=${post.id} data-postType=${post.type} class="feed__post post">
 <div class="post__container">
      <header class="post__header">
        <h3 class="post__title title">${post.title}</h3>
        <ul class="tags post__tags">
         ${tag}
        </ul>
      </header>
      <div class="post__main">
        <p class="post__text">${post.fulltext}</p>
      </div>
      <span class="post__date">${post.date}</span>
      <footer class="post__footer">
         ${editButton}  
         ${deleteButton}
      </footer>
    </div>
</section>`
}