const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const persons = require('./routes/persons');
const session = require('./routes/session');
const users = require('./routes/users')

const router = new KoaRouter();

router.use(async (ctx, next) => {
  const sessionId = ctx.session.cache
  Object.assign(ctx.state, {
    currentUser: ctx.session.cache && await ctx.orm.user.find({ where : { sessionId } }),
    newSessionPath: ctx.router.url('session.new'),
    newUserPath: ctx.router.url('users.new'),
    destroySessionPath: ctx.router.url('session.destroy'),
    personsPath: ctx.router.url('persons.list'),
  });
  return next();
});

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/session', session.routes());
router.use('/persons', persons.routes());
router.use('/users', users.routes());

module.exports = router;
