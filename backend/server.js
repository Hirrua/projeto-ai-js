import express from "express"
import route from "./route/route.js"
import cors from 'cors';

const app = express();
const port = 3333;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(route)

app.get('/', (req, res) => {
    res.send('Servidor está rodando!');
});

app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`);
});