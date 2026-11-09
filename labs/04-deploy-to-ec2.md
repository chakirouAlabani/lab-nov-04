# Lab 04 — Deploy to EC2 with GitHub Actions

Extend the workflow from [Lab 03](03-publish-to-ghcr.md). A push to your default branch will run CI, publish two images to GHCR, and deploy those images to EC2.

## 1. Connect a runner to your repository

Use your own **private GitHub repository** and your dedicated Learner Lab EC2 instance. A self-hosted runner executes workflow commands directly on the instance.

1. Start the EC2 instance and connect over SSH as `ubuntu`. Confirm `sudo -n docker compose version` works.
2. In your GitHub repository, open **Settings → Actions → Runners → New self-hosted runner**. Select **Linux** and **x64**.
3. In your EC2 SSH session, run GitHub’s download and configuration commands. Run the configuration command as `ubuntu`. When asked for additional labels, enter `ec2-deploy`.
4. From the runner directory, install and start the service. If you already started `./run.sh`, stop it with **Ctrl+C** first.

```bash
sudo ./svc.sh install ubuntu
sudo ./svc.sh start
```

**Checkpoint:** GitHub lists the runner as **Idle** with the `ec2-deploy` label. The runner connects out to GitHub, so keep SSH restricted to **My IP**. Set the HTTP rule to **My IP** too, since the demo dashboard allows visitors to edit records.

## 2. Create the deployment Compose file

Copy `compose.yaml` to `compose.deploy.yaml` in your repository.

- Under `frontend`, replace `build: ./frontend` with `image: "${FRONTEND_IMAGE:?Set FRONTEND_IMAGE}"` and set its published port to `"80:80"`.
- Under `backend`, replace `build: ./backend` with `image: "${BACKEND_IMAGE:?Set BACKEND_IMAGE}"`.
- Keep the service names, health checks, MongoDB connection, and `mongo-data` volume.

## 3. Add the deploy job

In `.github/workflows/ci.yml`, add this job under `jobs:` at the same indentation as `checks` and `publish`. Keep the workflow trigger on pushes to your default branch.

```yaml
  deploy:
    needs: publish
    runs-on: [self-hosted, linux, x64, ec2-deploy]
    timeout-minutes: 10
    permissions:
      contents: read
      packages: read
    steps:
      - uses: actions/checkout@v6
        with:
          persist-credentials: false

      - name: Deploy the published images
        env:
          GHCR_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          set -euo pipefail
          image_prefix="ghcr.io/${GITHUB_REPOSITORY,,}"
          deploy_dir="$HOME/mern-deploy"
          mkdir -p "$deploy_dir"
          cp compose.deploy.yaml "$deploy_dir/"
          cd "$deploy_dir"

          printf 'FRONTEND_IMAGE=%s-frontend:%s\nBACKEND_IMAGE=%s-backend:%s\n' \
            "$image_prefix" "$GITHUB_SHA" "$image_prefix" "$GITHUB_SHA" > .env

          docker_config="$(mktemp -d)"
          trap 'sudo -n rm -rf -- "$docker_config"' EXIT
          printf '%s' "$GHCR_TOKEN" | sudo -n docker --config "$docker_config" \
            login ghcr.io -u "$GITHUB_ACTOR" --password-stdin

          sudo -n docker --config "$docker_config" compose -f compose.deploy.yaml \
            up -d --pull always --wait --wait-timeout 120
          curl --fail --silent --show-error --retry 5 --retry-all-errors http://localhost/api/
```

The deploy job uses the same commit SHA as the publishing job. Its GitHub token can read the private packages published by this repository. 

## 4. Verify the first deployment and an update

1. Commit both files and push to your default branch. In **Actions**, confirm that `checks`, `publish`, and `deploy` pass. The deploy log should show `API running`.
2. Open `http://YOUR_PUBLIC_IPV4` from your computer using the address in the EC2 **Details** tab.
3. In your EC2 SSH session, seed the database once. Check that the browser displays users, products, and orders.

   ```bash
   cd ~/mern-deploy
   sudo docker compose -f compose.deploy.yaml exec backend npm run seed
   ```

4. Edit a sample record in the browser. Push a small visible frontend change and wait for the new workflow run to succeed. Refresh the dashboard and confirm that the change is live and the edited record is still there.

## Troubleshooting

- **Deploy is queued:** Check that EC2 is running, the runner is **Idle**, and the job and runner share the `ec2-deploy` label.
- **GHCR access denied:** Check that both packages grant Actions access to your repository and that the deploy job has `packages: read`.
- **The app doesn’t load:** In SSH, go to `~/mern-deploy` and run `sudo docker compose -f compose.deploy.yaml ps`, `sudo docker compose -f compose.deploy.yaml logs --tail=50`, and `curl -fsS http://localhost/api/`. If the API responds on EC2, check the browser’s IP address against the EC2 HTTP rule and verify the instance’s current public address.

Stop the instance and end your Learner Lab session when you finish. Start the instance before your next deployment so the runner can accept the job.

