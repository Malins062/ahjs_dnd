import './taskslist.css';
import { v4 as uuidv4 } from 'uuid';
// import DragManager from './dragmanager';

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
    this.dragItem = undefined;
    this.shiftX = 0;
    this.shiftY = 0;

    // Добавление уникальных номеров для каждого списка
    this.tasksList.forEach((list) => list.id = uuidv4());
    // console.log(this.tasksList);
  }

  static itemHTML(itemText) {
    const id = uuidv4(),
      html = `
        <li class="tasks__item list-group-item mb-2" id="${id}">
          ${itemText}
          <div class="item__close hidden" title="Удалить задачу">&#10005;</div>
        </li>`;
    return {
      innerHTML: html,
      id: id
    }
  }

  static itemsHTML(items) {
    let html = '';
    items.forEach((taskText) => {
      html += this.itemHTML(taskText).innerHTML;
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

  // Разметка HTML и отслеживание событий
  bindToDOM() {
    // Отрисовка HTML
    this.parentEl.innerHTML = '';
    this.tasksList.forEach((tasksList) => {
      this.parentEl.innerHTML += TasksListWidget.tasksListHTML(tasksList);
    });

    // Добавление отслеживания событий на каждый список
    this.tasksList.forEach((list) => this.initEvents(list.id));

    // document.addEventListener('mousedown', (evt) => this.onMouseDown(evt));
    // document.addEventListener('mouseup', (evt) => this.onMouseUp(evt));
    // item.addEventListener('dragstart', () => {return false;});

  }

  initEvents(id) {
    const tasksList = this.parentEl.querySelector(TasksListWidget.idSelector(id));
    const tasksListItems = tasksList.querySelector(TasksListWidget.listItemsSelector);    

    // Отработка событий на добавлении новой карточки-задачи
    const cardItem = tasksList.querySelector(TasksListWidget.cardDivSelector);
    const showCardItem = tasksList.querySelector(TasksListWidget.showCardSelector);
    const addNewItem = tasksList.querySelector(TasksListWidget.addCardSelector);
    const closeCardItem = tasksList.querySelector(TasksListWidget.closeCardSelector);

    showCardItem.addEventListener('click', (evt) => this.onClickShowCard(evt, cardItem));
    addNewItem.addEventListener('click', (evt) => this.onClickAddCard(evt, cardItem, tasksListItems));
    closeCardItem.addEventListener('click', (evt) => this.onClickCloseCard(evt, cardItem, showCardItem));
    
    this.initItemsEvents(tasksListItems);

    // this.dragItem = new DragManager(document, TasksListWidget.itemSelector);
    // this.dragItem.run();
  }

  initItemsEvents(ul) {
    // Отработка событий на каждой задаче из списка
    const items = ul.querySelectorAll(TasksListWidget.itemSelector);
    items.forEach((item) => this.initItemEvents(item));
  }

  initItemEvents(item) {
      // Событие удаления задачи
      const closeButton = item.querySelector(TasksListWidget.delItemSelector);
      closeButton.addEventListener('click', () => {
        item.remove();
      });

      // Событие входа в зону наведения курсора на задачу
      item.addEventListener('mouseover', (evt) => {
        evt.preventDefault();
        if (closeButton.classList.contains('hidden')) {
          closeButton.classList.remove('hidden');
        }
      });

      // Событие выхода из зоны наведения курсора на задачу
      item.addEventListener('mouseout', (evt) => {
        evt.preventDefault();
        const delButtons = document.querySelectorAll(TasksListWidget.delItemSelector);
        delButtons.forEach((delButton) => {
          if (delButton && !delButton.classList.contains('hidden')) {
            delButton.classList.add('hidden');
          }
        });
      });

      item.addEventListener('mousedown', (evt) => this.onMouseDown(evt));
  }

  onMouseDown(evt) {
    console.log('onMouseDown', evt.target);
    evt.preventDefault();
    if (!evt.which == 1 || !evt.target.classList.contains(TasksListWidget.itemClass)) {
      return;
    }
    
    console.log('onMouseDown on Item', this, evt.target);
    const dragItem = evt.target,
      shiftX = evt.clientX - evt.target.getBoundingClientRect().left,
      shiftY = evt.clientY - evt.target.getBoundingClientRect().top;

    // dragItem.style.minWidth = evt.target.style.width;
    // dragItem.style.minHeight = evt.target.style.height;
    setTimeout(() => {
      dragItem.classList.add('dragged');      
    }, 0);

    function moveAt(pageX, pageY) {
      if (!dragItem) {
        return;
      }
      dragItem.style.left = pageX - shiftX + 'px';
      dragItem.style.top = pageY - shiftY + 'px';
    }
  
    document.body.append(dragItem);
    moveAt(evt.pageX, evt.pageY);

    function onMouseMove(evt) {
      console.log('onMouseMove', evt.pageX, evt.pageY);
      evt.preventDefault();
      moveAt(evt.pageX, evt.pageY);
  
      dragItem.hidden = true;
      const elemBelow = document.elementFromPoint(evt.clientX, evt.clientY);
      dragItem.hidden = false;
      console.log(elemBelow);  
    }

    document.addEventListener('mousemove', onMouseMove);

    function onMouseUp(evt) {
      console.log('onMouseUp', evt.target);
      // evt.preventDefault();
      // // if (!dragItem || !dragItem.classList.contains(TasksListWidget.itemClass)) {
      // //   return;
      // // }
  
      console.log('onMouseUp on draggedItem');
      dragItem.classList.remove('dragged');      
      dragItem = undefined;
  
      console.log(document, this);
      // document.onmousemove = null;
      document.removeEventListener('mousemove', onMouseMove);
      // this.draggedItem.elem.classList.remove('selected');
      // self.onMouseUp = null;
      // self.onMouseMove = null;
    }
  
    // document.addEventListener('mousemove', (evt) => this.onMouseMove(evt, this));
    dragItem.addEventListener('mouseup', onMouseUp);
  }

  // onMouseDown(evt) {
  //   console.log('onMouseDown', evt.target);
  //   evt.preventDefault();
  //   if (!evt.target.classList.contains(TasksListWidget.itemClass)) {
  //     return;
  //   }
    
  //   console.log('onMouseDown on Item', this, evt.target);
  //   this.dragItem = evt.target;
  //   // console.log(evt.target.getBoundingClientRect().left, evt.target.getBoundingClientRect().top);
  //   // this.shiftX = evt.target.getBoundingClientRect().left,
  //   // this.shiftY = evt.target.getBoundingClientRect().top;
  //   this.shiftX = evt.clientX - evt.target.getBoundingClientRect().left,
  //   this.shiftY = evt.clientY - evt.target.getBoundingClientRect().top;

  //   // dragItem.style.minWidth = evt.target.style.width;
  //   // dragItem.style.minHeight = evt.target.style.height;
  //   setTimeout(() => {
  //     this.dragItem.classList.add('dragged');      
  //   }, 0);

  //   function moveAt(pageX, pageY) {
  //     if (!this.dragItem) {
  //       return;
  //     }
  //     this.dragItem.style.left = pageX - this.shiftX + 'px';
  //     this.dragItem.style.top = pageY - this.shiftY + 'px';
  //   }
  
  //   document.body.append(this.dragItem);
  //   moveAt(evt.pageX, evt.pageY);

  //   function onMouseMove(evt) {
  //     console.log('onMouseMove', evt.pageX, evt.pageY);
  //     evt.preventDefault();
  //     moveAt(evt.pageX, evt.pageY);
  
  //     this.dragItem.hidden = true;
  //     const elemBelow = document.elementFromPoint(evt.clientX, evt.clientY);
  //     this.dragItem.hidden = false;
  //     console.log(elemBelow);  
  //   }

  //   document.addEventListener('mousemove', onMouseMove);

  //   function onMouseUp(evt) {
  //     console.log('onMouseUp', evt.target);
  //     evt.preventDefault();
  //     if (!this.dragItem || !this.dragItem.classList.contains(TasksListWidget.itemClass)) {
  //       return;
  //     }
  
  //     console.log('onMouseUp on draggedItem');
  //     this.dragItem.classList.remove('dragged');      
  //     this.draggedItem = undefined;
  
  //     console.log(document, this);
  //     // document.onmousemove = null;
  //     document.removeEventListener('mousemove', onMouseMove);
  //     // this.draggedItem.elem.classList.remove('selected');
  //     // self.onMouseUp = null;
  //     // self.onMouseMove = null;
  //   }
  
  //   // document.addEventListener('mousemove', (evt) => this.onMouseMove(evt, this));
  //   document.addEventListener('mouseup', onMouseUp);
  // }


  // onMouseMove() {
  //   // evt.preventDefault();
  //   console.log('onMouseMove', evt.pageX, evt.pageY);
  //   this._moveAt(evt.pageX, evt.pageY);

  //   this.dragItem.hidden = true;
  //   const elemBelow = document.elementFromPoint(evt.clientX, evt.clientY);
  //   this.dragItem.hidden = false;
  //   console.log(elemBelow);

    // if (!Object.keys(this.draggedItem).length) {
    //   return;
    // }

    // console.log('onMouseMove', evt.target, this.draggedItem);
    // if (!this.draggedItem.elem) { // если перенос не начат...

    //   console.log('No element', this.draggedItem.elem);
  
    //   // посчитать дистанцию, на которую переместился курсор мыши
    //   const moveX = evt.pageX - this.draggedItem.downX,
    //     moveY = evt.pageY - this.draggedItem.downY;      
    //   // если мышь не передвинулась достаточно далеко, то ничего не делать
    //   if ( Math.abs(moveX) < 3 && Math.abs(moveY) < 3 ) {
    //     return; 
    //   }
  
    //   this.draggedItem.elem = TasksListWidget._createElem(this.draggedItem.selectElem); // захватить элемент
    //   if (!this.draggedItem.elem) {
    //     this.draggedItem = {}; // перемещаемые элемент создать не удалось, отмена переноса
    //     return; // возможно, нельзя захватить за эту часть элемента
    //   }
  
    //   // елемент создан успешно
    //   // создать вспомогательные свойства shiftX/shiftY
    //   const coords = TasksListWidget._getCoords(this.draggedItem.elem);
    //   this.draggedItem.shiftX = this.draggedItem.downX - coords.left;
    //   this.draggedItem.shiftY = this.draggedItem.downY - coords.top;
  
    //   TasksListWidget._startDrag(this.draggedItem.elem); // отобразить начало переноса
    // }
  
    // // отобразить перенос элемента при каждом движении мыши
    // this.draggedItem.elem.style.left = evt.pageX - this.draggedItem.shiftX + 'px';
    // this.draggedItem.elem.style.top = evt.pageY - this.draggedItem.shiftY + 'px';
  
    // return false;
  // }

  // Добавление новой задачи
  onClickAddCard(evt, cardDiv, ul) {
    evt.preventDefault();
    const textItem = cardDiv.querySelector(TasksListWidget.textNewItemSelector);
    if (textItem.value.trim().length > 0) {
      ul.innerHTML += TasksListWidget.itemHTML([textItem.value]).innerHTML;
      this.initItemsEvents(ul);
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
