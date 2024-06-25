import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('welcome to the backend!');
})

app.listen(PORT,()=>{
    console.log(`Server listening on : http://localhost:${PORT}`);
})