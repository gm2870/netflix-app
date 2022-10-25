import next from 'next';
import server from '../api/app.mjs';

const port = parseInt(process.env.PORT, 10) || 8001;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  server.all('*', (req, res) => {
    return handle(req, res);
  });
  server.listen(port);
});
