/**
 *
 *
 *        ______            __       __        __         
 *       / ____/____   ____/ /___   / /____ _ / /__ __  __
 *      / /    / __ \ / __  // _ \ / // __ `// //_// / / /
 *     / /___ / /_/ // /_/ //  __// // /_/ // ,<  / /_/ / 
 *     \____/ \____/ \__,_/ \___//_/ \__,_//_/|_| \__, /  
 *                                         /____/  
 *
 *                   2023 LICENCE (JAVASCRIPT)
 *
 *    Tento kód spadá pod licenci programátora a autora kódu.
 *                  Více informací najdete na
 *                      www.tvujpartak.cz
 *                       www.codelaky.cz
 *
 *  E-mail: lukas.helebrandt@gmail.com   |    Tel: +420 721 770 063
 * 
 * @author Lukáš Helebrandt
 */

const Twit = require('twit');
const TelegramBot = require('node-telegram-bot-api');

// Přístupové klíče a tokeny pro Twitter API
const twitterConfig = {
  consumer_key: 'YOUR_CONSUMER_KEY',
  consumer_secret: 'YOUR_CONSUMER_SECRET',
  access_token: 'YOUR_ACCESS_TOKEN',
  access_token_secret: 'YOUR_ACCESS_TOKEN_SECRET'
};

// Token pro Telegram API
const telegramToken = 'telegram_token_api';

// Vytvoření instance Twit klienta
const twitClient = new Twit(twitterConfig);

// Vytvoření instance Telegram Bota
const telegramBot = new TelegramBot(telegramToken, { polling: true });

// Uživatelské jméno na Twitteru pro sledování
const twitterUser = 'User_name_twitter';

// Sledování příspěvků na Twitteru
twitClient.get('users/show', { screen_name: twitterUser }, (error, user) => {
  if (error) {
    console.error('Error getting Twitter user:', error);
  } else {
    const userId = user.id_str;
    const stream = twitClient.stream('statuses/filter', { follow: userId });

    stream.on('tweet', (tweet) => {
      if (tweet.user.screen_name === twitterUser) {
        const message = createTwitterMessage(tweet);
        sendTelegramMessage(message);
      }
    });
  }
});

function createTwitterMessage(tweet) {
  const { text, user } = tweet;
  const message = `New tweet from @${user.screen_name}:\n\n${text}`;
  return message;
}

function sendTelegramMessage(message) {
  telegramBot.sendMessage('_Chat_ID_', message)
    .catch((error) => {
      console.error('Error sending Telegram message:', error);
    });
}
