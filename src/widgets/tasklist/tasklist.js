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
      items.forEach((taskText) => {
        html
          += `<li class="taskslist-item list-group-item mb-2">
            <div class="taskslist-item-text">${taskText}</div>
            <div class="taskslist-item-close hidden">&#10005;</div>
          </li>`;
      });
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
              <div class="taskslist-items-add">&#10009; Добавить новую карточку</div>
              <div class="taskslist-items-card hidden">
                <button class="btn btn-success btn-sm" id="tasklist-add">Добавить</button>
                <div class="taskslist-items-card-close">&#10005;<div>
              </div>
          </div>
      </div>
    `;
  }

  static get addItemSelector() {
    return '.taskslist-items-add';
  }

  static get itemSelector() {
    return '.taskslist-item';
  }

  static get itemsSelector() {
    return '.taskslist-items';
  }

  static get delItemSelector() {
    return '.taskslist-item-close';
  }

  static get cardDivSelector() {
    return '.taskslist-items-card';
  }

  bindToDOM() {
    this.parentEl.innerHTML = this.markup;
    this.draggedEl = undefined;
    this.initEvents();
  }

  initEvents() {
    const buttonAddCard = this.parentEl.querySelector(TasksListWidget.addItemSelector);
    buttonAddCard.addEventListener('click', (evt) => this.onClickAddItem(evt));

    const taskslistItems = this.parentEl.querySelector(TasksListWidget.itemsSelector);
    taskslistItems.addEventListener('mousedown', (evt) => {
      evt.preventDefault();
      console.log(evt.target, evt.currentTarget);
      if (!evt.currentTarget.classList.contains('taskslist-item')) {
        return;
      }

      this.draggedEl = evt.currentTarget;
      this.draggedEl.classList.add('dragged');
      console.log(this.draggedEl);
    });

    const items = this.parentEl.querySelectorAll(TasksListWidget.itemSelector);
    items.forEach((item) => {
      // console.log(item);

      const closeButton = item.querySelector(TasksListWidget.delItemSelector);
      // console.log(closeButton);

      closeButton.addEventListener('click', () => {
        item.remove();
      });

      item.addEventListener('mouseover', (evt) => {
        evt.preventDefault();
        if (closeButton.classList.contains('hidden')) {
          closeButton.classList.remove('hidden');
        }
      });

      item.addEventListener('mouseout', (evt) => {
        evt.preventDefault();
        const delButtons = document.querySelectorAll(TasksListWidget.delItemSelector);
        delButtons.forEach((delButton) => {
          if (delButton && !delButton.classList.contains('hidden')) {
            delButton.classList.add('hidden');
          }
        });
      });
    });
  }

  onClickAddItem(evt) {
    evt.preventDefault();
    console.log(evt.target, evt.currentTarget);
    const cardDiv = document.querySelector(TasksListWidget.cardDivSelector);
    console.log(cardDiv);
    if (cardDiv && cardDiv.classList.contains('hidden')) {
      cardDiv.classList.remove('hidden');
    }
    evt.target.classList.add('hidden');
  }
}
