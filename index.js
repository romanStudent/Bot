// Api Telegram
const TelegramApi = require('node-telegram-bot-api');

// Импорт вариантов ответа из 'options.js'
const {gameOptions, againOptions} = require('./options');

// Ссылка на Бота
const token = '6924530873:AAFkXPCtrAtwFjMOUpM9mICKtegXjiWK2Gg';

// Создание бота
const bot = new TelegramApi(token, {polling: true}); 


// Типо БАЗА-ДАННЫХ
const chats = {};   // key - id чата
                    // значение - загадонное число


/* ПЕРЕНЕС В 'option.js'
const gameOptions = {
	reply_markup: JSON.stringify({

	  // Варианты ответа: 
		inline_keyboard: [
            [{text: '1', callback_data: '1'}, {text: '2', callback_data: '2'}],
            [{text: '2', callback_data: '2'}],
            [{text: '3', callback_data: '3'}],
            [{text: '4', callback_data: '4'}],
            [{text: '5', callback_data: '5'}],
            [{text: '6', callback_data: '6'}],
            [{text: '7', callback_data: '7'}],
            [{text: '8', callback_data: '8'}],
            [{text: '9', callback_data: '9'}],
		]
	})
}

const againOptions = {
	reply_markup: JSON.stringify({

	  // Варианты ответа: 
		inline_keyboard: [
            [{text: 'Играть еще раз', callback_data: '/again'}],
		]
	})
}
*/



// Шаблон для функции генерации числа
const startGame = async (chatId) => {
        await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен угадать');
        const randomNumber = Math.floor(Math.random() * 10);
	     // Запись рандомного числа в массив данных
	    chats[chatId] = randomNumber;
	    console.log(chats[chatId]);
	    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);    // gameOptions - варианты ответа
	                
}

const start = () => {
   bot.setMyCommands([
    {command: '/start', description: 'Начальное приветствие'},
    {command: '/info', description: 'Получить информацию'},
    {command: '/game', description: 'Игра Угадай число'}
]);

bot.on('message', async msg => {
	console.log(msg);       /* 'msg' - сообщение, которое было отправлено в бот
                               В 'msg' информация о том: 1) Id сообщения
                                                         2) От кого оно отправлено
                                                         3) Информация о самом чате
                                                         4) Дата отправки сообщения
                                                         5) Текст, который был отправлен
                            */
    // !!! OMG !!!
	const text = msg.text;         // текст, который отправил пользователь боту      
	const chatId = msg.chat.id;    // 'id' чата



if(text === '/start') {
	// Отправка текста от бота, по конкретному 'id' чата
	 await bot.sendMessage(chatId, `I send you text ${text}`)     // chatId - id чата
	                                                              // text - текст, который отправлен боту
	// Отправка стикера(фотографии) от бота, по конкретному 'id' чата
	 await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp');     
}

    


	if(text === '/info') {
		return bot.sendMessage(chatId, `Your Name is ${msg.from.first_name}`)
	}

	if(text === '/game') {
        return startGame(chatId);       
	}  
	    console.log(chats[chatId]);
		console.log(text);
     if(text !== '/start') {
        return bot.sendMessage(chatId, "I don't unterstand you");
	 }

  }) 

 
	      bot.on('callback_query', async msg => {
	      	const data = msg.data;
	      	const chatId = msg.message.chat.id;
	      	if(data == '/again') {
	      		return startGame(chatId);
	      	}

	      	if(data == chats[chatId]) {
	      		return await bot.sendMessage(chatId, `Поздравляю ты отгадал цифру - ${chats[chatId]}`, againOptions);   // againOptions - позволяет начать ИГРУ ЗАНОВО
	      	} else {
	      		console.log(data);
	      		console.log(chats[chatId]);
	      		return await bot.sendMessage(chatId, `Попробуй еще раз. Твой выбор - ${data}`, againOptions);
	      	}

  	        bot.sendMessage(chatId, `Ты выбрал цифру ${data}`);
  })

};

start();