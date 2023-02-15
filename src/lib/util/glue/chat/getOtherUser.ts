const getOtherUser = ({ chatroom, user, isExpanded = false }) => {
	if (isExpanded) {
		if (chatroom?.author === user?.id) return chatroom?.expand?.searcher;
		return chatroom?.expand?.author;
	} else {
		if (chatroom?.author === user?.id) return chatroom?.searcher;
		return chatroom?.author;
	}
};

export default getOtherUser;
