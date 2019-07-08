web: gunicorn scane.wsgi --log-file - --chdir ./src
worker: cd ./src && celery worker --app=scane -l info