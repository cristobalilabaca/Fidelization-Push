const sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const person = sequelize.define('person', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    rut: DataTypes.STRING,
    userId: DataTypes.INTEGER,
  }, {});
  person.associate = function (models) {
    person.belongsTo(models.user, { foreignKey: 'userId', targetKey: 'id', onDelete: 'cascade' });
  };
  return person;
};