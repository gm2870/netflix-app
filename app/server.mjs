import next from 'next';
import server from '../api/app.mjs';
const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // server.use(function (req, res, next) {
  //   req.url = req.originalUrl.replace('/http://localhost:3000/_next', '/_next');
  //   next(); // be sure to let the next middleware handle the modified request.
  // });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => console.log(`listening on ${port}`));
});
