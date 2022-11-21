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
        html = html + 
          `<li class="taskslist-item list-group-item mb-2">
            <div class="taskslist-item-text">${taskText}</div>
            <div class="taskslist-item-close hidden">&#10005;</div>
          </li>`
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
              <div class="taskslist-items-add">&#10009; Добавить новую карточку<div>
              <button class="btn btn-success btn-sm hidden" id="tasklist-add">Добавить</button>
          </div>
      </div>
    `;
  }

  static get addItemSelector() {
    return '[id=tasklist-add]';
  }

  static get itemSelector() {
    return '.taskslist-item';
  }
  
  static get delItemSelector() {
    return '.taskslist-item-close';
  }
  
  bindToDOM() {
    this.parentEl.innerHTML = this.markup;
    this.draggedEl = null;
    this.ghostEl = null;
    this.initEvents();
  }

  initEvents(){
    const button = this.parentEl.querySelector(TasksListWidget.addItemSelector);
    button.addEventListener('click', e => this.onClickAddItem(e));

    const items = this.parentEl.querySelectorAll(TasksListWidget.itemSelector);
    items.forEach(item => {
      // console.log(item);

      const closeButton = item.querySelector(TasksListWidget.delItemSelector);
      // console.log(closeButton);

      closeButton.addEventListener('click', () => {
        item.remove();
      });

      item.addEventListener('mousedown', (evt) => {
        evt.preventDefault();
        console.log(evt.target, evt.currentTarget);
        if (!evt.currentTarget.classList.contains('tasklist-item')) {
          return;
        }

        this.draggedEl = evt.currentTarget;
        this.ghostEl = evt.currentTarget.cloneNode(true);
        this.ghostEl.classList.add('dragged');
        document.body.appendChild(this.ghostEl);
        this.ghostEl.style.left = `${evt.pageX - this.ghostEl.offsetWidth / 2}px`;
        this.ghostEl.style.top = `${evt.pageY - this.ghostEl.offsetHeight / 2}px`;
      });

      item.addEventListener('mousemove', (evt) => {
        evt.preventDefault();
        if (!this.draggedEl) {
          return;
        }
      
        const closest = document.elementFromPoint(evt.clientX, evt.clientY);
        console.log(closest.textContent);
        const { top } = closest.getBoundingClientRect();
        console.log(evt.pageY);
        console.log(window.scrollY + top + closest.offsetHeight / 2);
      
        this.ghostEl.style.left = `${evt.pageX - this.ghostEl.offsetWidth / 2}px`;
        this.ghostEl.style.top = `${evt.pageY - this.ghostEl.offsetHeight / 2}px`;
      });

      item.addEventListener('mouseleave', () => {
        if (!this.draggedEl) {
          return;
        }
        document.body.removeChild(this.ghostEl);
        this.ghostEl = null;
        this.draggedEl = null;
      });
      
      item.addEventListener('mouseup', (evt) => {
        if (!this.draggedEl) {
          return;
        }
        const closest = document.elementFromPoint(evt.clientX, evt.clientY);
      
        const { top } = closest.getBoundingClientRect();
        console.log(window.scrollY + top + closest.offsetHeight / 2);
        if (evt.pageY > window.scrollY + top + closest.offsetHeight / 2) {
          evt.currentTarget.insertBefore(this.draggedEl, closest.nextElementSibling);
        } else {
          evt.currentTarget.insertBefore(this.draggedEl, closest);
        }
      
        console.log(evt.offsetY);
      
        document.body.removeChild(this.ghostEl);
        this.ghostEl = null;
        this.draggedEl = null;
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
        delButtons.forEach(delButton => {
          if (delButton && !delButton.classList.contains('hidden')) {
            delButton.classList.add('hidden');
          }  
        });
      });
  
    });
  }

  onClickAddItem(e) {
    e.preventDefault();
    console.dir(e)
  }
}
