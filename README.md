# PedalScan

**Status: early prototype.** This Expo app photographs a guitar pedal and sends the image to a FastAPI endpoint. The endpoint checks that it received a valid image and returns a demo response. It does **not** yet identify pedals, authenticate models, or calculate prices.

PedalScan is intended to help musicians recognise pedals and, eventually, compare reliable market information. The current repository is an upload flow and starting point for that work.

## Run locally

1. From `guitar_pedal_identifier_app/backend`, create a Python environment, then run `pip install -r requirements.txt` and `uvicorn main:app --reload`.
2. Confirm the API at `http://localhost:8000/health`.
3. From `guitar_pedal_identifier_frontend`, run `npm install` and `npm start`.
4. Set `EXPO_PUBLIC_API_URL` to the URL that the device can reach. `http://localhost:8000` works for a local iOS simulator; a physical phone needs your computer's LAN address. The API and device must be on the same network for local testing.
5. Allow camera access, photograph a pedal, and confirm that the app shows the API's demo response.

## Current scope

- Expo camera capture and image preview.
- Multipart upload to FastAPI with a basic image type, size, and format check.
- A clear response that recognition and pricing are not implemented.

## Next milestones

1. Collect a small, permission-cleared set of labelled pedal photos and define an evaluation split.
2. Add a baseline model or explicit visual matching approach and report its accuracy, including an “unknown” result.
3. Add version and condition checks before any price estimate; cite the source and date of market data.
4. Run the API contract tests below and add device integration tests, then tighten CORS and deployment configuration.

The original product and business concept can be developed separately from this prototype. No payment or marketplace feature is present.

## API contract tests

From `guitar_pedal_identifier_app/backend`, install `requirements.txt` and run `python -m pytest test_main.py -q`. The tests cover a valid image, malformed and wrong-type uploads, the 8 MB bound, and the demo response contract. The API also limits decoded image dimensions to 20 megapixels. These tests do not establish camera compatibility on a physical device or recognition accuracy.

## API contract tests

From `guitar_pedal_identifier_app/backend`, install `test-requirements.txt` and run `python -m pytest test_main.py -q`. The tests cover a valid image, malformed and wrong-type uploads, the 8 MB bound, and the demo response contract. The API also limits decoded image dimensions to 20 megapixels. These tests do not establish camera compatibility on a physical device or recognition accuracy.
