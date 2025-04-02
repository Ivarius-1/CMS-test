// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 4000;


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'users',
    password: 'postgres',
    port: 5432,
});


app.use(express.static(path.join(__dirname)));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/api/news', async (req, res) => {
    try {

        const result = await pool.query(`
            SELECT id, title, date 
            FROM  News_tabs
            ORDER BY date DESC 
            LIMIT 6
        `);
        
        const formattedNews = result.rows.map(news => ({
            ...news,
            date: formatDate(news.date)
        }));

        res.json(formattedNews);
    } catch (err) {
        console.error('Ошибка запроса к базе данных', err);
        res.status(500).json({ error: 'Ошибка при получении новостей' });
    }
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.get('/fast-request', (req, res) => {
    res.sendFile(path.join(__dirname, 'fast-request.html'));
});

app.post('/find-product-request', async (req, res) => {
  try {
      const { cargoName, totalWeight, totalVolume } = req.body;
      
      if (!cargoName || !totalWeight || !totalVolume) {
          return res.status(400).json({ 
              success: false,
              error: 'Все поля обязательны для заполнения'
          });
      }

      const result = await pool.query(
          `SELECT id FROM Cargos 
           WHERE "cargo_name" = $1 
           AND "total_weight" = $2 
           AND "total_volume" = $3 
           AND "created_at" = $4
           LIMIT 1`,
          [cargoName, totalWeight, totalVolume]
      );

      if (result.rows.length === 0) {
          return res.status(404).json({
              success: false,
              message: 'Запись не найдена'
          });
      }

      res.json({
          success: true,
          productId: result.rows[0].id
      });

  } catch (err) {
      console.error('Ошибка сервера:', err);
      res.status(500).json({
          success: false,
          error: 'Внутренняя ошибка сервера'
      });
  }
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});


function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long'
    });
}
