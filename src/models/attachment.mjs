import { Model, DataTypes } from 'sequelize'

export default class Attachment extends Model {
	static init (sequelize) { 
		super.init({
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			snippetId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			url: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			filename: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			contentType: {
				type: DataTypes.STRING,
			},
			description: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			spoiler: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			}
		}, {
			sequelize,
			modelName: 'Attachment',
			tableName: 'attachments',
			timestamps: true 
		})
	}

	static associate (models) {
		this.belongsTo(models.Snippet, {
			foreignKey: 'snippetId',
			onDelete: 'CASCADE'
		})
	}
}