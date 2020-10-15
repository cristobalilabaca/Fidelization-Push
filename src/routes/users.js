const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadUser(ctx, next) {
  const { username } = ctx.params
  ctx.state.user = await ctx.orm.user.find({ where: { username } })
  return next()
}

router.get('users.list', '/', async (ctx) => {
  const users = await ctx._matchedRouteName.user.findAll();
  await ctx.render('users/index', {
    users,
  })
})

router.get('users.new', '/new', async (ctx) =>{
  const user = ctx.orm.user.build();
  await ctx.render('users/new', {
    user,
    submitUserPath: ctx.router.url('users.create'),
  })
})

router.post('users.create', '/', async (ctx) => {
  const user = ctx.orm.user.build(ctx.request.body)
  await user.save({ fields: ['username', 'password', 'name', 'sessionId', 'admin'] })
  ctx.redirect('/');
})

router.patch('users.update', '/:username', loadUser, async (ctx) => {
  const { user } = ctx.state
  const { username, password, name } = ctx.request.body
  await user.update({ username, password, name })
})

router.del('user.delete', '/:username', loadUser, async (ctx) =>{
  const { user } = ctx.state
  await user.destroy();
  ctx.redirect(ctx.router.url('users.list'))
})

module.exports = router;