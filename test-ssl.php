<?php
$ch = curl_init('https://api-eu.pusher.com');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_VERBOSE, true);
$response = curl_exec($ch);

if (curl_error($ch)) {
    echo 'Ошибка: ' . curl_error($ch);
} else {
    echo 'Успешно!';
}
curl_close($ch);
