import {renderTag} from "./tag.model";
import {renderButton} from "./button.model";

export function renderPost(post, options = {}) {
  console.log(post);
  const tag = renderTag(post);
  const button = renderButton(post);

  return `<section data-postId=${post.id} class="feed__post post">
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
      <footer class="post__footer">
        <span class="post__date">${post.date}</span>
         ${button}
         ${button}
      </footer>
    </div>
</section>`
}