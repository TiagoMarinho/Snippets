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
				allowNull: false,
			},
			title: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			content: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			color: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			footer: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			
			usages: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
				allowNull: false,
			},
			guildId: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		}, {
			sequelize,
			modelName: 'Snippet',
			tableName: 'snippets',
			timestamps: true,
			indexes: [
				{
					unique: true,
					fields: ['name', 'userId', 'guildId']
				},
				{
					fields: ['name', 'guildId']
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