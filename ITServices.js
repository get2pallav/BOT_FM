var builder = require('botbuilder');
var options = require('./options');

module.exports = [

    (session) => {
        const card = new builder.ThumbnailCard(session)
            .title('IT Services')
            .text(`Hi there! I'm IT Helpdesk. 
                    You can choose one of the options below
                    or type in a command of your own
                    (assuming I support it)`)
            .buttons([
                builder.CardAction.imBack(session, 'Work Station', 'Work Station'),
                builder.CardAction.imBack(session, 'Desktop or laptop Issues', 'Desktop or laptop Issues'),
                builder.CardAction.imBack(session, 'New Hardware or Software', 'New Hardware or Software'),
                builder.CardAction.imBack(session, 'Other', 'Other'),
            ]);
        const message = new builder.Message(session)
            .addAttachment(card);
        session.endConversation(message);

    }
]

const abc = (session, bot) => {
//    const card = new builder.ThumbnailCard(session)
//        .title('IT Services')
//        .text(`Hi there! I'm IT Helpdesk. 
//                    You can choose one of the options below
//                    or type in a command of your own
//                    (assuming I support it)`)
//        .buttons([
//            builder.CardAction.imBack(session, 'Work Station', 'Work Station'),
//            builder.CardAction.imBack(session, 'Desktop or laptop Issues', 'Desktop or laptop Issues'),
//            builder.CardAction.imBack(session, 'New Hardware or Software', 'New Hardware or Software'),
//            builder.CardAction.imBack(session, 'Other', 'Other'),
//        ]);
//    const message = new builder.Message(session)
//        .addAttachment(card);
   
    bot.dialog("Work Station", [function (session) {
        builder.Prompts.choice(session, "What type of document you looking for?", [], { listStyle: builder.ListStyle.button });
    }])

    bot.dialog("Desktop or laptop Issues", [function (session) {
        builder.Prompts.choice(session, "What type of document you looking for?", ["hi", "ok"], { listStyle: builder.ListStyle.button });
    }]).triggerAction({
        matches: /^Desktop or laptop Issues$/i,
    })
    bot.dialog("New Hardware or Software", [function (session) {
        builder.Prompts.choice(session, "What type of document you looking for?", searchDocItems, { listStyle: builder.ListStyle.button });
    }])
    bot.dialog("Other", [function (session) {
        builder.Prompts.choice(session, "What type of document you looking for?", searchDocItems, { listStyle: builder.ListStyle.button });
    }])

//    session.endConversation(message);
}