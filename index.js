// Api Telegram
const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options');
const token = '6924530873:AAFkXPCtrAtwFjMOUpM9mICKtegXjiWK2Gg';


const bot = new TelegramApi(token, {polling: true}); 
const chats = {}; 


const againOptions = {
	reply_markup: JSON.stringify({
		inline_keyboard: [
                    [{text: 'Играть еще раз', callback_data: '/again'}],
		]
	})
}

const startGame = async (chatId) => {
            await bot.sendMessage(chatId, 'Jetzt werde ich die Zahl von 0 bis 9 erraten, und Sie müssen raten');
            const randomNumber = Math.floor(Math.random() * 10);
	    chats[chatId] = randomNumber;
	    await bot.sendMessage(chatId, 'Raten Sie', gameOptions); 
	                
}

const start = () => {
   bot.setMyCommands([
    {command: '/start', description: 'Begrüßung'},
    {command: '/info', description: 'Information'},
    {command: '/spiel', description: `Spiel "Raten SIe die Zahl" `}
]);

bot.on('message', async msg => {
	const text = msg.text;             
	const chatId = msg.chat.id;    

        if(text === '/start') {
	  await bot.sendMessage(chatId, `Ich sende Ihnen den Text ${text}`);
	  await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp');     
        }

	if(text === '/info') {
          return bot.sendMessage(chatId, `Ihr Name ist ${msg.from.first_name}`)
	}

	if(text === '/spiel') {
          return startGame(chatId);       
	}  

        if(text !== '/start') {
          return bot.sendMessage(chatId, "Ich verstehe Ihnen nicht");
	}
  });

bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
	
	if(data == '/again') {
	  return startGame(chatId);
	}

	if(data == chats[chatId]) {
	  return await bot.sendMessage(chatId, `Herzlichen Glückwunsch, Sie haben die Zahl erraten - ${chats[chatId]}`, againOptions); 
	} else {
	  return await bot.sendMessage(chatId, `Probieren Sie noch mal. Ihre Auswahl - ${data}`, againOptions);
	}
        
	bot.sendMessage(chatId, `Sie haben die Zahl ${data} ausgewählt`);
  })

};

start();
