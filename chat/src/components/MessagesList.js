import React from 'react';
import PropTypes from 'prop-types';


const MessagesList = ({message}) => (
  <section id ="messages-list">
    <ul>
      {messages.map(message => (
        <Messages
          key={message.id}
          {...message}
        />
      ))}
    </ul>
  </section>
)


MessagesList.PropTypes = {
  message: PropTypes.arrayOf(
    PropTypes.shape({
      id: PorpTypes.number.isRequired,
      message: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired

}

export default MessagesList;
