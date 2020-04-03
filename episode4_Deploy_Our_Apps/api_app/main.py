import web
import os

urls = (
    '/(.*)', 'hello'
)
app = web.application(urls, globals())

class hello:
    def GET(self, name):
        if not name:
            name = 'World'
        return 'Hello, ' + os.environ['NAME'] + '!'

if __name__ == "__main__":
    app.run()
