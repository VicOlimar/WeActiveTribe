FROM gitpod/workspace-postgres
USER gitpod

RUN sudo apt-get install -y python2

RUN bash -c 'VERSION="10.18.0" \
    && source $HOME/.nvm/nvm.sh && nvm install $VERSION \
    && nvm use $VERSION && nvm alias default $VERSION'

RUN echo "nvm use default &>/dev/null" >> ~/.bashrc.d/51-nvm-fix

