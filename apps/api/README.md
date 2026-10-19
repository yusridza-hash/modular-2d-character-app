# API Foundation

This is a health/capability scaffold, not a character segmentation API. No routes modify project data yet.

From `apps/api` run:
```bash
python -m pip install -r requirements-dev.txt
uvicorn main:app --reload --port 8000
pytest -q
```

Character Engine (Phase 1–4) integrations must be implemented through versioned schemas and routes without direct import into the React editor. Production CORS/auth/limits not yet implemented.
