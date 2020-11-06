import {Component} from '../core/component'
import {FormComponent} from './form.component'
import {Validator} from '../utils/validator'
import {apiService} from '../utils/api'

export class CreateComponent extends Component {
  constructor(id) {
    super(id);
    this.isShown = false;
  }

  init() {
    this.$el.addEventListener('submit', (event) => this.submitHandler(event));

    this.form = new FormComponent(this.$el, {
      title: [Validator.validate],
      fulltext: [Validator.validate]
    });
  }

  async submitHandler(event) {
    event.preventDefault();

    if (this.form.isValid()) {
      const formData = {
        date: new Date().toLocaleDateString(),
        type: this.$el.type.value,
        ...this.form.getValue()
      };

      await apiService.addPost(formData);
      this.form.clear();

      alert('Пост опубликован!');
    }
  }
}
