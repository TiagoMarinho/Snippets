<h1 align="center">Snippets Bot</h1>
<p align="center">A powerful, easy-to-use Discord bot for creating, managing, and sharing text snippets.</p>

## Table of Contents

1. [Features](#features)
2. [How to Use](#how-to-use)
3. [Commands](#commands)
4. [Self-Hosting](#self-hosting-guide)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Bot](#running-the-bot)
5. [Contributing](#contributing)


## Features

- **Intuitive Slash Commands**: All features are accessed through modern, easy-to-use slash commands.
- **Rich Embeds**: Snippets are displayed in clean, formatted embeds for maximum readability.
- **Autocomplete**: The bot suggests snippet names as you type.
- **Easy Creation & Editing**: A pop-up modal makes creating or updating a snippet a breeze.
- **Paginated List**: Browse all server snippets with a simple, button-navigated list.
- **User-Specific Ownership**: Snippets are tied to users, allowing you to manage your own library while preventing others from modifying your content.

## How to Use

The bot is designed to be as simple as possible.

- **To create a snippet**: Use `/set`. This will open a form.
- **To retrieve a snippet**: Use `/get` and start typing its name. The bot will help you find it.

```
/get name: rules
```
This command will first look for a snippet you own named "rules". If you don't have one, it will find the most popular public snippet named "rules" in the server.

## Commands

* ` /set `
  * Opens a modal to create a new snippet.
* ` /get <name> `
  * Retrieves a snippet.
  * Also accepts optional arguments: `<author>` (to get a snippet from a specific user) and `<mention>` (to ping a user with the snippet).
* ` /delete <name> `
  * Deletes one of your snippets.
* ` /edit <name> `
  * Opens a model to edit one of your snippets.
* ` /list `
  * Displays a paginated list of all snippets in the server, sorted by popularity.
  * Also accepts an optional argument: `<page>` (to jump directly to a specific page).

## Self-Hosting Guide

You can run your own instance of Snippets Bot. This guide assumes you have a basic understanding of the command line and Node.js.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or newer recommended)
-   [Git](https://git-scm.com/)

### Installation

1.  **Clone the Repository**
    Open your terminal and run the following command to clone the project:
    ```bash
    git clone https://github.com/TiagoMarinho/Snippets
    ```

2.  **Create a Discord Application**
    -   Go to the [Discord Developer Portal](https://discord.com/developers/applications) and click "New Application".
    -   Give your bot a name.
    -   Go to the "Bot" tab and click "Add Bot".
    -   Click "Reset Token" to reveal your bot's token. **Keep this secret!**

3.  **Configure the Bot**
    -   In the project's root directory, create a new file named `.env`.
    -   Add the following content to the `.env` file, replacing the placeholder values with your own from the Developer Portal:
        ```env
        # .env file
        DISCORD_TOKEN=YOUR_BOT_TOKEN_HERE
        CLIENT_ID=YOUR_APPLICATION_CLIENT_ID_HERE
        ```

4.  **Install Dependencies**
    Run the following command in the project's root directory to install all required packages:
    ```bash
    npm install
    ```

5.  **Register Slash Commands**
    This command tells Discord about all the available slash commands. You only need to run this once, or whenever you add/change a command's definition.
    ```bash
    npm run register
    ```

6.  **Invite the Bot to Your Server**
    -   In the Developer Portal, go to "OAuth2" -> "URL Generator".
    -   Select the scopes `bot` and `applications.commands`.
    -   Under "Bot Permissions", select "Send Messages".
    -   Copy the generated URL and paste it into your browser to invite the bot to your desired server.

### Running the Bot

After completing the installation, you can start the bot with this command:

```bash
npm run start
```
The console should print "Ready! Logged in as YourBotName." Your bot is now online and ready to use!

## Contributing

Contributions are welcome! Whether it's reporting a bug, suggesting a feature, or submitting a pull request, your help is appreciated.

A basic overview of the project structure:
- `src/main.mjs`: The main entry point that initializes the client and loads commands/events.
- `src/commands/snippets/`: This directory contains all the core commands for the bot (`get`, `set`, `delete`, `edit` etc.).
- `src/models/`: Contains the Sequelize database models (`User.mjs`, `Snippet.mjs`).
- `src/events/`: Contains handlers for Discord gateway events (e.g., `command.mjs` for command interactions).
- `src/locale/`: Contains localization files for multi-language support.