import {Component} from "../core/component";
import {loader} from "./loader.component";

export class NavbarComponent extends Component {
  constructor(id) {
    super(id);
    this.tabs = [];
  }

  init() {
    this.$el.addEventListener('click', (event) => {
      this.tabsDisplayHandler(event);
      this.componentsDisplayHandler(event);
    });
  }

  addTabsDataToComponent(tabs) {
    this.tabs = tabs;
  }

  tabsDisplayHandler(event) {
    event.preventDefault();
    if (event.target.classList.contains('tab')) {
      Array.from(this.$el.querySelectorAll('.tab')).forEach(tab => {
        tab.classList.remove('active');
      });
      event.target.classList.add('active');
    }
  }

  componentsDisplayHandler(event) {
    let activeTab = '';
    let nonActiveTabs = [];

    this.tabs.forEach(tab => {
      (tab.name === event.target.dataset.name)
          ? activeTab = tab
          : nonActiveTabs.push(tab);

      if (tab.name === "create") loader.hide();
    });

    nonActiveTabs.forEach(tab => {
      tab.component.hide();
      tab.component.isShown = false;
    });

    //Если компонент не отрендерился
    if(!activeTab) return false;

    // Если компонент активен/отображается сейчас, то запретить повторный рендеринг
    // ...по клику на активный таб
    if (!activeTab.component.isShown) {
      activeTab.component.show();
      activeTab.component.isShown = true;
    }
  }
}



