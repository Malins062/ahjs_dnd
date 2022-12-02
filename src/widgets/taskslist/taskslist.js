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

const STYLE_DRAGGING = 'dragging',
  STYLE_DROP = 'drop';

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
        <li class="tasks__item list-group-item mb-2" draggable="true" id="${id}">
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

    this.onDragEnter = this.onDragStart.bind(this);
    this.onDragLeave = this.onDragEnd.bind(this);
    tasksList.addEventListener('dragEnter', this.onDragEnter);
    tasksList.addEventListener('dragLeave', this.onDragLeave);
    
    this.initItemsEvents(tasksListItems);
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

    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDrag = this.onDrag.bind(this);
    item.addEventListener('dragstart', this.onDragStart);
    item.addEventListener('dragend', this.onDragEnd);
    // item.addEventListener('drag', this.onDrag);
  }

  // Начало перетаскивания объекта
  onDragStart(evt) {
    evt.currentTarget.classList.add(STYLE_DRAGGING);
    this.onDrag(evt);
  }

  // Окончание перетаскивания объекта
  onDragEnd(evt) {
    evt.currentTarget.classList.remove(STYLE_DRAGGING);
  }

  // Окончание перетаскивания объекта
  onDrag(evt) {
    evt.dataTransfer.setData('text/html', evt.currentTarget.outerHTML);
    evt.dataTransfer.setData('text/plain', evt.currentTarget.dataset.id);
  }

  // Вход объекта в зону где может быть сброшен
  onDragEnter(evt) {
    evt.currentTarget.classList.add(STYLE_DROP);
  }

  // Выход объекта из зоны где может быть сброшен
  onDragLeave(evt) {
    evt.currentTarget.classList.remove(STYLE_DROP);
  }

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
}
