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
    this.draggedItem = undefined;

    // Добавление уникальных номеров для каждого списка
    this.tasksList.forEach((list) => list.id = uuidv4());
    // console.log(this.tasksList);
  }

  static itemsHTML(items) {
    let html = '';
    items.forEach((taskText) => {
      html += 
        `<li class="taskslist-item list-group-item mb-2">
          <div class="taskslist-item-text">${taskText}</div>
          <div class="taskslist-item-close hidden" title="Удалить задачу">&#10005;</div>
        </li>`;
    });
    return html;
  };

  static tasksListHTML(tasksList) {
    return `
      <div class="col-md-4 h-100 py-2">        
        <div class="taskslist card" id="taskslist-${tasksList.id}">
            <div class="taskslist-header card-header p-2">
                <h5 class="taskslist-header-title mb-0">${tasksList.title}</h5>
            </div>

            <div class="taskslist-body card-body h-100 p-2" data-mdb-perfect-scrollbar="true">
                <ul class="taskslist-items list-group">
                    ${TasksListWidget.itemsHTML(tasksList.items)}
                </ul>
            </div>

            <div class="taskslist-footer card-footer text-start p-2">
                <div class="taskslist-items-add">&#10009; Добавить новую карточку</div>
                <div class="taskslist-items-card hidden">
                  <div class="form-outline mb-2">
                    <textarea class="new-item form-control" rows="2" 
                      placeholder="Введите текст карточки"></textarea>
                  </div>
                  <button class="taskslist-new-item-add btn btn-success btn-sm" title="Добавить новую задачу">
                    Добавить
                  </button>
                  <button class="taskslist-new-item-close btn btn-transparent btn-sm" title="Закрыть окно добавления">
                    &#10005;
                  </button>
                </div>
            </div>
        </div>
      </div>
    `;
  }

  static get tasksListIDSelector() {
    return '[id=taskslist-';
  }

  static get showCardSelector() {
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

  static get closeCardSelector() {
    return '.taskslist-new-item-close';
  }

  static get addCardSelector() {
    return '.taskslist-new-item-add';
  }

  static get cardDivSelector() {
    return '.taskslist-items-card';
  }

  static get textNewItemSelector() {
    return '.new-item';
  }

  bindToDOM() {
    this.parentEl.innerHTML = '';
    this.tasksList.forEach((tasksList) => {
      this.parentEl.innerHTML += TasksListWidget.tasksListHTML(tasksList);
    });

    this.tasksList.forEach((list) => {
      this.initAddItemEvents(list.id);
      this.initItemEvents(list.id);
    });
  }

  initAddItemEvents(id) {
    const tasksList = this.parentEl.querySelector(`${TasksListWidget.tasksListIDSelector}${id}]`);
    const ul = tasksList.querySelector('ul');
    const showCard = tasksList.querySelector(TasksListWidget.showCardSelector);
    const cardDiv = tasksList.querySelector(TasksListWidget.cardDivSelector);
    const addCard = tasksList.querySelector(TasksListWidget.addCardSelector);
    const closeCard = tasksList.querySelector(TasksListWidget.closeCardSelector);

    showCard.addEventListener('click', (evt) => this.onClickShowCard(evt, cardDiv));
    addCard.addEventListener('click', (evt) => this.onClickAddCard(evt, cardDiv, ul, id));
    closeCard.addEventListener('click', (evt) => this.onClickCloseCard(evt, cardDiv, showCard));
  }

  // Добавление новой задачи
  onClickAddCard(evt, cardDiv, ul, id) {
    evt.preventDefault();
    const textItem = cardDiv.querySelector(TasksListWidget.textNewItemSelector);
    if (textItem.value.trim().length > 0) {
      ul.innerHTML += TasksListWidget.itemsHTML([textItem.value]);
      this.initItemEvents(id);
    }
    textItem.value = '';
  }

  // Показать карточку добавления новой задачи
  onClickShowCard(evt, cardDiv) {
    evt.preventDefault();
    if (cardDiv && cardDiv.classList.contains('hidden')) {
      cardDiv.classList.remove('hidden');
    }
    evt.target.classList.add('hidden');
  }

  // Закрыть карточку добавления новой задачи
  onClickCloseCard(evt, cardDiv, showCard) {
    evt.preventDefault();
    if (showCard && showCard.classList.contains('hidden')) {
      showCard.classList.remove('hidden');
    }
    cardDiv.classList.add('hidden');
  }


  initItemEvents(id) {
    const tasksList = this.parentEl.querySelector(`${TasksListWidget.tasksListIDSelector}${id}]`);
    const items = tasksList.querySelectorAll(TasksListWidget.itemSelector);
    items.forEach((item) => {
      // console.log(item);

      const closeButton = item.querySelector(TasksListWidget.delItemSelector);
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

      item.addEventListener('mousedown', (evt) => {
        evt.preventDefault();
        console.log('mousedown', evt.target, evt.currentTarget);
        if (evt.target.classList.contains('taskslist-item-close') || 
          !evt.currentTarget.classList.contains('taskslist-item')) {
          return;
        }

        this.draggedItem = evt.currentTarget;
        this.draggedItem.classList.add('dragged');

        this.draggedItem.addEventListener('mouseup', this.onMouseUp(evt));
      });

      item.addEventListener('mouseup', (evt) => {
      });
    });
  }

  onMouseUp(evt) {
    // evt.preventDefault();
    console.log('mouseup', evt.target, evt.currentTarget, this.draggedItem);
    if (!this.draggedItem) {
      return;
    }

    this.draggedItem.classList.remove('dragged');
    this.draggedItem = undefined;
  };

}


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
