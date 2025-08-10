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
			indexes: [
				{
					unique: true,
					fields: ['name', 'userId', 'guildId']
				}
			]
		})
	}
	static associate (models) {
		this.belongsTo(models.User, {
			foreignKey: 'userId',
		});

		this.hasMany(models.Attachment, {
			foreignKey: 'snippetId',
			as: 'attachments',
		});
	}
}