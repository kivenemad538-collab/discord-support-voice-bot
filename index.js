const { Client, GatewayIntentBits } = require('discord.js');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  entersState,
} = require('@discordjs/voice');
const path = require('path');

// ==================== الإعدادات والـ IDs ====================
const GUILD_ID = '1535754836061065318';
const SUPPORT_VOICE_CHANNEL_ID = '1536099298721140756';
const SUPPORT_AUDIO_FILE = path.join(__dirname, 'support.mp3');
const LEAVE_AFTER_PLAYING = true;
// التوكن لا تضعه هنا؛ ضعه في Railway باسم DISCORD_TOKEN.
// ===========================================================

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

let connection = null;
let player = null;
let isPlaying = false;

async function disconnectBot() {
  isPlaying = false;
  if (player) {
    player.stop(true);
    player = null;
  }
  if (connection) {
    connection.destroy();
    connection = null;
  }
}

async function playWelcome(channel) {
  if (isPlaying) return;
  isPlaying = true;

  try {
    connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfDeaf: true,
    });

    await entersState(connection, VoiceConnectionStatus.Ready, 20_000);

    player = createAudioPlayer();
    const resource = createAudioResource(SUPPORT_AUDIO_FILE);

    connection.subscribe(player);
    player.play(resource);

    player.once(AudioPlayerStatus.Idle, async () => {
      isPlaying = false;
      if (LEAVE_AFTER_PLAYING) await disconnectBot();
    });

    player.on('error', async (error) => {
      console.error('خطأ أثناء تشغيل الصوت:', error.message);
      await disconnectBot();
    });
  } catch (error) {
    console.error('تعذر دخول الروم أو تشغيل support.mp3:', error.message);
    await disconnectBot();
  }
}

client.once('ready', () => {
  console.log(`تم تشغيل البوت باسم ${client.user.tag}`);
});

client.on('voiceStateUpdate', async (oldState, newState) => {
  const joinedTargetRoom =
    !newState.member?.user.bot &&
    newState.guild.id === GUILD_ID &&
    newState.channelId === SUPPORT_VOICE_CHANNEL_ID &&
    oldState.channelId !== SUPPORT_VOICE_CHANNEL_ID;

  if (joinedTargetRoom && newState.channel) {
    await playWelcome(newState.channel);
  }
});

const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error('أضف DISCORD_TOKEN داخل Variables في Railway.');
  process.exit(1);
}

client.login(token);
