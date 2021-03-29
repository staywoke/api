#!/bin/bash
#
# description: Bash file to manage API Services
#
# author: Peter Schmalfeldt <me@peterschmalfeldt.com>

DIR=`dirname $0`
APP_NAME="API"
PATH_API="$(dirname "$DIR")"
APP_ENV="Development"

ARG1=1
ARG2=2

COMMAND=${!ARG1}
OPTION=${!ARG2}

NX=""
ES=""
MS=""
NX=""
NS=""

IS_DEVELOPMENT=false
IS_STAGING=false
IS_PRODUCTION=false

API_PORT=5000

if test -f "$PATH_API/app/config/local.json"; then
    IS_DEVELOPMENT=true
    APP_ENV="local"

    CONFIG_PORT=$(cat $PATH_API/app/config/local.json | grep port | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g')

    if [[ -n $CONFIG_PORT ]]; then
      API_PORT=$CONFIG_PORT
    fi
fi

if test -f "$PATH_API/app/config/staging.json"; then
    IS_STAGING=true
    APP_ENV="staging"

    CONFIG_PORT=$(cat $PATH_API/app/config/staging.json | grep port | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g')

    if [[ -n $CONFIG_PORT ]]; then
      API_PORT=$CONFIG_PORT
    fi
fi

if test -f "$PATH_API/app/config/production.json"; then
    IS_PRODUCTION=true
    APP_ENV="production"

    CONFIG_PORT=$(cat $PATH_API/app/config/production.json | grep port | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g')

    if [[ -n $CONFIG_PORT ]]; then
      API_PORT=$CONFIG_PORT
    fi
fi

export API_NODE_ENV=$APP_ENV

__make_header(){
    TEXT=$( echo $1 | tr '\n' ' ')
    echo -e "\n\033[48;5;22m  API $APP_ENV › $TEXT  \033[0m\n"
}

__output(){
    TEXT=$( echo $1 | tr '\n' ' ')
    echo -e "\033[7m › \033[27m $TEXT\n"
}

__success(){
    TEXT=$( echo $1 | tr '\n' ' ')
    echo -e "\033[38;5;34m✓ API $APP_ENV › $TEXT\033[0m\n"
}

__notice(){
    TEXT=$( echo $1 | tr '\n' ' ')
    echo -e "\033[38;5;220m→ API $APP_ENV › $TEXT\033[0m\n"
}

__error(){
    TEXT=$( echo $1 | tr '\n' ' ')
    echo -e "\033[38;5;196m× API $APP_ENV › $TEXT\033[0m\n"
}

__confirm(){
    echo -ne "\n\033[38;5;220m⚠ API $APP_ENV › $1\033[0m"
}

function api(){
  case "$1" in
    install)
      api_install
    ;;
    start)
      service_check
      api_start
    ;;
    stop)
      service_check
      api_stop
    ;;
    restart)
      __error "You are about to restart the $APP_NAME $APP_ENV."

      echo -ne "\33[38;5;196mCONTINUE? (y or n) : \33[0m"
      read CONFIRM
      case $CONFIRM in
          y|Y|YES|yes|Yes)
            api_stop
            api_start
          ;;
          n|N|no|NO|No)
            __notice "Skipping Restart of $APP_NAME $APP_ENV"
          ;;
          *)
            __notice "Please enter only y or n"
      esac
    ;;
    reset)
      api_reset
    ;;
    update)
      api_update
    ;;
    migrate)
      api_migrate
    ;;
    seed)
      api_seed
    ;;
    status)
      service_check
      api_status
    ;;
    "-h" | "-help" | "--h" | "--help" | help)
      api_help
    ;;
    *)
      __error "Missing Argument | Loading Help ..."
      api_help
  esac
}

api_install() {
  __make_header "Installing $APP_NAME $APP_ENV"

  # Change to Doing API Directory
  cd $PATH_API

  api_reset

  npm install
}

api_start() {
  __make_header "Starting $APP_NAME $APP_ENV"

  # Change to Doing API Directory
  cd $PATH_API

  # Cleanup old log files
  rm -f *.log
  rm -f ~/.forever/web-server-$APP_ENV.log

  # Cleanup old Cache Files
  rm -fr .cache/*.cache

  if [[ -n $NX ]]; then
    __notice "Nginx Already Running"
  else
    __success "Starting Nginx"

    if [[ $OSTYPE == darwin* ]]; then
        brew services start nginx
    else
        sudo systemctl start nginx
    fi
  fi

  if [[ -n $ES ]]; then
    __notice "Elasticsearch Already Running"
  else
    __success "Starting Elasticsearch"

    if [[ $OSTYPE == darwin* ]]; then
        brew services start elasticsearch-full
    else
        sudo systemctl start elasticsearch
    fi
  fi

  if [[ -n $MS ]]; then
    __notice "MySQL Already Running"
  else
    __success "Starting MySQL"

    if [[ $OSTYPE == darwin* ]]; then
        brew services start mysql
    elif systemctl list-units --full -all | grep 'mysql'; then
      sudo systemctl start mysql
    else
      __notice "MySQL Instance on Another Server"
    fi
  fi

  if [[ -n $NS ]]; then
    __notice "Node Server Already Running"
  else
    cd $PATH_API

     __success "Cleaning Up Junk Files"
    npm run -s cleanup

     __success "Generating API Docs"
    npm run -s docs

     __make_header "Migrating API Structure"
    npm run -s migrate

     __make_header "Seeding Database"
    npm run -s seed

     __make_header "Updating Search Index"
    npm run -s elasticsearch:create
    npm run -s elasticsearch:update

    if [ "$OPTION" == "debug" ]; then
      __make_header "Starting Node Server in Debug Mode on port $API_PORT"
      DEBUG=express:* ./node_modules/nodemon/bin/nodemon.js index.js
    else
      __make_header "Starting Node Server on port $API_PORT"
      forever start -w --minUptime 1000 --spinSleepTime 1000 -m 1 -l web-server-$APP_ENV.log -o ./web-server-stdout-$APP_ENV.log -e ./web-server-stderr-$APP_ENV.log index.js
    fi

  fi
}

api_stop() {
  __make_header "Stopping $APP_NAME $APP_ENV"

  # Change to Doing API Directory
  cd $PATH_API

  if [[ -n $NX ]]; then
    __confirm "Stopping Nginx. CONTINUE? (y or n): "
    read CONFIRM
    case $CONFIRM in
      y|Y|YES|yes|Yes)
        if [[ $OSTYPE == darwin* ]]; then
          brew services stop nginx
        else
          sudo systemctl stop nginx
        fi
      ;;
      n|N|no|NO|No)
      ;;
      *)
      __notice "Please enter only y or n"
    esac
  else
    __notice "Nginx was not Running"
  fi

  if [[ -n $ES ]]; then
    __confirm "Stopping Elasticsearch. CONTINUE? (y or n): "

    read CONFIRM
    case $CONFIRM in
      y|Y|YES|yes|Yes)
        cd $PATH_API
        npm run -s elasticsearch:delete

        if [[ $OSTYPE == darwin* ]]; then
          brew services stop elasticsearch-full
        else
          sudo systemctl stop elasticsearch
        fi
      ;;
      n|N|no|NO|No)
      ;;
      *)
      __notice "Please enter only y or n"
    esac
  else
    __notice "Elasticsearch was not Running"
  fi

  if [[ -n $MS ]]; then
    __confirm "Stopping MySQL. CONTINUE? (y or n): "

    read CONFIRM
    case $CONFIRM in
      y|Y|YES|yes|Yes)
        if [[ $OSTYPE == darwin* ]]; then
          brew services stop mysql
        elif systemctl list-units --full -all | grep 'mysql'; then
          sudo systemctl start mysql
        else
          __notice "MySQL Instance on Another Server"
        fi
      ;;
      n|N|no|NO|No)
      ;;
      *)
      __notice "Please enter only y or n"
    esac
  else
    __notice "MySQL was not Running"
  fi

  if [[ -n $NS ]]; then
    __success "Stopping Node Server on port $API_PORT"

    cd $PATH_API
    forever stop -w --minUptime 1000 --spinSleepTime 1000 -m 1 -l web-server-$APP_ENV.log -o ./web-server-stdout-$APP_ENV.log -e ./web-server-stderr-$APP_ENV.log index.js

    # kill Known Ports just in case
    lsof -i TCP:$API_PORT | grep LISTEN | awk '{print $2}' | xargs kill -9;
  else
    __notice "Node Server was not Running on port $API_PORT"
  fi

}

api_reset() {
  __make_header "Resetting $APP_NAME $APP_ENV"

  # Change to Doing API Directory
  cd $PATH_API

  # Remove old NPM Modules to prevent weird issues
  rm -fr node_modules
}

api_update() {
  __make_header "Updating $APP_NAME $APP_ENV"

  # Change to Doing API Directory
  cd $PATH_API

  api_stop

  __success "Updating Git Repo"
  git reset --hard
  git fetch
  git pull

  api_install
  api_start
}

api_migrate() {
  __make_header "Migrating $APP_NAME $APP_ENV Database"

  cd $PATH_API
  npm run -s migrate
}

api_seed() {
  __make_header "Migrating $APP_NAME $APP_ENV Database"

  cd $PATH_API
  npm run -s seed
}

api_status() {
  __make_header "$APP_NAME $APP_ENV Status Check"

  if [[ -n $NX ]]; then
    __success "Nginx is Running"
  else
    __error "Nginx is Not Running"
  fi

  if [[ -n $ES ]]; then
    __success "Elasticsearch is Running"
  else
    __error "Elasticsearch is Not Running"
  fi

  if [[ -n $MS ]]; then
    __success "MySQL is Running"
  else
    __error "MySQL is Not Running"
  fi

  if [[ -n $NS ]]; then
    __success "Node Server is Running on port $API_PORT"
  else
    __error "Node Server is Not Running on port $API_PORT"
  fi
}

service_check() {
  if [[ $OSTYPE == darwin* ]]; then
      NX=$(brew services list | grep nginx | awk '{print $2}' | grep started)
      ES=$(brew services list | grep elasticsearch-full | awk '{print $2}' | grep started)
      MS=$(brew services list | grep mysql | awk '{print $2}' | grep started)
      NS=$(lsof -i TCP:$API_PORT | grep LISTEN | awk '{print $2}')
  else
      NX=$(systemctl status nginx | grep 'Main PID' | awk '{print $3}')
      ES=$(systemctl status elasticsearch | grep 'Main PID' | awk '{print $3}')
      MS=$(systemctl list-units --full -all | grep 'mysql' && systemctl status mysql | grep 'Main PID' | awk '{print $3}')
      NS=$(lsof -i TCP:$API_PORT | grep LISTEN | awk '{print $2}')
  fi
}

api_help() {
  __make_header "Instructions"

  echo -e "\033[38;5;34m$ api install\033[0m\n"

  echo "  Installs dependencies and NPM modules."

  echo -e "\n\033[38;5;34m$ api start\033[0m\n"

  echo "  Starts Elasticsearch, MySQ & Node Servers."

  echo -e "\n\033[38;5;34m$ api stop\033[0m\n"

  echo "  Stops Elasticsearch, MySQL & Node Servers."

  echo -e "\n\033[38;5;34m$ api restart\033[0m\n"

  echo -e "  Same as running \033[38;5;220m$ api stop\033[0m and then \033[38;5;220m$ api start\033[0m."

  echo -e "\n\033[38;5;34m$ api reset\033[0m\n"

  echo "  Resets Project to Clean Installation State."

  echo -e "\n\033[38;5;34m$ api update\033[0m\n"

  echo -e "  Pulls down latest Git Repo Changes and runs \033[38;5;220m$ api reset\033[0m."

  echo -e "\n\033[38;5;34m$ api migrate\033[0m\n"

  echo "  Updates to latest database schema."

  echo -e "\n\033[38;5;34m$ api seed\033[0m\n"

  echo "  Updates to latest database data."

  echo -e "\n\033[38;5;34m$ api status\033[0m\n"

  echo "  Prints the status of all running services."

  echo -e "\n\033[38;5;34m$ api help\033[0m\n"

  echo "  Prints this help screen."

  echo -e ""
}

api $1 $2

# Show nicer output for when user terminates API via Command Line CTRL + C
if [[ $? -ne 0 ]]; then
  echo ""
  __make_header "CLI Terminated"
fi
