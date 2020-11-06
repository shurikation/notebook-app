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
    } else if ($button.classList.contains('button--delete')) {
      this.deleteButtonHandler($button);
    } else if ($button.classList.contains('button--save')) {
      this.saveButtonHandler($button);
    }
  }

  editButtonHandler($button) {
    const postID = $button.dataset.id;
    this.editPost(postID, '.post__title');
    this.editPost(postID, '.post__text');
    this.buttonsToggler($button);
  }

  deleteButtonHandler($button) {
    const postID = $button.dataset.id;

    (confirm('Запись будет полностью удалена. Вы уверены?'))
        ? this.onDelete(postID)
        : false
  }

  saveButtonHandler($button) {
    const postID = $button.dataset.id;
    this.buttonsToggler($button);
    const editedTitle = this.savePost(postID, 'header');
    const editedPostText = this.savePost(postID, 'div');
    const editedPostType = this.$el.querySelector(`section[data-postId=${postID}`).getAttribute('data-postType');
    this.onEdit(postID, editedTitle, editedPostText, editedPostType);
  }

  savePost(id, postElem) {
    const $textArea = this.$el.querySelector(`${postElem} textarea[data-postid=${id}]`);

    const text = $textArea.value;
    const parent = $textArea.parentNode;

    let editedText = '';

    (postElem === 'header')
        ? editedText = `<h3 class="post__title title">${text}</h3>`
        : editedText = `<p class="post__text">${text}</p>`;

    $textArea.remove();
    parent.insertAdjacentHTML('afterBegin', editedText);

    return $textArea.value;
  }

  editPost(id, postElem) {
    const $currentPostElem = this.$el.querySelector(`section[data-postid=${id}] ${postElem}`);

    const textHeight = $currentPostElem.clientHeight;
    const text = $currentPostElem.textContent;
    const parent = $currentPostElem.parentNode;

    const editorField = `<textarea 
            data-postid=${id} 
            style="max-width: 900px; min-height: ${textHeight}px;">${text}</textarea>`;

    $currentPostElem.remove();
    parent.insertAdjacentHTML('afterBegin', editorField);
  }

  buttonsToggler($button) {
    if ($button.classList.contains('button--edit')) {
      $button.classList.remove('button--edit');
      $button.classList.add('button--save');
      $button.textContent = 'Сохранить';
    } else if ($button.classList.contains('button--save')) {
      $button.classList.remove('button--save');
      $button.classList.add('button--edit');
      $button.textContent = 'Редактировать';
    }
  }

  async onDelete(id) {
    await apiService.deletePostById(id);
    let currentPost = this.$el.querySelector(`[data-postid=${id}]`);
    currentPost.remove();

    if (!this.isPostsExist()) this.showMessageEmpty();
  }

  async onEdit(id, title, text, type) {
    const formData = {
      date: new Date().toLocaleDateString(),
      fulltext: text,
      title: title,
      type: type
    };

    await apiService.editPostById(id, formData);
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
