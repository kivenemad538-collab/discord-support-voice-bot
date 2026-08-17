const { Client, GatewayIntentBits } = require('discord.js');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  entersState,
} = require('@discordjs/voice');
const play = require('play-dl');

// ==================== الإعدادات والـ IDs ====================
const GUILD_ID = '1535754836061065318';
const SUPPORT_VOICE_CHANNEL_ID = '1536099298721140756';
const VIDEO_URL = 'https://cdn.discordapp.com/attachments/1536347609164161034/1538991092345868298/Y2Mate.is_-_Clip_Cairo_Up_-3enba_x_Double_Zuksh___.mp3?ex=6a84b0a5&is=6a835f25&hm=0fb49e5d0d9a158705bd8404ec168160c153ba5ee4716c50871887a02e0da668&';
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

    const source = await play.stream(VIDEO_URL, {
      discordPlayerCompatibility: true,
    });

    player = createAudioPlayer();
    const resource = createAudioResource(source.stream, {
      inputType: source.type,
    });

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
    console.error('تعذر دخول الروم أو تشغيل الرابط:', error.message);
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
