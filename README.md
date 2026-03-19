# Notes

This project is part of my Full Stack Open exercises.

Application link: https://notes-backend-lhsb.onrender.com/

## What This App Does

Notes is a full-stack app where users can:

- View all notes
- Add a new note
- Mark notes as important or not important
- Filter the list to show only important notes

## Project Structure

- `notes-frontend` (React + Vite): UI for listing, creating, filtering, and toggling note importance.
- `notes-backend` (Node.js + Express + MongoDB): REST API for notes with validation and error handling.

## Run Locally

1. Install dependencies in both folders:
   - `notes-backend`: `npm install`
   - `notes-frontend`: `npm install`
2. Add environment variables in `notes-backend/.env`:
   - `MONGODB_URI=...`
   - `PORT=3001`
3. Start backend from `notes-backend`:
   - `npm run dev`
4. Start frontend from `notes-frontend`:
   - `npm run dev`

The frontend calls the backend through `/api/notes`.
