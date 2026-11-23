<?php
// Обработчик формы обратной связи (для хостинга с PHP, например Beget).
// Настройка: адрес получателя — в TO ниже (или переменная окружения FORM_TO).
// Защита: ловушка для ботов (поле website), минимальное время заполнения, лимит 3 сообщения за 10 минут с одного IP.
header('Content-Type: application/json; charset=utf-8');
header('X-Robots-Tag: noindex');

const TO = '';                 // ← впишите email получателя
const FROM = 'no-reply@' ;     // домен подставится автоматически
const LIMIT = 3, WINDOW = 600; // не больше 3 сообщений за 10 минут с одного IP

function out($code, $data) { http_response_code($code); echo json_encode($data, JSON_UNESCAPED_UNICODE); exit; }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') out(405, ['ok' => false, 'error' => 'Метод не поддерживается.']);
$to = getenv('FORM_TO') ?: TO;
if (!$to) out(500, ['ok' => false, 'error' => 'Форма ещё не настроена. Напишите в поддержку сервиса.']);

// Бот заполнил скрытое поле — отвечаем «успешно», но ничего не отправляем
if (!empty($_POST['website'])) out(200, ['ok' => true]);

$ts = (int)($_POST['ts'] ?? 0);
if ($ts && (round(microtime(true) * 1000) - $ts) < 3000) out(400, ['ok' => false, 'error' => 'Слишком быстро. Попробуйте ещё раз.']);

$clean = fn($v, $max) => mb_substr(trim(str_replace(["\r", "\0"], '', (string)$v)), 0, $max);
$name = $clean($_POST['name'] ?? '', 80);
$email = $clean($_POST['email'] ?? '', 120);
$topic = $clean($_POST['topic'] ?? '', 80);
$msg = $clean($_POST['message'] ?? '', 3000);
$agree = !empty($_POST['agree']);

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $topic === '' || mb_strlen($msg) < 10 || !$agree)
  out(422, ['ok' => false, 'error' => 'Проверьте поля формы.']);
if (preg_match_all('~https?://~i', $msg) > 2) out(422, ['ok' => false, 'error' => 'Слишком много ссылок в сообщении.']);

// Лимит по IP
$ip = $_SERVER['REMOTE_ADDR'] ?? '0';
$file = sys_get_temp_dir() . '/fd_form_' . md5($ip);
$now = time();
$hits = array_filter(array_map('intval', @file($file, FILE_IGNORE_NEW_LINES) ?: []), fn($t) => $t > $now - WINDOW);
if (count($hits) >= LIMIT) out(429, ['ok' => false, 'error' => 'Слишком много сообщений. Попробуйте позже.']);
$hits[] = $now;
@file_put_contents($file, implode("\n", $hits), LOCK_EX);

$host = preg_replace('~[^a-z0-9.\-]~i', '', $_SERVER['HTTP_HOST'] ?? 'localhost');
$subject = '=?UTF-8?B?' . base64_encode("[Справочник] $topic") . '?=';
$body = "Имя: $name\nEmail: $email\nТема: $topic\nIP: $ip\n\n$msg\n";
$headers = "From: " . FROM . "$host\r\nReply-To: $email\r\nContent-Type: text/plain; charset=utf-8\r\n";

if (!@mail($to, $subject, $body, $headers)) out(500, ['ok' => false, 'error' => 'Не удалось отправить. Попробуйте позже.']);
out(200, ['ok' => true]);
