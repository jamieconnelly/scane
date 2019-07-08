web: gunicorn scane.wsgi --log-file - --chdir ./src
worker: cd ./src && REMAP_SIGTERM=SIGQUIT celery worker --app=scane -l info -c4