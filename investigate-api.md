# Meckano API Investigation Plan

## Current Status: UI Automation Working ✅
- Login selectors fixed
- Timesheet filling functional
- But slow and brittle

## API Investigation Strategy

### 1. Network Traffic Analysis
Use browser dev tools to capture API calls during manual timesheet filling:

```bash
# Run test in headed mode and monitor network tab
npm run test:headed
```

**Look for:**
- Login API endpoints (authentication)
- Timesheet data retrieval endpoints
- Time entry submission endpoints
- Session/token management

### 2. Common API Patterns to Check
- `POST /api/login` or `/api/auth`
- `GET /api/timesheet` or `/api/monthly-report`
- `POST /api/time-entry` or `/api/submit-hours`
- `GET /api/user/profile`

### 3. Expected Benefits
- **Speed**: 10-100x faster than UI automation
- **Reliability**: No UI selector breakage
- **Batch operations**: Submit multiple entries at once
- **Better error handling**: HTTP status codes vs UI timeouts

### 4. MCP Integration Plan
Once API endpoints are identified:

```typescript
// Example MCP tool for Meckano API
const meckanTools = {
  login: async (email: string, password: string) => {
    // Direct API call instead of UI automation
  },
  getTimesheet: async (month: string, year: string) => {
    // Fetch timesheet data via API
  },
  submitTimeEntry: async (date: string, entrance: string, exit: string) => {
    // Submit time entry via API
  }
};
```

### 5. Fallback Strategy
- Keep UI automation as backup
- Hybrid approach: API for data, UI for edge cases
- Gradual migration from UI to API

## Next Steps
1. ✅ UI automation working (current state)
2. 🔍 Investigate API endpoints (next)
3. 🛠️ Build MCP tools for discovered APIs
4. 🧪 Test API-based approach
5. 🚀 Replace UI automation with API calls
