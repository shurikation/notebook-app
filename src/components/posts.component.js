import {Component} from '../core/component'
import {Transform} from "../utils/transform";
import {apiService} from "../utils/api";
import {loader} from "./loader.component";
import {renderPost} from "../models/post.model"

export class PostsComponent extends Component {
  constructor(id) {
    super(id);
    this.isShown = false;
  }

  init() {
    this.$el.addEventListener('click', (event) => this.buttonClickHandler(event));
  }

  buttonClickHandler(event) {
    if(event.target.tagName !== 'BUTTON') return false;
    const postId = event.target.dataset.id;


    console.log(event.target.dataset.type);
    if (event.target.dataset.type === 'edit') {
      this.changePostText(postId);
      this.changeButtonText(event.target);
    } else {
      (confirm('Запись будет удалена. Вы уверены?'))
          ? this.onDelete(postId)
          : false
    }
  }

  changePostText(id) {
    let currentPostText = this.$el.querySelector(`[data-postId=${id}] .post__text`);
    let text = currentPostText.textContent;
    let parent = currentPostText.parentNode;


    let editorField = `<textarea style="color: black;display:flex;min-width:900px;resize:none">${text}</textarea>`;
    currentPostText.remove();
    parent.insertAdjacentHTML('afterBegin', editorField);
    // currentPostText.parentNode.replaceChild(editorField, currentPostText);
    // var e = document.getElementsByTagName('span')[0];
    //
    // var d = document.createElement('div');
    // d.innerHTML = e.innerHTML;
    //
    // e.parentNode.replaceChild(d, e);

  }

  changeButtonText(button) {

  }

  async onDelete(id) {
    await apiService.deletePostById(id);
    let currentPost = this.$el.querySelector(`[data-postId=${id}]`);
    currentPost.remove();

    if(!this.isPostsExist()) this.showMessageEmpty();
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
