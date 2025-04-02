document.getElementById('submitRequestBtn').addEventListener('click', async function() {
  const btn = this;
  const cargoName = document.getElementById('cargoNameField')?.value.trim();
  const totalWeight = document.getElementById('totalWeightField')?.value.trim();
  const totalVolume = document.getElementById('totalVolumeField')?.value.trim();


  if (!cargoName || !totalWeight || !totalVolume) {
      alert('Заполните все обязательные поля!');
      return;
  }

  try {
      btn.disabled = true;
      btn.textContent = 'Поиск...';
      
      const response = await fetch('http://localhost:3000/find-product-request', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          },
          body: JSON.stringify({
              cargoName,
              totalWeight,
              totalVolume
          })
      });


      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Ожидался JSON, получено: ${text.substring(0, 100)}`);
      }

      const data = await response.json();

      if (!response.ok) {
          throw new Error(data.message || `HTTP ошибка ${response.status}`);
      }

      alert(`Найдена запись с ID: ${data.productId}`);
      
  } catch (error) {
      console.error('Ошибка:', error);
      alert(`Ошибка поиска: ${error.message}`);
  } finally {
      btn.disabled = false;
      btn.textContent = 'ОТПРАВИТЬ= ЗАПРОС';
  }
});