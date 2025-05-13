const { Client } = require("@xhayper/discord-rpc");
const Trakt = require('trakt.tv');
const axios = require('axios');
const { setTimeout } = require('timers/promises');
const fs = require('fs');
const path = require('path');
const { exit } = require('process');


function loadConfig() {
    // Get config from current working directory
    const configPath = path.join(process.cwd(), 'config.json');
    
    if (!fs.existsSync(configPath)) {
        console.error('Error: config.json not found in current directory');
        console.error('Please place config.json in the same folder as the executable');
        exit(1);
    }

    try {
        return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    } catch (err) {
        console.error('Error reading config.json:', err.message);
        exit(1);
    }
}

const config = loadConfig();

const trakt = new Trakt({
    client_id: config.trakt.client_id,
    client_secret: config.trakt.client_secret,
    redirect_uri: null,
});

const discordClientId = config.discord.clientId;
let client = new Client({ clientId: discordClientId });

const omdbCache = new Map();
let previousActivity = null;

async function fetchPosterUrl(imdbId) {
    const omdbApiKey = config.omdb.apiKey;
    if (omdbCache.has(imdbId)) {
        return omdbCache.get(imdbId);
    }
    try {
        const response = await axios.get(`http://www.omdbapi.com/?i=${encodeURIComponent(imdbId)}&apikey=${omdbApiKey}`);
        const data = response.data;
        if (data.Response === 'True') {
            omdbCache.set(imdbId, data.Poster);
            return data.Poster;
        } else {
            console.error('OMDb API Error:', data.Error);
            return null;
        }
    } catch (error) {
        console.error('Error fetching poster:', error);
        return null;
    }
}

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s]
        .map(v => v < 10 ? `0${v}` : v)
        .filter((v, i) => v !== '00' || i > 0)
        .join(':');
}

async function updatePresence(activity) {
    try {
        if (!activity) {
            await client.user?.clearActivity();
            return;
        }

        const { title, year } = activity.show || activity.movie;
        const state = activity.episode ? `S${activity.episode.season}E${activity.episode.number}` : 'Movie';
        const episodeTitle = activity.episode ? activity.episode.title : '';
        const duration = new Date(activity.expires_at).getTime() - new Date(activity.started_at).getTime();
        const startTime = new Date(activity.started_at).getTime();
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        const formattedTime = `${formatTime(elapsedTime)}/${formatTime(duration / 1000)}`;
        const imdbId = activity.show ? activity.show.ids.imdb : activity.movie.ids.imdb;
        const posterUrl = await fetchPosterUrl(imdbId);

        await client.user?.setActivity({
            details: `${title} (${year})`,
            state: activity.episode ? `${episodeTitle} | ${state}` : formattedTime,
            startTimestamp: activity.started_at,
            endTimestamp: activity.expires_at,
            largeImageKey: posterUrl ? posterUrl : 'default_image_key',
            largeImageText: activity.episode ? formattedTime : null,
            smallImageKey: 'play',
            smallImageText: 'Tracking with Trakt.tv \n made by @greg',
            buttons: [
                { label: 'IMDB', url: `https://www.imdb.com/title/${imdbId}/` },
                { label: 'made by @greg // satanus', url: 'https://github.com/satanus' }
            ],
            type: 3 // Set the type to "watching"
        });
    } catch (error) {
        console.error('Failed to update presence:', error.message);
    }
}

async function getWatchingActivity() {
    try {
        const activity = await trakt.users.watching({ username: config.trakt.username });
        return activity;
    } catch (error) {
        console.error('Failed to fetch watching activity:', error.message);
    }
}

async function startClient() {
    client = new Client({ clientId: discordClientId });
    
    client.on('ready', async () => {
        console.log('Discord RPC connected!');

        while (true) {
            try {
                const activity = await getWatchingActivity();

                if (activity) {
                    const currentMedia = activity.show ? activity.show.title : activity.movie.title;
                    if (!previousActivity || currentMedia !== previousActivity) {
                        console.log(`Current media detected: ${currentMedia}`);
                        previousActivity = currentMedia;
                    }
                }

                await updatePresence(activity);
            } catch (error) {
                console.error('Error during presence update:', error.message);
            }
            
            await setTimeout(15000); // check every 15 seconds
        }
    });

    client.on('disconnected', async () => {
        console.warn('Discord disconnected, attempting to reconnect...');
        reconnect();
    });

    client.on('error', async (error) => {
        console.error('Discord RPC error:', error.message);
        reconnect();
    });

    try {
        await client.login();
    } catch (error) {
        console.error('Failed to login to Discord RPC:', error.message);
        reconnect();
    }
}

async function reconnect() {
    console.log('Attempting to reconnect in 5 seconds...');
    await setTimeout(5000);
    startClient();
}

startClient().catch(console.error);
