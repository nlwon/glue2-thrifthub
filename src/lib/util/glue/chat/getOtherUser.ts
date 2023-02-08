const getOtherUser = ({ chatroom, user }) => {
	if (chatroom?.author === user?.id) return chatroom?.searcher;
	return chatroom?.author;
};

export default getOtherUser;
