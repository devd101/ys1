/*
	The following envionment variables must be set:

	botToken
	yedionUrl
	yoasimUrl
	yoasimPTUrl

*/

let devConfig = {};
var fs = require('fs');
if (fs.existsSync('./devConfig.js')) {
	devConfig = require('./devConfig.js');
	//console.log('devConfig: ', devConfig);
}

// process.exit(0);

const Ttoken = devConfig.botToken || process.env.botToken;
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

const session = require('telegraf/session')


const parseString = require('xml2js').parseString;
let xmlTxt = fs.readFileSync('./text/textData.xml', 'utf8');
let txtData;
parseString(xmlTxt, { trim: true, explicitArray: false }, (err, result) => {
	txtData = result.root;
	// console.log(txtData);
});


const bot = new Telegraf(Ttoken)


const mainKeyboard = Markup.inlineKeyboard([
	// Markup.urlButton('❤️', 'http://telegraf.js.org'),

	// Markup.urlButton('ידיעון', 'https://t.me/Yoasim'),
	Markup.urlButton('ידיעון', devConfig.yedionUrl || process.env.yedionUrl),

	Markup.callbackButton('שאלות ותשובות', 'qna1'),

	Markup.callbackButton('תרפיה ואינטגרציה', 'terapia'),
	Markup.callbackButton('תרומה/עזרה', 'truma')
],
	{
		columns: 1
	})

bot.start((ctx) => {
	ctx.reply('ברוכים הבאים לפרויקט יוע"סים!', Extra.markup(mainKeyboard));
});


bot.action('restart', (ctx) => {
	ctx.editMessageText('ברוכים הבאים לפרויקט יוע"סים!', Extra.markup(mainKeyboard));
});

//Quick and (very) dirty....
bot.action('restartNoEdit', (ctx) => {
	ctx.reply('ברוכים הבאים לפרויקט יוע"סים!', Extra.markup(mainKeyboard));
});



// ******************************** QnA ********************************

bot.action('qna1', (ctx) => {
	ctx.editMessageText(txtData.qna1,
		Extra.markup(
			Markup.inlineKeyboard([
				Markup.callbackButton('המשך...', 'qna2'),
			],
				{
					columns: 1
				})
		)
	)
});

bot.action('qna2', (ctx) => {
	ctx.reply(txtData.qna2,
		Extra.markup(
			Markup.inlineKeyboard([
				Markup.callbackButton('המשך...', 'qna3')
			],
				{
					columns: 1
				})
		)
	)
});

bot.action('qna3', (ctx) => {
	ctx.reply(txtData.qna3,
		Extra.markup(
			Markup.inlineKeyboard([
				Markup.callbackButton('המשך...', 'qna4')
			],
				{
					columns: 1
				})
		)
	)
});

bot.action('qna4', (ctx) => {
	ctx.reply(txtData.qna4,
		Extra.markup(
			Markup.inlineKeyboard([
				// Markup.urlButton('אני מבין וקראתי את החוקים', 'https://t.me/Yoasim'),
				Markup.urlButton('אני מבין וקראתי את החוקים', devConfig.yoasimUrl || process.env.yoasimUrl),
				Markup.callbackButton('לתפריט הראשי', 'restart'),
			],
				{
					columns: 1
				})
		)
	)
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


bot.action('terapia', (ctx) => {
	ctx.editMessageText(txtData.terapia,
		Extra.markup(
			Markup.inlineKeyboard([
				// Markup.urlButton('אני מבין וקראתי את החוקים', 'https://t.me/YoasimPT'),
				Markup.urlButton('אני מבין וקראתי את החוקים', devConfig.yoasimPTUrl || process.env.yoasimPTUrl),
				Markup.callbackButton('לתפריט הראשי', 'restart'),
			],
				{
					columns: 1
				})
		)
	)
});


bot.action('truma', (ctx) => {
	ctx.editMessageText(txtData.truma,
		Extra.markup(
			Markup.inlineKeyboard([
				Markup.callbackButton('כתובת הארנק', 'walletAddress'),
				Markup.callbackButton('לתפריט הראשי', 'restart'),
			],
				{
					columns: 1
				})
		)
	)
});

bot.action('walletAddress', (ctx) => {
	// ctx.reply('1A4nD24t2iwzYkT8dBZJ2sna5SBtNd2YVx');	
	ctx.reply(txtData.walletAddress);

	ctx.replyWithPhoto({ source: fs.createReadStream('./img/walletQR.jpg') },
		Extra.markup(
			Markup.inlineKeyboard([
				Markup.callbackButton('לתפריט הראשי', 'restartNoEdit'),
			],
				{
					columns: 1
				})
		));

	// ctx.editMessageText(txtData.walletAddress,
	// 	Extra.markup(
	// 		Markup.inlineKeyboard([
	// 			Markup.callbackButton('לתפריט הראשי', 'restart'),
	// 		],
	// 			{
	// 				columns: 1
	// 			})
	// 	)
	// )
});

bot.startPolling();
