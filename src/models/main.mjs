import { Sequelize } from 'sequelize'

import User from './user.mjs'
import Snippet from './snippet.mjs'

const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: 'src/database/database.sqlite'
})

User.init(sequelize)
Snippet.init(sequelize)

User.hasMany(Snippet, { foreignKey: 'userId', onDelete: 'CASCADE' })
Snippet.belongsTo(User, { foreignKey: 'userId' })

export const syncDatabase = async () => {
	try {
		await sequelize.sync({ force: false })
		console.log('Database synced successfully')
	} catch (error) {
		console.error('Error syncing database:', error)
	}
	return sequelize
}

export default sequelize