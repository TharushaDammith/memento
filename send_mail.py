from mailjet_rest import Client
import os


class SendMail:
    def __init__(self, link, to_mail, name):
        self.api_key = os.environ.get("API_KEY")
        self.api_secret = os.environ.get("API_SECRET")
        self.mailjet = Client(auth=(self.api_key, self.api_secret), version='v3.1')
        self.data = {
            "Messages": [
                {
                    "From": {
                        "Email": os.environ.get("FROM_MAIL"),
                        "Name": "Memento"
                    },

                    "To": [
                        {
                            "Email": to_mail,
                            "Name": name
                        }
                    ],

                    "Subject": "Memento email verification",
                    "TextPart": "Email verification",
                    "HTMLPart": f"<p>Click this link to verify your email</p><br><a href='{link}'>{link}</a>",
                    "CustomID": "AppGettingStartedTest"
                }
            ]
        }

    def send_msg(self):
        result = self.mailjet.send.create(data=self.data)
        return result
