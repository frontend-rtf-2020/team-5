package mailer

import (
	"fmt"
	"gopkg.in/gomail.v2"
	"net/smtp"
)

type EMail struct {
	To              string
	ConfimationCode string
}

type Mailer struct {
	Login    string
	Password string
	Server   string

	auth smtp.Auth
}

func NewMailer(login string, password string, server string) Mailer {
	auth := smtp.PlainAuth(
		"",
		login,
		password,
		server,
	)

	return Mailer{
		Login:    login,
		Password: password,
		Server:   server,
		auth:     auth,
	}

}

func (m *Mailer) SendConfirmationEmail(task EMail) {
	mail := gomail.NewMessage()
	mail.SetHeader("From", m.Login)
	mail.SetHeader("To", task.To)
	mail.SetHeader("Subject", "GoEv account confirmation")
	mail.SetBody("text/html", fmt.Sprintf(`To confirm your account in GoEv messenger follow this <a href="https://messenger.rtf17.ru/confirm/%s">link</a>`, task.ConfimationCode))
	d := gomail.NewDialer(m.Server, 25, m.Login, m.Password)
	if err := d.DialAndSend(mail); err != nil {
		panic(err)
	}
}
