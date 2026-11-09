# Lab Part 1 — Set up and connect to an EC2 instance

Amazon Elastic Compute Cloud (EC2) lets you rent virtual computers in AWS. In this lab, you’ll launch an Ubuntu instance and connect to it over SSH from VS Code.

## 1. Start AWS Academy Learner Lab

1. Sign in to [AWS Academy](https://awsacademy.instructure.com/) with your course account.
2. Open your **AWS Academy Learner Lab** course. Go to **Modules** and open **Learner Lab**.
3. Click **Start Lab**. Wait for the indicator beside **AWS** to turn green, then click **AWS** to open the console.
4. Select **US East (N. Virginia)** (`us-east-1`) in the region selector. Search for **EC2** and open it.

**Checkpoint:** The EC2 console shows `us-east-1`.

## 2. Launch the instance

In EC2, choose **Instances → Launch instances**. Use these settings.

| Setting | Value |
| --- | --- |
| Name | `twa2-mern` |
| Image (AMI) | Canonical **Ubuntu Server 24.04 LTS**, **64-bit (x86)** |
| Instance type | `t3.micro` |
| Key pair | **Create new key pair** → `twa2-ec2` → **RSA** → **.pem** |
| Network | Default VPC and subnet. Set **Auto-assign public IP** to **Enable**. |
| Storage | One **8 GiB gp3** root volume |

Save the downloaded `twa2-ec2.pem` outside the repository, for example in your Windows user folder under `.ssh`. Keep it private and out of Git.

Under **Network settings → Edit**, create a security group with these inbound rules.

| Type | Port | Source |
| --- | --- | --- |
| SSH | TCP 22 | **My IP** (your public IPv4 address with `/32`) |
| HTTP | TCP 80 | **Anywhere-IPv4** (`0.0.0.0/0`) |

Click **Launch instance**, then **View all instances**. Select `twa2-mern`. Wait for **Running** and **2/2 checks passed** or **3/3** if the console includes the attached EBS check. Copy the **Public IPv4 address** from the instance details.

**Checkpoint:** The instance is running, all displayed checks passed, and it has a public IPv4 address.

## 3. Connect from VS Code

Open the project in VS Code. Choose **Terminal → New Terminal**, then select **Git Bash** from the terminal profile menu.

Replace `YOUR_KEY_FILE.pem` with your downloaded key’s filename. Adjust the key path if you saved it in a different folder.

In the AWS console, go to **EC2 → Instances**, select `twa2-mern`, and open the **Details** tab. Copy the **Public IPv4 address** and paste it in place of `YOUR_PUBLIC_IPV4`. For example, if your instance shows `203.0.113.10`, the line becomes `HOST="203.0.113.10"`.

```bash
KEY="$HOME/.ssh/YOUR_KEY_FILE.pem"
HOST="YOUR_PUBLIC_IPV4"
chmod 400 "$KEY"
ssh -i "$KEY" "ubuntu@$HOST"
```

On your first connection, SSH may ask you to confirm the host fingerprint. Compare it with the instance’s SSH host fingerprint in **Actions → Monitor and troubleshoot → Get system log**, then type `yes` if it matches.

### If SSH fails

- **Unprotected private key file / bad permissions** — In Windows File Explorer, right-click the `.pem` file and open **Properties → Security → Advanced**. Choose **Disable inheritance**, then **Remove all inherited permissions**. Add your Windows account with **Read** access if needed and remove any remaining permission entries for other accounts. Apply the changes and rerun the `ssh` command in Git Bash.
- **Connection timed out** — Check that the instance is running, that you’re using its current public IPv4 address, and that the SSH rule still matches your current public IP.
- **Permission denied (publickey)** — Use the `ubuntu` username and the private key for the key pair selected when you launched this instance.

## 4. Verify the remote session

Run these commands in the SSH session.

```bash
whoami
cat /etc/os-release
uname -m
```

**Checkpoint:** The output shows `ubuntu`, Ubuntu **24.04 LTS**, and `x86_64`.

## 5. Finish the lab

1. Run `exit` to close the SSH session.
2. In **EC2 → Instances**, select your instance and choose **Instance state → Stop instance** so you can reuse it in the next lab. Compute charges stop, but EBS storage can still use your lab budget. After restarting, copy the public IPv4 address again.
3. If you’re finished with the instance permanently, choose **Terminate (delete) instance** instead. Termination is permanent and deletes the root disk when **Delete on termination** is enabled.
4. Confirm the instance reaches **Stopped** or **Terminated**. Return to Learner Lab, check the budget indicator, and choose **End Lab**. The budget display can lag behind actual usage.

[AWS EC2 connection and key permissions](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connection-prereqs-general.html) · [EC2 status checks](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/monitoring-system-instance-status-check.html) · [EC2 instance states](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-lifecycle.html)
