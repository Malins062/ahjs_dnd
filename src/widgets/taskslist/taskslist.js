import './taskslist.css';
import { v4 as uuidv4 } from 'uuid';

/*
class TasksListWidget

  Параметры конструктора:
    parentEl - контейнер
    tasksList - первоначальный список задач = [
      {
        title: "Наименование списка 1",
        items: ['Задание 1', 'Задание 2', ...]
      },

      {
        title: "Наименование списка 2",
        items: ['Задание 1', 'Задание 2', ...]
      },

      ...
    ]
*/
export default class TasksListWidget {
  constructor(parentEl, tasksList) {
    this.parentEl = parentEl;
    this.tasksList = tasksList;

    // Добавление уникальных номеров для каждого списка
    this.tasksList.forEach((list) => list.id = uuidv4());
    // console.log(this.tasksList);
  }

  static tasksListHTML(tasksList) {
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
      <div class="col-md-4 h-100 py-2">        
        <div class="taskslist card" id="taskslist-${tasksList.id}">
            <div class="taskslist-header card-header p-2">
                <h5 class="taskslist-header-title mb-0">${tasksList.title}</h5>
            </div>

            <div class="taskslist-body card-body h-100 p-2" data-mdb-perfect-scrollbar="true">
                <ul class="taskslist-items list-group">
                    ${itemsHTML(tasksList.items)}
                </ul>
            </div>

            <div class="taskslist-footer card-footer text-start p-2">
                <div class="taskslist-items-add">&#10009; Добавить новую карточку</div>
                <div class="taskslist-items-card hidden">
                  <div class="form-outline mb-2">
                    <textarea class="new-item form-control" rows="2" placeholder="Введите текст карточки"></textarea>
                  </div>
                  <button class="add-new-item btn btn-success btn-sm">Добавить</button>
                  <button class="close-new-item btn btn-transparent btn-sm">&#10005;</button>
                </div>
            </div>
        </div>
      </div>
    `;
  }

  bindToDOM() {
    this.parentEl.innerHTML = '';
    this.tasksList.forEach((tasksList) => {
      this.parentEl.innerHTML += TasksListWidget.tasksListHTML(tasksList);
    });

    this.initEvents();
  }

  static get tasksListIDSelector() {
    return '[id=taskslist-';
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

  initEvents() {
    this.tasksList.forEach((list) => {
      const tasksList = this.parentEl.querySelector(`${TasksListWidget.tasksListIDSelector}${list.id}]`);
      const addCardButton = tasksList.querySelector(TasksListWidget.addItemSelector);
      const cardDiv = tasksList.querySelector(TasksListWidget.cardDivSelector);

      console.log(tasksList, addCardButton);
      addCardButton.addEventListener('click', (evt) => this.onClickAddCard(evt, list.id, cardDiv));
    })

    // const taskslistItems = this.parentEl.querySelector(TasksListWidget.itemsSelector);
    // taskslistItems.addEventListener('mousedown', (evt) => {
    //   evt.preventDefault();
    //   console.log(evt.target, evt.currentTarget);
    //   if (!evt.currentTarget.classList.contains('taskslist-item')) {
    //     return;
    //   }

    //   this.draggedEl = evt.currentTarget;
    //   this.draggedEl.classList.add('dragged');
    //   console.log(this.draggedEl);
    // });

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

  onClickAddCard(evt, id, cardDiv) {
    evt.preventDefault();
    console.log(evt.target, evt.currentTarget, id);
    console.log(cardDiv);
    if (cardDiv && cardDiv.classList.contains('hidden')) {
      cardDiv.classList.remove('hidden');
    }
    evt.target.classList.add('hidden');
  }
}
