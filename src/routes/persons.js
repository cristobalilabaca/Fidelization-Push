const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadPerson(ctx, next) {
  ctx.state.person = await ctx.orm.person.findById(ctx.params.id);
  return next();
}

router.get('persons.list', '/', async (ctx) => {
  const personsList = await ctx.orm.person.findAll();
  console.log("hi")
  await ctx.render('persons/index', {
    personsList,
    newPersonPath: ctx.router.url('persons.new'),
    editPersonPath: person => ctx.router.url('persons.edit', { id: person.id }),
    deletePersonPath: person => ctx.router.url('persons.delete', { id: person.id }),
  });
});

router.get('persons.new', '/new', async (ctx) => {
  const person = ctx.orm.person.build();
  await ctx.render('persons/new', {
    person,
    submitPersonPath: ctx.router.url('persons.create'),
  });
});

router.get('persons.edit', '/:id/edit', loadPerson, async (ctx) => {
  const { person } = ctx.state;
  await ctx.render('persons/edit', {
    person,
    submitPersonPath: ctx.router.url('persons.update', { id: person.id }),
  });
});

router.post('persons.create', '/', async (ctx) => {
  const person = ctx.orm.person.build(ctx.request.body);
  try {
    await person.save({ fields: ['name', 'email', 'phoneNumber', 'rut'] });
    ctx.redirect(ctx.router.url('persons.list'));
  } catch (validationError) {
    await ctx.render('persons/new', {
      person,
      errors: validationError.errors,
      submitPersonPath: ctx.router.url('persons.create'),
    });
  }
});

router.patch('persons.update', '/:id', loadPerson, async (ctx) => {
  const { person } = ctx.state;
  try {
    const { name, email, phoneNumber, rut } = ctx.request.body;
    await person.update({ name, email, phoneNumber, rut });
    ctx.redirect(ctx.router.url('persons.list'));
  } catch (validationError) {
    await ctx.render('persons/edit', {
      person,
      errors: validationError.errors,
      submitPersonPath: ctx.router.url('persons.update'),
    });
  }
});

router.del('persons.delete', '/:id', loadPerson, async (ctx) => {
  const { person } = ctx.state;
  await person.destroy();
  ctx.redirect(ctx.router.url('persons.list'));
});

module.exports = router;