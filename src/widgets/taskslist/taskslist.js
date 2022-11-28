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
        `<li class="taskslist-item list-group-item mb-2" id="${uuidv4()}" draggable="true">
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

  static tasksListIDSelector(id) {
    return `[id=taskslist-${id}]`;
  }

  static get showCardSelector() {
    return '.taskslist-items-add';
  }

  static get itemSelector() {
    return '.taskslist-item';
  }

  static get listItemsSelector() {
    return '.taskslist-items';
  }

  static get listItemsClass() {
    return 'taskslist-items';
  }

  static get listItemClass() {
    return 'taskslist-items';
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
    const tasksList = this.parentEl.querySelector(TasksListWidget.tasksListIDSelector(id));
    const ul = tasksList.querySelector(TasksListWidget.listItemsSelector);
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
    const tasksList = this.parentEl.querySelector(TasksListWidget.tasksListIDSelector(id));
    
    const tasksListItems = tasksList.querySelector(TasksListWidget.listItemsSelector);    

    console.log(tasksList, tasksListItems);
    tasksListItems.addEventListener('dragover', (evt) => {
      evt.preventDefault();
    });

    tasksListItems.addEventListener('drop', (evt) => {
      console.log('LIST onDrop', evt);
      const dropList = evt.target;
      if (!dropList.classList.contains(TasksListWidget.listItemsClass)) {
        return;
      }

      const id = evt.dataTransfer.getData('text');
      const draggableElement = document.getElementById(id);
      console.log(id, evt, draggableElement );

      dropList.appendChild(draggableElement );
      evt.dataTransfer.clearData();
    });

    const items = tasksListItems.querySelectorAll(TasksListWidget.itemSelector);
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

      item.addEventListener('dragstart', (evt) => {
        console.log('ITEM onDragStart', evt);
        evt.dataTransfer.effectAllowed = "copyMove";
        evt.dataTransfer.setData('text/plain', evt.target.id);
        setTimeout(() => {
          evt.target.classList.add('selected');
          evt.target.classList.add('hidden');
        }, 0);
      })

      item.addEventListener('drop', (evt) => {
        console.log('ITEM onDrop', evt);
        evt.preventDefault();
      })
      
      item.addEventListener('dragleave', (evt) => {
        console.log('ITEM onDragLeave', evt);
      });

      item.addEventListener('dragend', (evt) => {
        console.log('ITEM onDragEnd', evt);
        evt.target.classList.remove('selected');
        evt.target.classList.remove('hidden');
      });
    });
  }

  // onMouseDown(evt) {
  //   evt.preventDefault();
  //   console.log('mousedown', evt.target, evt.currentTarget);
  //   if (evt.target.classList.contains('taskslist-item-close') || 
  //     !evt.currentTarget.classList.contains('taskslist-item')) {
  //     return;
  //   }

  //   this.draggedItem = evt.currentTarget;
  //   this.draggedItem.classList.add('dragged');

  //   document.body.append(this.draggedItem);
  //   this.moveAt(evt.pageX, evt.pageY);

  //   document.addEventListener('mousemove', (evt) => this.onMouseMove(evt));

  //   document.addEventListener('mouseup', () => {
  //   // this.draggedItem.addEventListener('mouseup', () => {
  //     console.log('mouseup');
  //     document.removeEventListener('mousemove', this.onMouseMove);
  //     this.draggedItem.onmouseup = null;
  //     // this.draggedItem.removeEventListener('mouseup');
  //   });

  //   this.draggedItem.addEventListener('dragstart', () => {
  //     return false;
  //   });
  // }
  
}
