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

    (confirm('Запись будет удалена. Вы уверены?'))
        ? this.onDelete(postId)
        : false
  }

  async onDelete(id) {
    await apiService.deletePostById(id);
    let currentPost = document.querySelector(`[data-postId=${id}]`);
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
