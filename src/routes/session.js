const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('session.new', '/new', ctx => ctx.render('session/new', {
  createSessionPath: ctx.router.url('session.create'),
  notice: ctx.flashMessage.notice,
}));

router.put('session.create', '/', async (ctx) => {
  const { username, password } = ctx.request.body;
  const user = await ctx.orm.user.find({ where: { username } });
  const isPasswordCorrect = user && await user.checkPassword(password);
  if (isPasswordCorrect) {
    const sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    await user.update({ sessionId });
    ctx.session.cache = user.sessionId;
    return ctx.redirect('/');
  }
  return ctx.render('session/new', {
    username,
    createSessionPath:ctx.router.url('session.create'),
    error: 'Nombre de usuario o Contareña Incorrecta',
  });
});

router.delete('session.destroy', '/', async (ctx) => {
  let sessionId = ctx.session.cache;
  ctx.session = null;
  const user = await ctx.orm.user.find({ where: { sessionId } });
  sessionId = '';
  user.update({ sessionId });
  ctx.redirect('/');
});

module.exports = router;