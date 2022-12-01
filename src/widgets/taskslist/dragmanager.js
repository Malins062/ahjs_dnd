export default class DragManager {
  constructor(container, draggableSelector) {
    /**
     * составной объект для хранения информации о переносе:
     * {
     *   elem - элемент, на котором была зажата мышь
     *   avatar - аватар
     *   downX/downY - координаты, на которых был mousedown
     *   shiftX/shiftY - относительный сдвиг курсора от угла элемента
     * }
     */
    
    this.container = container;
    this.draggableSelector = draggableSelector;
    this.dragObjeсt = {};
    console.log(this.container, this.draggableSelector, this.dragObjeсt);
  }
  
  run() {

    console.log('Run DragManager');
    
    this.container.addEventListener('mousemove', (evt) => this.onMouseMove(evt, this));
    this.container.addEventListener('mousedown', (evt) => this.onMouseDown(evt, this));
    this.container.addEventListener('mouseup', (evt) => this.onMouseUp(evt, this));
    // this.container.onmousemove = this.onMouseMove(evt, this);
    // this.container.onmouseup = this.onMouseUp;
    // this.container.onmousedown = this.onMouseDown;
  
    this.onDragEnd = function(dragObjeсt, dropElem) {};
    this.onDragCancel = function(dragObjeсt) {};  
  }

  onMouseDown(evt, self) {
    if (evt.which != 1) {
      return;
    } 

    // const elem = e.target.closest(this.draggableSelector);
    const elem = evt.target;
    console.log('Left button mouse down', evt, elem);
    if (!elem) {
      return;
    }

    self.dragObjeсt.elem = elem;
    // self.dragObjeсt.elem.classList.add('dragged');

    // запомним, что элемент нажат на текущих координатах pageX/pageY
    self.dragObjeсt.downX = evt.pageX;
    self.dragObjeсt.downY = evt.pageY;

    return false;
  }

  onMouseMove(evt, self) {
    console.log('Mouse move', self.draggableSelector, self.dragObject);
    // if (!Object.keys(self.dragObject).length) {
    if (!self.dragObject) {
      return; // элемент не зажат
    } 

    if (!self.dragObjeсt.avatar) { // если перенос не начат...
      const moveX = e.pageX - self.dragObjeсt.downX,
        moveY = e.pageY - self.dragObjeсt.downY;

      // если мышь передвинулась в нажатом состоянии недостаточно далеко
      if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) {
        return;
      }

      // начинаем перенос
      self.dragObjeсt.avatar = self.createAvatar(evt); // создать аватар
      if (!self.dragObjeсt.avatar) { // отмена переноса, нельзя "захватить" за эту часть элемента
        self.dragObjeсt = {};
        return;
      }

      // аватар создан успешно
      // создать вспомогательные свойства shiftX/shiftY
      const coords = self._getCoords(self.dragObjeсt.avatar);
      self.dragObjeсt.shiftX = self.dragObjeсt.downX - coords.left;
      self.dragObjeсt.shiftY = self.dragObjeсt.downY - coords.top;

      self.startDrag(evt); // отобразить начало переноса
    }

    // отобразить перенос объекта при каждом движении мыши
    self.dragObjeсt.avatar.style.left = e.pageX - self.dragObjeсt.shiftX + 'px';
    self.dragObjeсt.avatar.style.top = e.pageY - self.dragObjeсt.shiftY + 'px';

    return false;
  }

  onMouseUp(evt, self) {
    if (self.dragObjeсt.avatar) { // если перенос идет
      self.finishDrag(evt);
    }

    // перенос либо не начинался, либо завершился
    // в любом случае очистим "состояние переноса" self.dragObjeсt
    self.dragObjeсt = {};
  }

  finishDrag(e) {
    const dropElem = this.findDroppable(e);

    if (!dropElem) {
      self.onDragCancel(this.dragObjeсt);
    } else {
      self.onDragEnd(this.dragObjeсt, dropElem);
    }
  }

  createAvatar(e) {

    // запомнить старые свойства, чтобы вернуться к ним при отмене переноса
    const avatar = this.dragObjeсt.elem,
      old = {
        parent: avatar.parentNode,
        nextSibling: avatar.nextSibling,
        position: avatar.position || '',
        left: avatar.left || '',
        top: avatar.top || '',
        zIndex: avatar.zIndex || ''
      };

    // функция для отмены переноса
    avatar.rollback = () => {
      old.parent.insertBefore(avatar, old.nextSibling);
      avatar.style.position = old.position;
      avatar.style.left = old.left;
      avatar.style.top = old.top;
      avatar.style.zIndex = old.zIndex
    };

    return avatar;
  }

  startDrag(e) {
    const avatar = this.dragObjeсt.avatar;

    // инициировать начало переноса
    document.body.appendChild(avatar);
    avatar.style.zIndex = 9999;
    avatar.style.position = 'absolute';
  }

  findDroppable(event) {
    // спрячем переносимый элемент
    this.dragObjeсt.avatar.hidden = true;

    // получить самый вложенный элемент под курсором мыши
    var elem = document.elementFromPoint(event.clientX, event.clientY);

    // показать переносимый элемент обратно
    this.dragObjeсt.avatar.hidden = false;

    if (elem == null) {
      // такое возможно, если курсор мыши "вылетел" за границу окна
      return null;
    }

    return elem.closest('.droppable');
  }

  _getCoords(elem) { 
    var box = elem.getBoundingClientRect();
  
    return {
      top: box.top + scrollY,
      left: box.left + scrollX
    };  
  }

}