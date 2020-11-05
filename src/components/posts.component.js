import {Component} from '../core/component'
import {Transform} from "../utils/transform";
import {apiService} from "../utils/api";
import {loader} from "./loader.component";
import {renderPost} from "../models/post.model"

export class PostsComponent extends Component {
  constructor(id) {
    super(id);
    this.isShown = false;
    this.textareaBottomMargin = 5;//px
  }

  init() {
    this.$el.addEventListener('click', (event) => this.buttonsClickHandler(event));
  }

  buttonsClickHandler(event) {
    if (event.target.tagName !== 'BUTTON') return false;

    const $button = event.target;

    if ($button.classList.contains('button--edit')) {
      this.editButtonHandler($button);
    } else if($button.classList.contains('button--delete')) {
      this.deleteButtonHandler($button);
    } else if($button.classList.contains('button--save')) {
      this.saveButtonHandler($button);
    }
  }

  editButtonHandler($button) {
    const postID = $button.dataset.id;
    this.editPostText(postID);
    this.buttonsToggler($button);
  }

  deleteButtonHandler($button) {

  }

  saveButtonHandler($button) {
    this.buttonsToggler($button);
    //1. Считать value из textarea
    //2. Убрать textarea - вместо добавить блок с value из textarea (Front)
    //3. Изменить текст поста на сервере (Back)
  }

  editPostText(id) {
    const $currentPostText = this.$el.querySelector(`[data-postId=${id}] .post__text`);

    const textHeight = $currentPostText.clientHeight;
    const text = $currentPostText.textContent;
    const parent = $currentPostText.parentNode;

    const editorField = `<textarea style="max-width: 900px; min-height: ${textHeight + this.textareaBottomMargin}px;">${text}</textarea>`;
    $currentPostText.remove();
    parent.insertAdjacentHTML('afterBegin', editorField);
  }

  buttonsToggler($button) {
    if ($button.classList.contains('button--edit')) {
      $button.classList.remove('button--edit');
      $button.classList.add('button--save');
      $button.textContent = 'Сохранить';
    } else if($button.classList.contains('button--save')) {
      $button.classList.remove('button--save');
      $button.classList.add('button--edit');
      $button.textContent = 'Редактировать';
    }
  }

  async onDelete(id) {
    await apiService.deletePostById(id);
    let currentPost = this.$el.querySelector(`[data-postId=${id}]`);
    currentPost.remove();

    if (!this.isPostsExist()) this.showMessageEmpty();
  }

  onHide() {
    this.$el.innerHTML = '';
  }

  async onShow() {
    loader.show();

    const firebaseData = await apiService.fetchPosts();

    if (!firebaseData) {
      loader.hide();
      this.showMessageEmpty();
      return false;
    }

    const posts = Transform.firebaseObjectToArray(firebaseData);
    const html = posts.map(post => renderPost(post)).reverse();

    loader.hide();

    this.$el.insertAdjacentHTML('afterBegin', html.join(''));
  }

  showMessageEmpty() {
    this.$el.insertAdjacentHTML('afterBegin',
        `<span class="empty-message">Ваш дневник пуст...</span>`);
  }

  isPostsExist() {
    return this.$el.childElementCount;
  }
}
