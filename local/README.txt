WADE PRESTON — LOCAL SELF-CONTAINED WEBSITE
==========================================

This version runs entirely on your computer. No Base44, no internet, no
external services. Your events are stored in a local SQLite database file
(events.sqlite) that is created automatically on first run.

────────────────────────────────────────────
HOW TO RUN IT (one-time setup)
────────────────────────────────────────────

1. Install Node.js (version 18 or newer) from https://nodejs.org if you don't have it.

2. Open a terminal (Command Prompt / Terminal) in this "local" folder.

3. Install the dependencies (only needed once):
       npm install

4. Start the website:
       npm start

5. Open your browser to:
       http://localhost:3000

That's it. Leave the terminal window open while you show the site.
To stop it, press Ctrl + C in the terminal.

────────────────────────────────────────────
ADMIN DASHBOARD
────────────────────────────────────────────

Go to http://localhost:3000#/admin  (or click "Admin" in the footer).

Default login:
    Username:  admin
    Password:  wadepreston

You can change these by setting environment variables before starting:
    On Mac/Linux:   ADMIN_USERNAME=myname ADMIN_PASSWORD=mypass npm start
    On Windows:     set ADMIN_USERNAME=myname && set ADMIN_PASSWORD=mypass && npm start

In the dashboard you can add, edit, and delete events. Changes are saved
to the local events.sqlite file and appear on the public site immediately.

────────────────────────────────────────────
YOUR DATA
────────────────────────────────────────────

All events live in the file  events.sqlite  inside this folder.
Your existing events have already been copied in as starting data.
You can back up the site at any time by copying this one file.

────────────────────────────────────────────
IMAGES
────────────────────────────────────────────

The photos currently load from the web (the same image URLs as the live
site). If you want the site to work fully offline with no external
resources, download the photos into this folder and update the image
paths at the top of  public/app.js  (the IMG block).