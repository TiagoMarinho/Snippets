import { DataTypes, Model } from 'sequelize'

export default class User extends Model {
	static init (sequelize) {
		super.init({
			id: {
				type: DataTypes.STRING,
				primaryKey: true,
				allowNull: false,
			},
			username: DataTypes.STRING
		}, {
			sequelize,
			modelName: 'User',
			tableName: 'users',
		})
	}
}