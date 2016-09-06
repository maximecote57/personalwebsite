<?php

require_once "vendor/autoload.php";

$name = $_POST['name'];
$email = $_POST['email'];
$message = $_POST['message'];

$mail = new PHPMailer(); // create a new object
$mail->IsSMTP(); // enable SMTP
$mail->SMTPDebug = 1; // debugging: 1 = errors and messages, 2 = messages only
$mail->SMTPAuth = true; // authentication enabled
$mail->SMTPSecure = 'ssl'; // secure transfer enabled REQUIRED for Gmail
$mail->Host = "smtp.gmail.com";
$mail->Port = 465; // or 587
$mail->IsHTML(true);
$mail->Username = "maxime.cote57@gmail.com";
$mail->Password = "575goldfish57";
$mail->SetFrom($email);
$mail->Subject = "New message from personal website";
$mail->Body = "<p>Name : " . $name . "</p><p>Email : " . $email . "</p><p>Message : " . $message . "</p>" ;
$mail->AddAddress("maxime.cote57@gmail.com");

if(!$mail->send())
{
    return json_encode("Mailer Error: " . $mail->ErrorInfo);
}
else
{
    return json_encode("Message has been sent successfully");
}