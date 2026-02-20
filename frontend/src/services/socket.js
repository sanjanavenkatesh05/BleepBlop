import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;

const connect = (user, onMessageReceived, onUserListUpdate) => {
    // SockJS needs an http/https URL, not ws/wss. It negotiates the upgrade internally.
    let rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8081';

    try {
        const parsedUrl = new URL(rawApiUrl);
        if (window.location.protocol === 'https:' && parsedUrl.protocol === 'http:') {
            parsedUrl.protocol = 'https:';
            rawApiUrl = parsedUrl.toString();
            // remove trailing slash if present
            if (rawApiUrl.endsWith('/')) rawApiUrl = rawApiUrl.slice(0, -1);
        }
    } catch (e) {
        console.error("Failed to parse VITE_API_URL", e);
    }

    const socketUrl = rawApiUrl + '/ws';

    // Sometimes Render's SSL termination causes SockJS to get confused about the protocol.
    // Forcing specific transports and bypassing the default iframe can help.
    const socket = new SockJS(socketUrl, null, {
        transports: ['websocket', 'xhr-streaming', 'xhr-polling']
    });
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
