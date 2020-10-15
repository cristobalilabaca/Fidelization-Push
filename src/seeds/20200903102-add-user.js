const bcrypt = require('bcrypt');
const faker = require('faker');

const SALT = 3497245065223

module.exports = {
  up(queryInterface) {
    const data = []
    data.push({
      id: 0,
      username: 'admin',
      password: bcrypt.hashSync(' ', SALT),
      name: 'Admin',
      sessionId:  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      admin: true,
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    })

    return queryInterface.bulkInsert('users', data, {})
  }
}