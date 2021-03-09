const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('@koa/router');
const cors = require('@koa/cors');
const Keyv = require('keyv');

const usersNames = require('./users');

const app = new Koa();
const router = new Router();

const keyv = new Keyv();

const USERS_KEY = 'users';
const COMMENTS_KEY = 'comments';

app.use(bodyParser());
app.use(cors());

app.use(async (ctx, next) => {
  ctx.type = 'application/json'
  await next();
});

const getRandomNumber = (min, max) => Math.floor(Math.random() * max) + min;

const generatedUsers = usersNames.map((name, index) => ({ id: `${index}`, name }));

keyv.set(USERS_KEY, generatedUsers);
keyv.set(COMMENTS_KEY, Array.from({ length: 50 }).map(
  (_, index) => {
    const randomUserIndex = getRandomNumber(0, generatedUsers.length - 1);
    const user = generatedUsers[randomUserIndex];
    const id = `${index + 1}`;

    return { id, message: `Lorem ipsum dolor sit amet ${id}`, userId: user.id };
  }));

router
  .get('/', (ctx) => {
    ctx.body = JSON.stringify({ hello: 'world' });
  })
  .get('/users', async (ctx) => {
    const users = await keyv.get(USERS_KEY);

    const usersResponse = users || [];

    ctx.body = JSON.stringify({ users: usersResponse , count: usersResponse.length });
  })
  .get('/users/:id', async (ctx) => {
    const { id } = ctx.params;
    const users = await keyv.get(USERS_KEY);
    const user = (users || []).find(user => user.id === id);

    if (!user) {
      ctx.status = 404;
      ctx.body = JSON.stringify({ message: 'User not found!' });
      return;
    }

    ctx.body = JSON.stringify(user);
  })
  .post('/users', async (ctx) => {
    const { user: newUser } = ctx.request.body;

    if (newUser.id === '666') {
      throw new Error('Random server error');
    }

    const users = await keyv.get(USERS_KEY);
    const isUserAlreadyExists = !!(users || []).find(user => user.id === newUser.id);

    if (isUserAlreadyExists) {
      ctx.status = 409;
      ctx.body = JSON.stringify({ message: 'User already exists!' });
      return;
    }

    keyv.set(USERS_KEY, [...(users || []), newUser])

    ctx.body = JSON.stringify(newUser);
  })
  .put('/users/:id', async (ctx) => {
    const { id } = ctx.params;
    const { user: newUser } = ctx.request.body;

    const users = await keyv.get(USERS_KEY);
    const userIndex = (users || []).findIndex(user => user.id === id);

    if (userIndex === -1) {
      ctx.status = 404;
      ctx.body = JSON.stringify({ message: 'User not found!' });
      return;
    }

    const newUsers = (users || []).map(user => user.id === newUser.id ? newUser : user);

    keyv.set(USERS_KEY, newUsers);

    ctx.body = JSON.stringify(newUser);
  })
  .del('/users/:id', async (ctx) => {
    const { id } = ctx.params;

    const users = await keyv.get(USERS_KEY);
    const newUsers = (users || []).filter(user => user.id !== id);

    keyv.set(USERS_KEY, newUsers);
  })
  .get('/comments', async (ctx) => {
    const { offset: offsetQuery, limit: limitQuery } = ctx.request.query;

    const offset = offsetQuery ? parseInt(offsetQuery, 10) : 0;
    const limit = limitQuery ? parseInt(limitQuery, 10) : 100;

    const comments = await keyv.get(COMMENTS_KEY);

    const commentsResponse = comments ? comments.slice(offset, offset + limit) : [];

    ctx.body = JSON.stringify({ comments: commentsResponse });
  });

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3001);
