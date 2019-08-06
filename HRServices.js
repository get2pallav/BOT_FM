var builder = require('botbuilder');

module.exports = [

    function (session) {
        const card = new builder.ThumbnailCard(session)
            .title('HR Services')
            .text(`Hi there! I'm HR Helpdesk. 
                    You can choose one of the options below
                    or type in a command of your own
                    (assuming I support it)`)
            .buttons([
                builder.CardAction.imBack(session, 'Policy', 'Policy Details'),
                builder.CardAction.imBack(session, 'Leave', 'Leave related queries'),
                builder.CardAction.imBack(session, 'Profile Update', 'Profile Update'),
                builder.CardAction.imBack(session, 'Other', 'Other'),
            ]);
        const message = new builder.Message(session)
            .addAttachment(card);
        session.endConversation(message);
    }
]