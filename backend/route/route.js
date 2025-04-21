import { Router } from 'express';
import { chatWithGemini } from '../controllers/chatController.js';
import multer from 'multer';

const route = Router();
const upload = multer({ storage: multer.memoryStorage() });

route.post('/analisar', upload.fields([
  { name: 'descricao', maxCount: 1 },
  { name: 'curriculo', maxCount: 1 }
]), chatWithGemini);

export default route;