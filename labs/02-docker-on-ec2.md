# Lab Part 2 — Set up Docker on EC2

Docker Engine runs containers on your Ubuntu server. Docker Compose starts and manages the services that make up your MERN app.

## 1. Reconnect to EC2

Start AWS Academy Learner Lab. In **EC2 → Instances** in **US East (N. Virginia)**, start your instance if it is stopped. Wait for its status checks to pass, then copy its current **Public IPv4 address** from the **Details** tab. Connect from VS Code’s Git Bash using the SSH command from [Part 1](01-aws-ec2-setup.md).

Run the remaining commands inside the Ubuntu SSH session.

## 2. Install Docker Engine and Compose

On your fresh Ubuntu 24.04 instance, add Docker’s package repository.

```bash
sudo apt update
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

sudo tee /etc/apt/sources.list.d/docker.sources >/dev/null <<'EOF'
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: noble
Components: stable
Architectures: amd64
Signed-By: /etc/apt/keyrings/docker.asc
EOF
```

Install Docker and start the service.

```bash
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
```

## 3. Verify the installation

```bash
sudo systemctl is-active docker
sudo docker compose version
sudo docker run --rm hello-world
```

**Checkpoint:** The service reports `active`, Compose prints its version, and the container prints `Hello from Docker!`. The test container exits automatically.

Use `sudo docker` and `sudo docker compose` on this server. If Docker reports that it cannot connect to the daemon, check `sudo systemctl status docker`.

## 4. Get the instructor’s Dockerized MERN app

Download the ZIP from the `docker-compose-ci` branch and use its contents to set up a new repository.

[Instructor repository](https://github.com/chakirouAlabani/lab-nov-04)

[Docker Engine installation on Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
