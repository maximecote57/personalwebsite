<?php

require_once "vendor/autoload.php";

$name = $_POST['name'];
$email = $_POST['email'];
$message = $_POST['message'];

$mail = new PHPMailer(); // create a new object
$mail->IsHTML(true);
$mail->IsSMTP();
$mail->Host = "moonspell.asoshared.com";
$mail->SMTPAuth = true;
$mail->Username = "maxime@maxime-cote.com";
$mail->Password = "MCtp57pEM!M";
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