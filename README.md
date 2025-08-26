
# Tracker Snippet

A lightweight **TypeScript-based tracking snippet** for collecting user sessions and page views.  
It can be included in any website to automatically send user activity events to a backend analytics service.

The snippet can be installed via npm or included directly via CDN.

---

## Features

- Automatically generates a **visitorId** using `crypto.randomUUID()`.
- Sends **page load events** to `/tracking`.
- Automatically sends **user activity pings** to `/ping` with a 5-minute interval between pings.
- Easy integration via **npm** or **CDN**.
- Built with **TypeScript** and **Rollup**.
- Unit-tested with **Jest**.

---

## Installation

### Using npm

    npm install tracker-snippet

### Using CDN

Add this to your HTML:

    <script src="https://cdn.jsdelivr.net/npm/tracker-snippet@latest/dist/tracker.js"></script>

---

## Usage

Simply import or include the snippet in your site.  
By default, it sends data to:

    const url = "http://localhost:3000/tracking";

It automatically:  
- Creates the `visitorId` cookie if missing.  
- Sends the initial page load event.  
- Sends `/ping` events on user activity every 5 minutes.  

No manual calls are required.

---

## Development

Clone the repository and install dependencies:

    git clone <repo-url>
    cd yomali-challenge-snippet
    npm install

### Build

    npm run build

This will generate a production-ready `dist/tracker.js` bundle.

### Testing

Run unit tests with Jest:

    npm run test

You can also test the snippet by including it in a local HTML page and verifying it sends events to your backend.

### Publishing (npm)

    npm run pub

This will build the snippet and publish it to npm.

---

## Integration Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Test Page</title>
</head>
<body>
  <h1>Test</h1>

  <!-- Include tracker snippet -->
  <script src="https://cdn.jsdelivr.net/npm/tracker-snippet@latest/dist/tracker.js"></script>
</body>
</html>
```

Or, in a JavaScript project:

    import 'tracker-snippet';

---

## Tech Stack

- TypeScript
- Rollup (bundle for browser)
- Jest (unit testing)
- npm / CDN distribution

---

## Notes

- This snippet is part of the **Yomali technical assessment**.
- Designed for **automatic tracking**: no configuration is required beyond setting the backend URL.  
- Easy to include in any website or single-page application.

## Related Repositories
- [Backend (NestJS Tracking Server)](https://github.com/lucaslosekann/yomali-challenge-backend/)
- [Frontend (React Analytics Dashboard)](https://github.com/lucaslosekann/yomali-challenge-frontend/)
