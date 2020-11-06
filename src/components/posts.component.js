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
    const postID = $button.dataset.id;

    (confirm('Запись будет полностью удалена. Вы уверены?'))
      ? this.onDelete(postID)
      : false
  }

  saveButtonHandler($button) {
    const postID = $button.dataset.id;
    this.buttonsToggler($button);
    const editedText = this.savePostText(postID);
    this.onEdit(postID, editedText);
  }

  savePostText(id) {
    const $textArea = this.$el.querySelector(`textarea[data-postid=${id}]`);
    const parent = $textArea.parentNode;

    const editedPost = `<p class="post__text">${$textArea.value}</p>`;
    $textArea.remove();
    parent.insertAdjacentHTML('afterBegin', editedPost);

    return $textArea.value;
  }

  editPostText(id) {
    const $currentPostText = this.$el.querySelector(`[data-postid=${id}] .post__text`);

    const textHeight = $currentPostText.clientHeight;
    const text = $currentPostText.textContent;
    const parent = $currentPostText.parentNode;

    const editorField = `<textarea 
            data-postid=${id} 
            style="max-width: 900px; 
            min-height: ${textHeight + this.textareaBottomMargin}px;">${text}</textarea>`;
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
    let currentPost = this.$el.querySelector(`[data-postid=${id}]`);
    currentPost.remove();

    if (!this.isPostsExist()) this.showMessageEmpty();
  }

  async onEdit(id, text) {
    const formData = {
      date: new Date().toLocaleDateString(),
      fulltext: text,
      title: 'TestTitle',
      type: 'TestType'
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
