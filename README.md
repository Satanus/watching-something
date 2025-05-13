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
- ```For Node.js version```: Node.js 21+
- ```For EXE version```: Nothing required (just Windows 10/11)
- Trakt.tv account
- Discord client running

## Installation Options

### Option 1: Using Pre-built EXE (Recommended)
1. Download the latest release from [releases](https://github.com/Satanus/watching-something/releases)
2. Extract the ZIP file to your preferred directory
3. Edit `config.json` with your API keys (see configuration below)
4. Run by either:
   - Double-clicking `watching-something.exe`
   - Or from command prompt, running watching-something.exe


### Option 2: From Source (Node.js)
1. Clone this repository
2. Install dependencies: 
`npm install @xhayper/discord-rpc trakt.tv axios`
```
3. Create `config.json` (see below)
4. Run: ```bash
node main.js
```

## Configuration
Create/edit `config.json`: 
```json
{
  "trakt": {
    "client_id": "your_trakt_client_id",
    "client_secret": "your_trakt_client_secret",
    "username": "your_trakt_username"
  },
  "discord": {
    "clientId": "1268103402454257714 (or your own Discord app ID)"
  },
  "omdb": {
    "apiKey": "your_omdb_api_key"
  }
}
```

## Auto-Start (Windows)
For EXE version: 
```bat
@ECHO OFF
START /min "C:\path\to\watching-something.exe"
```

For Node.js version: 
```bat
@ECHO OFF
START /min node "C:\path\to\main.js"
```
Place shortcut in Startup folder (`shell:startup`)

## API Setup
```Trakt.tv```: https://trakt.tv/oauth/applications
- App settings:
  - Name: anything
  - Redirect uri: `urn:ietf:wg:oauth:2.0:oob`
  - Javascript (cors) origins: `https://discord.com`

```OMDb```: http://www.omdbapi.com/apikey.aspx

```Discord```: https://discord.com/developers/applications
- App name will show in your Discord status, if your app is named "something 👀" it'll show on your status as Watching something 👀

## Notes
- Checks for Trakt updates every 15 seconds
- Discord must be running first
- Default Discord client ID works, but you can create your own
