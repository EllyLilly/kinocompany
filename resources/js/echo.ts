
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';


// Pusher доступен глобально
window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'eu',
    forceTLS: true,

    logToConsole: true
});

window.Echo = echo;

export default echo;
