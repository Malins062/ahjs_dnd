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
      html += `
        <li class="tasks__item list-group-item mb-2" id="${uuidv4()}" draggable="true">
          <div class="item__text">${taskText}</div>
          <div class="item__close hidden" title="Удалить задачу">&#10005;</div>
        </li>`;
    });
    return html;
  };

  static tasksListHTML(tasksList) {
    return `
      <div class="col-md-4 h-100 py-2">        
        <div class="tasks__card card" id="${tasksList.id}">
            <div class="tasks__header card-header p-2">
                <h5 class="tasks__title mb-0">${tasksList.title}</h5>
            </div>

            <div class="tasks__body card-body h-100 p-2" data-mdb-perfect-scrollbar="true">
                <ul class="tasks__list list-group">
                    ${TasksListWidget.itemsHTML(tasksList.items)}
                </ul>
            </div>

            <div class="tasks__footer card-footer text-start p-2">
                <div class="item__add">&#10009; Добавить новую карточку</div>
                <div class="item__card hidden">
                  <div class="form-outline mb-2">
                    <textarea class="new__item__text form-control" rows="2" 
                      placeholder="Введите текст карточки"></textarea>
                  </div>
                  <button class="new__item__add btn btn-success btn-sm" title="Добавить новую задачу">
                    Добавить
                  </button>
                  <button class="new__item__close btn btn-transparent btn-sm" title="Закрыть окно добавления">
                    &#10005;
                  </button>
                </div>
            </div>
        </div>
      </div>
    `;
  }

  static idSelector(id) {
    return `[id="${id}"]`;
  }

  static get showCardSelector() {
    return '.item__add';
  }

  static get itemSelector() {
    return '.tasks__item';
  }

  static get itemClass() {
    return 'tasks__item';
  }

  static get listItemsSelector() {
    return '.tasks__list';
  }

  static get listItemsClass() {
    return 'tasks__list';
  }

  static get delItemSelector() {
    return '.item__close';
  }

  static get delItemClass() {
    return 'item__close';
  }

  static get closeCardSelector() {
    return '.new__item__close';
  }

  static get addCardSelector() {
    return '.new__item__add';
  }

  static get cardDivSelector() {
    return '.item__card';
  }

  static get textNewItemSelector() {
    return '.new__item__text';
  }

  bindToDOM() {
    this.parentEl.innerHTML = '';
    this.tasksList.forEach((tasksList) => {
      this.parentEl.innerHTML += TasksListWidget.tasksListHTML(tasksList);
    });

    // document.addEventListener('mousedown', (evt) => this.onMouseDown(evt));
    // document.addEventListener('dragstart', (evt) => this.onListDragStart(evt));
    // document.addEventListener('dragend', (evt) => this.onListDragEnd(evt));

    this.tasksList.forEach((list) => {
      this.initListEvents(list.id);
      this.initItemEvents(list.id);
    });

  }

  initListEvents(id) {
    const tasksList = this.parentEl.querySelector(TasksListWidget.idSelector(id));
    const ul = tasksList.querySelector(TasksListWidget.listItemsSelector);
    const showCard = tasksList.querySelector(TasksListWidget.showCardSelector);
    const cardDiv = tasksList.querySelector(TasksListWidget.cardDivSelector);
    const addCard = tasksList.querySelector(TasksListWidget.addCardSelector);
    const closeCard = tasksList.querySelector(TasksListWidget.closeCardSelector);

    ul.addEventListener('dragstart', (evt) => this.onListDragStart(evt));
    ul.addEventListener('dragend', (evt) => this.onListDragEnd(evt));
    ul.addEventListener('dragover', (evt) => this.onListDragOver(evt));
    
    showCard.addEventListener('click', (evt) => this.onClickShowCard(evt, cardDiv));
    addCard.addEventListener('click', (evt) => this.onClickAddCard(evt, cardDiv, ul, id));
    closeCard.addEventListener('click', (evt) => this.onClickCloseCard(evt, cardDiv, showCard));
  }

  onListDragStart(evt) {
    console.log('onListDragStart', evt.target);
    setTimeout(() => {
      evt.target.classList.add('selected');
      evt.target.classList.add('hidden');
    }, 0);
  }

  onListDragEnd(evt) {
    console.log('onListDragEnd', evt.target);
    evt.target.classList.remove('selected');
    evt.target.classList.remove('hidden');
  }

  onListDragOver(evt) {
    evt.preventDefault();
  
    const activeElement = document.querySelector(`.selected`);
    const currentElement = evt.target;
    const isMoveable = activeElement !== currentElement &&
      currentElement.classList.contains(TasksListWidget.itemClass);
       
    if (!isMoveable) {
      return;
    }

    const nextElement = (currentElement === activeElement.nextElementSibling) ?
		  currentElement.nextElementSibling :
		  currentElement;
    
    console.log('onListDragOver', evt.target, nextElement, activeElement);
    evt.target.insertBefore(activeElement, nextElement);
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
    const tasksList = this.parentEl.querySelector(TasksListWidget.idSelector(id));
    
    const tasksListItems = tasksList.querySelector(TasksListWidget.listItemsSelector);    

    // console.log(tasksList, tasksListItems);
    // tasksListItems.addEventListener('dragover', (evt) => {
    //   evt.preventDefault();
    // });

    // tasksListItems.addEventListener('drop', (evt) => {
    //   console.log('LIST onDrop', evt);
    //   const dropList = evt.target;
    //   if (!dropList.classList.contains(TasksListWidget.listItemsClass)) {
    //     return;
    //   }

    //   const id = evt.dataTransfer.getData('text');
    //   const draggableElement = document.getElementById(id);
    //   console.log(id, evt, draggableElement );

    //   dropList.appendChild(draggableElement );
    //   evt.dataTransfer.clearData();
    // });

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

      // item.addEventListener('dragstart', (evt) => {
      //   console.log('ITEM onDragStart', evt);
      //   evt.dataTransfer.effectAllowed = "copyMove";
      //   evt.dataTransfer.setData('text/plain', evt.target.id);
      //   setTimeout(() => {
      //     evt.target.classList.add('selected');
      //     evt.target.classList.add('hidden');
      //   }, 0);
      // })

      // item.addEventListener('drop', (evt) => {
      //   console.log('ITEM onDrop', evt);
      //   evt.preventDefault();
      // })
      
      // item.addEventListener('dragleave', (evt) => {
      //   console.log('ITEM onDragLeave', evt);
      // });

      // item.addEventListener('dragend', (evt) => {
      //   console.log('ITEM onDragEnd', evt);
      //   evt.target.classList.remove('selected');
      //   evt.target.classList.remove('hidden');
      // });
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
