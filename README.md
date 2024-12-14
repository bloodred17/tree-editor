# TreeView: Category Manager

## Installation

```bash
npm install
```

## Development Server
### Backend
```bash
npm run serve:store
```

### Frontend
```bash
npm run serve:manager
```

## Production Build
### Backend
```bash
npm run build:store
```
### Frontend
```bash
npm run build:manager
```

### Start Production Server
```bash
npm run start:store
```

## Environment Variables
Create a `.env` file in the root of the project and add the following variables:

```dotenv
MONGODB_ENDPOINT=mongodb://localhost:27017/
```
