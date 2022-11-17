import './tasklist.css';

/*
class TaskListWidget

  Параметры конструктора:
    parentEl - контейнер
    title - название подсказки
    items - список инициализированных задач (array)
*/
export default class TasksListWidget {
  constructor(parentEl, title, items) {
    this.parentEl = parentEl;
    this.title = title;
    this.items = items;
    // console.log(parentEl, title, items);
  }

  get markup() {
    const itemsHTML = (items) => {
      let html = '';
      items.forEach(taskText => {
        html += `<li class="taskslist-item list-group-item mb-2">${taskText}</li>`
      })   
      return html;              
    };

    return `
      <div class="taskslist card">
          <div class="taskslist-header card-header p-2">
              <h5 class="taskslist-header-title mb-0">${this.title}</h5>
          </div>

          <div class="taskslist-body card-body h-100 p-2" data-mdb-perfect-scrollbar="true">
              <ul class="taskslist-items list-group">
                  ${itemsHTML(this.items)}
              </ul>
          </div>

          <div class="taskslist-footer card-footer text-start p-2">
              <div class="taskslist-items-add">&#10006;<div>
              <button class="btn btn-success" id="tasklist-add">Добавить</button>
          </div>
      </div>
    `;
  }

  static get addItemSelector() {
    return '[id=tasklist-add]';
  }

  static get itemSelector() {
    return 'tasklist-item';
  }
  
  bindToDOM() {
    this.parentEl.innerHTML = this.markup;
    const button = this.parentEl.querySelector(TasksListWidget.addItemSelector);
    // console.log(this.parentEl, this.constructor.submitSelector, submit);
    button.addEventListener('click', e => this.onClick(e));
  }

  onClick(e) {
    e.preventDefault();
    console.dir(e)
  }
}
