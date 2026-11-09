# Lab 03 — Publish Docker images to GHCR

GitHub Container Registry (GHCR) stores Docker images at `ghcr.io`. In this lab, GitHub Actions will publish the frontend and backend images after CI passes.

## 1. Start with your copy of the app

Use the new GitHub repository you created from the instructor’s ZIP in [Lab 02](02-docker-on-ec2.md). Open `.github/workflows/ci.yml`. Under `on.push.branches`, keep only your repository’s default branch, usually `main`.

Keep the existing `checks` job. It installs dependencies, checks the frontend, validates Compose, and builds both images.

## 2. Add the publishing job

Under `jobs:`, add `publish` at the same indentation as `checks`. It runs only after `checks` succeeds. The publishing job builds the two images on its own runner and tags both with the full commit SHA.

```yaml
  publish:
    needs: checks
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v6

      - name: Sign in to GHCR and publish both images
        env:
          GHCR_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          printf '%s' "$GHCR_TOKEN" | docker login ghcr.io -u "$GITHUB_ACTOR" --password-stdin
          image_prefix="ghcr.io/${GITHUB_REPOSITORY,,}"
          frontend_image="$image_prefix-frontend:$GITHUB_SHA"
          backend_image="$image_prefix-backend:$GITHUB_SHA"

          docker build -t "$frontend_image" ./frontend
          docker build -t "$backend_image" ./backend
          docker push "$frontend_image"
          docker push "$backend_image"
```

GitHub provides `GITHUB_TOKEN` to the workflow. The `packages: write` permission lets this job publish images. Keep the packages private for this lab.

## 3. Verify the images

Commit and push your workflow change to your default branch. In **GitHub → Actions**, open the run for that commit. Confirm that both `checks` and `publish` passed.

From your GitHub profile or organization, open **Packages**. Find the frontend and backend packages and check that both have the same full commit SHA as their tag.

**Checkpoint:** Record both full image references. For example, the frontend reference looks like `ghcr.io/your-user/your-repo-frontend:FULL_COMMIT_SHA`. You’ll use these references when deploying to EC2.

[GitHub Actions and Docker images](https://docs.github.com/en/actions/tutorials/publish-packages/publish-docker-images) · [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
