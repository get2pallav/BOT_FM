var restify = require('restify');
var builder = require('botbuilder');
var options = require('./options');
// Setup Restify Server
var server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: , ///APP ID
    appPassword: ///APP PASSWORD
});
// Listen for messages from users 
server.post('/api/messages', connector.listen());

var inMemoryStorage = new builder.MemoryBotStorage();

var bot = new builder.UniversalBot(connector, [function (session) {
    baseAddress = session.message.address;
    var reply = new builder.Message(session).text('Hi  %s! Greetings !', session.message.user.name);
    session.send(reply);
    session.beginDialog("mainMenu");
},
function (session, result) {
    if (result) {
        session.beginDialog("document");
    }
}]).set('storage', inMemoryStorage);

var baseAddress = null;
var address = null;
bot.dialog("mainMenu", [function (session, id, title) {
    var msg = new builder.Message()
    msg.attachmentLayout(builder.AttachmentLayout.carousel);

    var heroCards = options.mainMenuItems.map(x => {
        return new builder.HeroCard(session)
            .title(x.title)
            .subtitle(x.subText)
            .text(x.Description)
            .images([
                builder.CardImage.create(session, x.image)
            ])
            .tap(new builder.CardAction.imBack(session, x.title))
    })
    msg.attachments(heroCards);
    builder.Prompts.text(session, msg, {
        maxRetries: 3,
        retryPrompt: 'Not a valid option'
    });
},
function (session, results) {
    session.beginDialog(results.response);
}])
    .triggerAction({
        matches: /^start$/i,
    });

bot.dialog(options.mainMenuItems[0].title, require('./ITServices'));
bot.dialog(options.mainMenuItems[1].title, require('./HRServices'));