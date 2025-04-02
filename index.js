document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/news'); // Исправленный endpoint
    const news = await response.json();

    const container = document.getElementById('news-container');
    
    // Создаем базовую структуру
    const today = new Date().toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long'
    });

    let html = `
      <li class="b-new">
        <div class="b-date">${today}</div>
        <a href="/">Все новости</a>
      </li>
    `;

    function formatDatabaseDate(dbValue) {
      // 1. Если значение уже в нужном формате "24 апреля"
      if (typeof dbValue === 'string' && /^\d{1,2}\s(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)$/.test(dbValue)) {
        return dbValue; // Возвращаем как есть
      }
    
      // 2. Проверка на пустые значения
      if (!dbValue || dbValue === 'null' || dbValue === 'undefined') {
        return 'Дата не указана';
      }
    
      // 3. Парсинг исходных дат из БД
      let date;
      
      try {
        // Если это timestamp или ISO строка
        if (typeof dbValue === 'number' || (typeof dbValue === 'string' && /^\d{4}-\d{2}-\d{2}/.test(dbValue))) {
          date = new Date(dbValue);
        } 
        // Если это уже Date объект
        else if (dbValue instanceof Date) {
          date = dbValue;
        }
        // Если это строка с нераспознаваемой датой
        else {
          console.error('Невозможно распознать дату:', dbValue);
          return 'Некорректная дата';
        }
    
        // Проверка валидности
        if (isNaN(date.getTime())) throw new Error('Invalid date');
    
        // Форматирование
        const months = [
          'января', 'февраля', 'марта', 'апреля',
          'мая', 'июня', 'июля', 'августа',
          'сентября', 'октября', 'ноября', 'декабря'
        ];
        
        return `${date.getDate()} ${months[date.getMonth()]}`;
        
      } catch (e) {
        console.error('Ошибка форматирования даты:', e.message, 'Исходное значение:', dbValue);
        return 'Некорректная дата';
      }
    }
    news.forEach(item => {
      const formattedDate = item.date 
        ? formatDatabaseDate(item.date) 
        : 'Дата не указана';
      
      html += `
        <li class="b-new">
          <div class="b-date">${formattedDate}</div>
          <a href="${item.link || '#'}">${item.title}</a>
        </li>
      `;
    });

    // Добавляем ссылку "Все новости"
    html += `<a href="/" class="b-link_allnews">Посмотреть все новости</a>`;

    container.innerHTML = html;

  } catch (error) {
    console.error('Ошибка загрузки новостей:', error);
    document.getElementById('news-container').innerHTML = `
      <li class="error">Произошла ошибка при загрузке новостей</li>
    `;
  }
});