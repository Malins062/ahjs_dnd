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
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    console.log(this.container, this.draggableSelector, this.dragObjeсt);    
  }
  
  run() {

    console.log('Run DragManager events');
    
    this.container.addEventListener('mousedown', this.onMouseDown);
    this.container.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseDown(evt) {
    console.log('DragManager: left button mouse down:');
    console.log('event - ', evt.which, evt.target, this.draggableSelector);
    if (!(evt.which == 1 && evt.target.classList.contains(this.draggableSelector)))  {
      console.log('if - ', evt.which, evt.target);
      return;      
    } 

    this.dragObjeсt.elem = evt.target;
    this.dragObjeсt.elem.classList.add('dragged');

    // запомним, что элемент нажат на текущих координатах pageX/pageY
    this.dragObjeсt.downX = evt.pageX;
    this.dragObjeсt.downY = evt.pageY;
    console.log('dragObject - ', this.dragObjeсt);

    this.container.addEventListener('mousemove', this.onMouseMove);
    return false;
  }

  onMouseUp(evt) {
    console.log('DragManager: mouse up');
    console.log(this);
    this.container.removeEventListener('mousemove', this.onMouseMove);

    if (this.dragObjeсt.avatar) { // если перенос идет
      this.finishDrag(evt, this.dragObjeсt.avatar);
    }

    // перенос либо не начинался, либо завершился
    // в любом случае очистим "состояние переноса" this.dragObjeсt
    this.dragObjeсt = {};
  }

  onMouseMove(evt) {
    // console.log('DragManager: mouse move:');
    // console.log('params - ', evt, this.dragObjeсt);
    if (this.dragObject == {}) {
      return; // элемент не зажат
    } 

    if (!this.dragObjeсt.avatar) {
      const moveX = evt.pageX - this.dragObjeсt.downX,
        moveY = evt.pageY - this.dragObjeсt.downY;

      // если мышь передвинулась в нажатом состоянии недостаточно далеко
      if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) {
        return;
      }

      // начинаем перенос
      this.dragObjeсt.avatar = this.createAvatar(evt); // создать аватар
      if (!this.dragObjeсt.avatar) { // отмена переноса, нельзя "захватить" за эту часть элемента
        this.dragObjeсt = {};
        return;
      }

      // аватар создан успешно
      // создать вспомогательные свойства shiftX/shiftY
      const coords = this._getCoords(this.dragObjeсt.avatar);
      this.dragObjeсt.shiftX = this.dragObjeсt.downX - coords.left;
      this.dragObjeсt.shiftY = this.dragObjeсt.downY - coords.top;

      this.startDrag(this.dragObjeсt.avatar); // отобразить начало переноса
    }

    // отобразить перенос объекта при каждом движении мыши
    this.dragObjeсt.avatar.style.left = evt.pageX - this.dragObjeсt.shiftX + 'px';
    this.dragObjeсt.avatar.style.top = evt.pageY - this.dragObjeсt.shiftY + 'px';

    // console.log('avatar move', this.dragObjeсt.avatar);        

    return false;
  }

  finishDrag(evt, avatar) {
    const dropElem = this.findDroppable(evt);
    console.log('dropElem - ', dropElem);
    console.log('dragObject - ', avatar);
    if (!dropElem) {
      avatar.rollback();
    } else {
      // скрыть/удалить переносимый объект
      // dragItem.elem.hidden = true;
      dropElem.parent.insertBefore(avatar, dropElem.nextSibling);
      // успешный перенос, показать улыбку классом computer-smile
      dropElem.classList.remove('dragged');

      // // убрать улыбку через 0.2 сек
      // setTimeout(function() {
      //   dropElem.classList.remove('computer-smile');
      // }, 200);
    }
  }

  createAvatar(evt) {

    // запомнить старые свойства, чтобы вернуться к ним при отмене переноса
    const avatar = this.dragObjeсt.elem,
      old = {
        className: avatar.className,
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
      avatar.classList.remove('dragged');
      avatar.style.position = old.position;
      avatar.style.left = old.left;
      avatar.style.top = old.top;
      avatar.style.zIndex = old.zIndex
    };

    return avatar;
  }

  startDrag(dragObject) {
    const avatar = dragObject;
    avatar.addEventListener('dragstart', () => {return false;});
    // инициировать начало переноса
    document.body.appendChild(avatar);
    avatar.style.zIndex = 9999;
    avatar.style.position = 'absolute';
  }

  findDroppable(evt) {
    // спрячем переносимый элемент
    this.dragObjeсt.avatar.hidden = true;

    // получить самый вложенный элемент под курсором мыши
    const elem = document.elementFromPoint(evt.clientX, evt.clientY);

    // показать переносимый элемент обратно
    this.dragObjeсt.avatar.hidden = false;

    if (elem == null) {
      // такое возможно, если курсор мыши "вылетел" за границу окна
      return null;
    }

    console.log('findDroppable - ', elem, evt.clientX);
    return elem.closest('.' + this.draggableSelector);
  }

  _getCoords(elem) { 
    var box = elem.getBoundingClientRect();
  
    return {
      top: box.top + scrollY,
      left: box.left + scrollX
    };  
  }

}