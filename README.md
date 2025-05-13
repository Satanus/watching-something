# Watching Something 👀 Trakt.tv Rich Presence for Discord

Displays your currently watching Trakt.tv shows/movies as Discord rich presence.

![image](https://github.com/user-attachments/assets/97f27545-fd23-49a6-8928-0b5867a7957a)

![image](https://github.com/user-attachments/assets/a5557492-a973-4a84-9490-52af7a7b2b4f)

![image](https://github.com/user-attachments/assets/499a88e9-9c6a-4ed9-baec-82e196e8c0ee)


## Features
- Shows current media with poster art
- Displays progress and time remaining (for movies)
- Includes IMDB links
- Automatic reconnection

## Requirements
- Node.js 21+
- Windows 10/11 (tested on Windows 10)
- Trakt.tv account
- Discord client running

## Installation
1. Clone this repository
2. Install dependencies:
```bash
npm install @xhayper/discord-rpc trakt.tv axios
```

3. Create `config.json` in the same folder with:
```json
{
  "trakt": {
    "client_id": "your_trakt_client_id",
    "client_secret": "your_trakt_client_secret",
    "username": "your_trakt_username"
  },
  "discord": {
    "clientId": "your_discord_application_id"  // My Discord Application/Bot is default, 1268103402454257714. If having issues, switch to your own.
  },
  "omdb": {
    "apiKey": "your_omdb_api_key"
  }
}
```

## Running
```bash
node main.js
```

## Running at Startup (Windows)
Create `watching-something.bat` file with:
```bat
@ECHO OFF
START /min node "path\to\main.js"
```
Then place the shortcut in your Startup folder (`shell:startup`)

## Getting API Keys
- Trakt.tv: https://trakt.tv/oauth/applications
  - Trakt API app settings
    - Name: anything
    - Redirect uri: `urn:ietf:wg:oauth:2.0:oob`
    - Javascripti (cors) origins: `https://discord.com`
- OMDb: http://www.omdbapi.com/apikey.aspx
- Discord: Create application at https://discord.com/developers/applications
  - The name of your app/bot is what will show in your status. For example, mine is named "something 👀" and shows as "Watching something 👀" on Discord.
## Notes
- Runs in system tray when started via batch file
- Checks for updates every 15 seconds
- Make sure Discord is running before starting
