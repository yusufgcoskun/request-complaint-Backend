const Message = require("message");

const createMessage = (messageObject, ticketId, senderId) => {
  const { type, text, attachment } = messageObject;
  return Message.create({
    senderId: senderId ? senderId : null,
    type,
    text,
    attachment,
  });
};

module.exports = {
  createMessage,
};
