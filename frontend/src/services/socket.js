import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;

const connect = (user, onMessageReceived, onUserListUpdate) => {
    // SockJS will automatically handle HTTP vs HTTPS and switch to ws:// or wss://.
    // However, on Render, we MUST ensure the API URL passed to SockJS uses https://
    // if the page is loaded over https://
    const isSecure = window.location.protocol === 'https:';
    let rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8081';

    if (isSecure && rawApiUrl.startsWith('http://')) {
        rawApiUrl = rawApiUrl.replace('http://', 'https://');
    }

    const socketUrl = rawApiUrl + '/ws';
    const socket = new SockJS(socketUrl);
    stompClient = Stomp.over(socket);
    stompClient.debug = () => { }; // Disable debug logs

    stompClient.connect({}, () => {
        // Subscribe to public topic (for user joins/leaves)
        stompClient.subscribe('/topic/public', onMessageReceived);

        // Subscribe to private messages
        if (user && user.username) {
            stompClient.subscribe(`/user/${user.username}/queue/messages`, onMessageReceived);
        }

        // Tell server we joined
        stompClient.send("/app/chat.addUser",
            {},
            JSON.stringify({ sender: user.username, type: 'JOIN' })
        );

        // Request user list? Or maybe just wait for updates.
        // Ideally we should have a way to fetch initial users.
    }, (error) => {
        console.error('WebSocket connection error:', error);
    });
};

const sendMessage = (message) => {
    if (stompClient) {
        stompClient.send("/app/chat.sendPrivateMessage", {}, JSON.stringify(message));
    }
};

const disconnect = () => {
    if (stompClient) {
        stompClient.disconnect();
    }
};

const SocketService = {
    connect,
    sendMessage,
    disconnect
};

export default SocketService;
