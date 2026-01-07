# The Pulse System

A simple, zero-cost management accountability system built on Google Sheets with a shareable web form.

## What It Does

The Pulse System replaces email-based weekly reporting with a structured, visual accountability framework:

- **Monday Promise**: Team members submit their 3 priorities for the week
- **Friday Proof**: Team members report on what they accomplished (DONE/PARTIAL/MISSED)
- **Scoreboard**: Visual traffic-light tracking of strategic goals

## Quick Setup (5 minutes)

### Step 1: Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new blank spreadsheet
2. Name it "Pulse System" or similar

### Step 2: Add the Apps Script

1. In your new spreadsheet, go to **Extensions > Apps Script**
2. Delete any existing code in the editor
3. Copy the entire contents of `Code.gs` and paste it into the editor
4. Click the **+** next to "Files" and select **HTML**
5. Name the file `Index` (it will become `Index.html`)
6. Copy the entire contents of `Index.html` and paste it into the new file
7. Save the project (Ctrl+S or Cmd+S)

### Step 3: Run Initial Setup

1. In the Apps Script editor, select `setupPulseSystem` from the function dropdown
2. Click **Run**
3. You'll be prompted to authorize the script - click through the permissions
4. The script will create all the necessary sheets in your spreadsheet

### Step 4: Configure Your Settings

1. Go back to your spreadsheet
2. Navigate to the **Settings** tab
3. Update the team member names (Column A, starting row 5)
4. Update the strategic goals (Column C, starting row 5)

Alternatively, edit the `CONFIG` object at the top of `Code.gs`:

```javascript
const CONFIG = {
  COMPANY_NAME: "Your Company Name",
  CURRENT_QUARTER: "Q1 2025",
  NOTIFICATION_EMAIL: "manager@company.com", // Optional
  STRATEGIC_GOALS: [
    { id: 1, name: "Generate $500k in new sales", owner: "Sales Lead" },
    { id: 2, name: "Launch new website", owner: "Marketing Lead" },
    { id: 3, name: "Hire 3 engineers", owner: "HR Lead" }
  ],
  TEAM_MEMBERS: [
    "Alice Smith",
    "Bob Johnson",
    "Carol Williams"
  ]
};
```

### Step 5: Deploy as Web App

1. In Apps Script, click **Deploy > New deployment**
2. Click the gear icon and select **Web app**
3. Configure:
   - **Description**: "Pulse System v1"
   - **Execute as**: Me
   - **Who has access**: Anyone (or "Anyone with a Google account" for more security)
4. Click **Deploy**
5. Copy the **Web app URL** - this is what you share with your team!

## Usage

### For Team Members

Share the Web App URL with your team. They'll see a clean form with three tabs:

1. **Monday Promise** - Submit weekly priorities by Monday 10 AM
2. **Friday Proof** - Report on accomplishments by Friday 5 PM
3. **Update Scoreboard** - Goal owners update the traffic light status

### For Managers

The Google Sheet contains several tabs:

| Tab | Purpose |
|-----|---------|
| Scoreboard | Visual traffic-light view of strategic goals by week |
| Monday Promises | All submitted Monday priorities |
| Friday Proof | All submitted Friday results |
| Q Strategy | Your quarterly strategy document |
| Settings | Team members and goals configuration |

### Weekly Workflow

**Monday Morning (Before 10 AM)**
1. Team opens the web form
2. Selects their name
3. Enters 3 priorities (Priority 1 must link to a strategic goal)
4. Submits

**Friday Afternoon (Before 5 PM)**
1. Team opens the web form, clicks "Friday Proof"
2. Marks each priority as DONE/PARTIAL/MISSED
3. Provides proof links or explanations
4. Notes any blockers
5. Submits recovery plan if needed

**Weekly Meeting**
- Don't ask "what are you doing?" - you already know from the submissions
- Ask: "Who is blocked? Who needs help?"

## Sheets Overview

### Scoreboard
Visual grid showing strategic goals (rows) vs weeks (columns). Each cell is a traffic light:
- Green: On track
- Yellow: At risk, but have a plan
- Red: Off track, need help

### Monday Promises
| Column | Description |
|--------|-------------|
| Timestamp | When submitted |
| Week | Week number |
| Name | Team member |
| Priority 1 | Strategic priority |
| Linked Goal | Which strategic goal it supports |
| Priority 2 | Operational priority |
| Priority 3 | Team/Admin priority |
| Notes | Optional notes |
| Status | Submission status |

### Friday Proof
| Column | Description |
|--------|-------------|
| Timestamp | When submitted |
| Week | Week number |
| Name | Team member |
| Priority 1-3 Status | DONE/PARTIAL/MISSED |
| Priority 1-3 Proof | Links or explanations |
| Blockers | What got in the way |
| Recovery Plan | How to catch up |

## Tips

1. **Enforce the Monday deadline**: If Priority 1 doesn't align with strategy, reply immediately: "Wrong priority. Re-align with Q Strategy."

2. **Keep meetings focused**: The "Exception Only" meeting format means you only discuss blockers, not status updates.

3. **Use the visual pressure**: No one wants to put a red dot on the scoreboard. This creates healthy accountability.

4. **Update quarterly**: At the start of each quarter, update the strategic goals in Settings.

## Troubleshooting

**"Authorization required" error**
- Make sure you've run the setup function and approved permissions

**Form not loading**
- Check that both `Code.gs` and `Index.html` are saved
- Redeploy the web app

**Submissions not appearing**
- Verify the sheet names match exactly
- Check the Apps Script execution log for errors

**Team members not in dropdown**
- Update the Settings sheet, Column A (rows 5+)
- Or update the `TEAM_MEMBERS` array in `Code.gs`

## Customization

### Email Notifications
Set `NOTIFICATION_EMAIL` in the CONFIG to receive emails when submissions are made.

### Custom Styling
Edit the `<style>` section in `Index.html` to match your brand colors.

### Additional Fields
Add fields by:
1. Adding HTML inputs in `Index.html`
2. Updating the submit functions in `Code.gs`
3. Adding columns to the relevant sheet

## License

Free to use and modify for your organization.
