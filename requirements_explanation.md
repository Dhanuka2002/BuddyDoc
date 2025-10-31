# requirements_explanation.md

This is a beginner-friendly guide explaining what a Python `requirements.txt` file is, why it's useful, and how to use it on Windows (PowerShell).

## What is `requirements.txt`?

`requirements.txt` is a plain text file that lists the Python packages your project needs. Each line names a package and (optionally) a specific version, for example:

```
fastapi==0.95.2
uvicorn[standard]==0.23.1
python-dotenv==1.0.0
```

By pinning versions (using `==`), you ensure everyone running the project uses the same package versions — this helps avoid "it works on my machine" problems.

## What the example packages do

- `fastapi` — a modern web framework for building APIs in Python. It's fast and easy to use.
- `uvicorn[standard]` — an ASGI server that runs the FastAPI app. The `[standard]` extra installs recommended performance packages.
- `python-dotenv` — loads environment variables from a `.env` file (useful for development and secrets).

> Note: Your copy of `requirements.txt` may differ. Check the file in the `backend-python` folder for the exact entries used in this project.

## How to use `requirements.txt` (PowerShell)

1. Open PowerShell and go to the backend folder:

```powershell
cd "C:\Users\LOQ\Desktop\BuddyDoc\BuddyDoc\backend-python"
```

2. Create a virtual environment (recommended so packages are isolated to this project):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

3. Upgrade pip and install the packages from the file:

```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

4. Run the FastAPI app (example using uvicorn):

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 3333
```

- `--reload` makes the server restart automatically when you change code (useful during development).
- Open http://127.0.0.1:3333/docs to see automatic API documentation provided by FastAPI.

## Best practices (short and practical)

- Always use a virtual environment for each project.
- Pin versions in `requirements.txt` for reproducible installs.
- Use `pip freeze > requirements.txt` to regenerate the file after adding or updating packages.
- Consider splitting dev and production dependencies (e.g., `requirements-dev.txt`).
- Don't commit secrets to the repository — use a `.env` file and add it to `.gitignore`.
- For more advanced dependency management, look into `pip-tools` (pip-compile) or `Poetry`.

## How to add a package

While the virtual environment is active:

```powershell
pip install requests
pip freeze > requirements.txt
```

This installs `requests` and updates `requirements.txt` to include the exact installed versions.

## Troubleshooting common issues

- "Command not found" for `uvicorn` or `fastapi`: make sure your virtual environment is activated and that `pip install -r requirements.txt` completed successfully.
- If a package import fails in the editor (red squiggles), the editor may not be using the virtual environment's Python interpreter — configure your editor to use `.venv`'s Python.

## Next steps I can help with

- Recreate or restore `requirements.txt` in the repo if it's missing.
- Add a `requirements-dev.txt` with developer tools (linters, test frameworks).
- Migrate to Poetry or add `Makefile` / PowerShell script to automate setup.

If you want any of those, tell me which and I'll add it to the repository.
