# AI Agriculture Portal

This project contains a Next.js (TypeScript) frontend and a Python FastAPI backend.

## Prerequisites
- Node.js installed (for the Next.js frontend)
- Python 3+ installed (for the FastAPI backend)

## Installation Steps

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the node modules:
   ```bash
   npm install
   ```

### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Activate the Python virtual environment:
   - On Windows:
     ```bash
     .\venv\Scripts\activate
     ```
   - On Mac/Linux:
     ```bash
     source venv/bin/activate
     ```
3. Install the Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Initiation / Runtime Steps

### Frontend
1. Open a terminal and navigate to the `frontend` directory.
2. Run the development server:
   ```bash
   npm run dev
   ```
3. The application will be accessible at [http://localhost:3000](http://localhost:3000).

### Backend
1. Open a separate terminal and navigate to the `backend` directory.
2. Activate your virtual environment (see installation step 2).
3. Start the FastAPI server using the provided entry script:
   ```bash
   python main.py
   ```
4. The backend will be running at [http://localhost:8000](http://localhost:8000), and auto-generated API documentation is available at [http://localhost:8000/docs](http://localhost:8000/docs).