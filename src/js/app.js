import TasksListWidget from '../widgets/tasklist/tasklist';

const widgetTasksToDo = new TasksListWidget(document.querySelector('#widget-container-1'), 
  'Что запланировано сделать', 
  ['Доделать домашнее задание',
   'Завершить HTML верстку',
   'Написать тесты',
  ]);
widgetTasksToDo.bindToDOM();

const widgetTasksInProgress = new TasksListWidget(document.querySelector('#widget-container-2'), 
  'Задания в процессе', 
  ['Работа над виджетом TasksList',
   'Кнопка ДОБАВИТЬ',
  ]);
widgetTasksInProgress.bindToDOM();

const widgetTasksDone = new TasksListWidget(document.querySelector('#widget-container-3'), 
  'Сделано', 
  ['Описание README.md',
   'Список пакетов - package.json',
   'Общая HTML-разметка страницы',
   'Файл запуска приложения JS',
  ]);
widgetTasksDone.bindToDOM();