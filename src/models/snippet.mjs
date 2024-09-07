import { DataTypes, Model } from 'sequelize'

export default class Snippet extends Model {
	static init (sequelize) { 
		super.init({
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			name: {
				type: DataTypes.STRING,
				unique: true,
			},
			title: DataTypes.STRING,
			content: DataTypes.STRING,
			usages: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			guildId: DataTypes.STRING,
		}, {
			sequelize,
			modelName: 'Snippet',
			tableName: 'snippets',
			timestamps: true,
		})
	}
}