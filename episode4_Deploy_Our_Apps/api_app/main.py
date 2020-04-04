import web
import os

urls = (
    '/python', 'hello'
)
app = web.application(urls, globals())

class hello:
    def GET(self):
        return 'My name is ' + os.environ['APP_NAME'] + '!'

if __name__ == "__main__":
    app.run()
