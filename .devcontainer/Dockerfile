FROM node:18

# Install basic development tools
RUN apt update && apt install -y less man-db sudo git nginx tree zsh

# Ensure default `node` user has access to `sudo`
ARG USERNAME=node
RUN echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# Install ZSH
USER $USERNAME
RUN sh -c "$(curl -L https://github.com/deluan/zsh-in-docker/releases/download/v1.1.5/zsh-in-docker.sh)" -- \
    -x -t robbyrussell -p git -p yarn \
    -p https://github.com/zsh-users/zsh-autosuggestions -p https://github.com/zsh-users/zsh-completions && \
    chsh $(which zsh)

# Set `DEVCONTAINER` environment variable to help with orientation
ENV DEVCONTAINER=true
