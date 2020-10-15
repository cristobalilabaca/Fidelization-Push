const bcrypt = require('bcrypt');

const PASSWORD_SALT = 25634876343;

async function buildPasswordHash(instance){
  if (instance.changed('password')){
    const hash = await bcrypt.hash(instance.password, PASSWORD_SALT);
    instance.set('password', hash);
  }
}

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate:{
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6],
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sessionId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  }, {});
  user.beforeUpdate(buildPasswordHash);
  user.beforeCreate(buildPasswordHash);

  user.prototype.checkPassword = function checkPassword(password){
    return bcrypt.compare(password, this.password);
  };

  user.associate = function asoociate(models) {
    user.hasMany(models.person, {as: 'persons', foreignKey: 'userId', sourceKey: 'id'});
  };

  return user;
};