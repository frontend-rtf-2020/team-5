package main

import "chat/pkg/mailer"



// noreply@rtf17.ru
//  LZBu6Nd5

func main() {
	mt := mailer.EMail{
		To:              "akerlayg@gmail.com",
		ConfimationCode: "googo",
	}

	m := mailer.NewMailer("noreply@rtf17.ru", "LZBu6Nd5", "smtp.timeweb.ru")

	m.SendConfirmationEmail(mt)
}
