var restify = require('restify');
var builder = require('botbuilder');

var mainMenuItems = {
    "Search for Document": {
        id: "searchDocument",
        Description: "Search for Document"
    }
}

var searchDocItems = {
    "General Document": {
        id: "generalDoc"
    }
}

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3980, function () {
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
    var reply = new builder.Message(session).text('Hi  %s! Geetings !', session.message.user.name);
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
bot.dialog("mainMenu", [function (session) {
    builder.Prompts.choice(session, "What you looking for?", mainMenuItems, { listStyle: builder.ListStyle.button });
},
function (session, results) {
    if (results.response) {
        var selectedItem = mainMenuItems[results.response.entity];
        builder.Prompts.text(session, `Let me help you with  : ${selectedItem.Description}`);
        session.userData.selectedChoice = selectedItem;
        session.endDialogWithResult({ response: selectedItem });
    }
}])
    .triggerAction({
        matches: /^start$/i,
    })

bot.dialog("document", [function (session) {
    builder.Prompts.choice(session, "What type of document you looking for?", searchDocItems, { listStyle: builder.ListStyle.button });
},
function (session, results) {
    var ev = createEvent("search", results.response.entity, address);
    session.send(ev);
}]);

const createEvent = (eventName, value, address) => {
    var msg = new builder.Message().address(address);
    msg.data.type = 'event';
    msg.data.name = eventName;
    msg.data.value = value;
    return msg;
};

bot.dialog('showresults', function (session, args, next) {
    var msg = new builder.Message().address(baseAddress);
    msg.attachmentLayout(builder.AttachmentLayout.carousel);
    var items = session.message.value;
    var heroCards = items.map(x => {
        return new builder.HeroCard(session)
            .title(x.Title.substring(0, x.Title.indexOf('.')))
            .subtitle(x.FileExtension)
            .text(x.SubText)
            .buttons([
                builder.CardAction.imBack(session, "Download - " + x.Title, "Download")
            ])
    })
    msg.attachments(heroCards);
    session.send(msg).endDialog();
}).triggerAction({
    matches: /^showresults$/i,
})

bot.on("event", function (event) {
    if (event.name == "sendUserInfo")
        address = event.address;
})
