// server.ts
import express from 'express';
import multer from 'multer';
import path from 'path';

const app = express();
const PORT = 3000;


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); 
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.use(express.json());

app.post('/uploads', upload.single('imagem'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Nenhuma imagem enviada.');
  }
  res.send('Imagem enviada com sucesso: ' + req.file.filename);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
