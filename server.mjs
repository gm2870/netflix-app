import next from 'next';
import server from './api/app.mjs';
const port = process.env.NEXT_PUBLIC_PORT || 3000;
const dev = process.env.NEXT_PUBLIC_NODE_ENV !== 'production';
import { parse } from 'url';
import dbConnect from './api/libs/dbConnect.mjs';
const app = next({ dev, port });
const handle = app.getRequestHandler();
app.prepare().then(async () => {
  // server.use(function (req, res, next) {
  //   req.url = req.originalUrl.replace('/http://localhost:3000/_next', '/_next');
  //   next(); // be sure to let the next middleware handle the modified request.
  // });
  await dbConnect();
  server.all('*', (req, res) => {
    const parsedUrl = parse(req.url, true);

    return handle(req, res, parsedUrl);
  });

  server.listen(port, () => console.log(`listening on ${port}`));
  process.on('SIGINT', () => {
    console.log('Bye bye!');
    process.exit();
  });
});
