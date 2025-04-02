document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/news');
    const news = await response.json();

    const container = document.getElementById('news-container');

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
     
      if (typeof dbValue === 'string' && /^\d{1,2}\s(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)$/.test(dbValue)) {
        return dbValue;
      }
    
      
      if (!dbValue || dbValue === 'null' || dbValue === 'undefined') {
        return 'Дата не указана';
      }
    

      let date;
      
      try {

        if (typeof dbValue === 'number' || (typeof dbValue === 'string' && /^\d{4}-\d{2}-\d{2}/.test(dbValue))) {
          date = new Date(dbValue);
        } 
    
        else if (dbValue instanceof Date) {
          date = dbValue;
        }
        
        else {
          console.error('Невозможно распознать дату:', dbValue);
          return 'Некорректная дата';
        }
    
        
        if (isNaN(date.getTime())) throw new Error('Invalid date');
    
        
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

    html += `<a href="/" class="b-link_allnews">Посмотреть все новости</a>`;

    container.innerHTML = html;

  } catch (error) {
    console.error('Ошибка загрузки новостей:', error);
    document.getElementById('news-container').innerHTML = `
      <li class="error">Произошла ошибка при загрузке новостей</li>
    `;
  }
});