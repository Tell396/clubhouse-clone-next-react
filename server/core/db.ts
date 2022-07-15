import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('clubhouse', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres'
});

//FIXME: add DB in the system

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})()

export { sequelize };

// npx sequelize-cli db:migrate / yarn sequelize-cli db:migrate
// yarn sequelize-cli model:generate --name User --attributes fullname:string,avatarUrl:string,isActive:string,username:string,phone:string
