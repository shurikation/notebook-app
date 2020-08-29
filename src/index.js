import {NavbarComponent} from "./components/navbar.component";
import {CreateComponent} from "./components/create.component";
import {PostsComponent} from "./components/posts.component";

const navigation = new NavbarComponent('navigation');
const posts = new PostsComponent('posts');
const create = new CreateComponent('create');

navigation.addTabsDataToComponent([
  {name: 'create', component: create},
  {name: 'posts', component: posts},
]);

