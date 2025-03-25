from invoke import task


@task
def run(c):
    c.run("flask --debug run")


@task
def install(c):
    c.run("pip install -r requirements.txt")


@task
def format(c):
    c.run("black .")


@task
def freeze(c):
    c.run("pip freeze > requirements.txt")
