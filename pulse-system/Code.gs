/**
 * THE PULSE SYSTEM - Google Apps Script
 * A simple management accountability system
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code and paste this entire file
 * 4. Save the project (Ctrl+S)
 * 5. Run the 'setupPulseSystem' function once to create all sheets
 * 6. Deploy as Web App: Deploy > New deployment > Web app
 *    - Execute as: Me
 *    - Who has access: Anyone (or Anyone with link)
 * 7. Copy the Web App URL and share with your team
 */

// ============================================
// CONFIGURATION - Edit these values
// ============================================
const CONFIG = {
  // Your company/team name
  COMPANY_NAME: "My Company",

  // Quarter info (update each quarter)
  CURRENT_QUARTER: "Q1 2025",

  // Email to receive notifications (optional)
  NOTIFICATION_EMAIL: "",

  // Your strategic goals (update each quarter)
  STRATEGIC_GOALS: [
    { id: 1, name: "Goal 1: [Your Main Strategic Goal]", owner: "[Owner Name]" },
    { id: 2, name: "Goal 2: [Your Second Strategic Goal]", owner: "[Owner Name]" },
    { id: 3, name: "Goal 3: [Your Third Strategic Goal]", owner: "[Owner Name]" }
  ],

  // Team members who submit weekly updates
  TEAM_MEMBERS: [
    "Team Member 1",
    "Team Member 2",
    "Team Member 3",
    "Team Member 4",
    "Team Member 5"
  ]
};

// ============================================
// SHEET NAMES
// ============================================
const SHEETS = {
  SCOREBOARD: "📊 Scoreboard",
  MONDAY_PROMISES: "📝 Monday Promises",
  FRIDAY_PROOF: "✅ Friday Proof",
  STRATEGY: "🎯 Q Strategy",
  SETTINGS: "⚙️ Settings"
};

// ============================================
// INITIAL SETUP FUNCTION - Run this once
// ============================================
function setupPulseSystem() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Create all required sheets
  createScoreboardSheet(ss);
  createMondayPromisesSheet(ss);
  createFridayProofSheet(ss);
  createStrategySheet(ss);
  createSettingsSheet(ss);

  // Set up the menu
  createMenu();

  SpreadsheetApp.getUi().alert(
    '✅ Pulse System Setup Complete!\n\n' +
    'Next steps:\n' +
    '1. Update the Strategy sheet with your goals\n' +
    '2. Update Settings with team members\n' +
    '3. Deploy as Web App (Deploy > New deployment)\n' +
    '4. Share the Web App URL with your team'
  );
}

// ============================================
// CREATE SHEETS
// ============================================
function createScoreboardSheet(ss) {
  let sheet = ss.getSheetByName(SHEETS.SCOREBOARD);
  if (!sheet) {
    sheet = ss.insertSheet(SHEETS.SCOREBOARD);
  }
  sheet.clear();

  // Headers
  const headers = ["Strategic Goal", "Owner"];
  for (let i = 1; i <= 13; i++) {
    headers.push("Week " + i);
  }

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setBackground("#1a73e8")
    .setFontColor("white")
    .setFontWeight("bold");

  // Add strategic goals
  const goals = CONFIG.STRATEGIC_GOALS;
  for (let i = 0; i < goals.length; i++) {
    sheet.getRange(i + 2, 1).setValue(goals[i].name);
    sheet.getRange(i + 2, 2).setValue(goals[i].owner);
  }

  // Add legend
  sheet.getRange(goals.length + 4, 1).setValue("LEGEND:");
  sheet.getRange(goals.length + 5, 1).setValue("🟢 Green = On Track");
  sheet.getRange(goals.length + 6, 1).setValue("🟡 Yellow = At Risk (have a plan)");
  sheet.getRange(goals.length + 7, 1).setValue("🔴 Red = Off Track (need help)");

  // Data validation for traffic lights
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["🟢", "🟡", "🔴", ""], true)
    .build();
  sheet.getRange(2, 3, goals.length, 13).setDataValidation(rule);

  // Formatting
  sheet.setColumnWidth(1, 300);
  sheet.setColumnWidth(2, 150);
  for (let i = 3; i <= 15; i++) {
    sheet.setColumnWidth(i, 70);
  }

  sheet.getRange(2, 3, goals.length, 13).setHorizontalAlignment("center");
}

function createMondayPromisesSheet(ss) {
  let sheet = ss.getSheetByName(SHEETS.MONDAY_PROMISES);
  if (!sheet) {
    sheet = ss.insertSheet(SHEETS.MONDAY_PROMISES);
  }
  sheet.clear();

  const headers = [
    "Timestamp",
    "Week",
    "Name",
    "Priority 1 (Strategic)",
    "Linked Goal",
    "Priority 2 (Operational)",
    "Priority 3 (Team/Admin)",
    "Notes",
    "Status"
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setBackground("#34a853")
    .setFontColor("white")
    .setFontWeight("bold");

  // Formatting
  sheet.setColumnWidth(1, 150);
  sheet.setColumnWidth(2, 80);
  sheet.setColumnWidth(3, 120);
  sheet.setColumnWidth(4, 300);
  sheet.setColumnWidth(5, 150);
  sheet.setColumnWidth(6, 300);
  sheet.setColumnWidth(7, 300);
  sheet.setColumnWidth(8, 200);
  sheet.setColumnWidth(9, 100);

  sheet.setFrozenRows(1);
}

function createFridayProofSheet(ss) {
  let sheet = ss.getSheetByName(SHEETS.FRIDAY_PROOF);
  if (!sheet) {
    sheet = ss.insertSheet(SHEETS.FRIDAY_PROOF);
  }
  sheet.clear();

  const headers = [
    "Timestamp",
    "Week",
    "Name",
    "Priority 1 Status",
    "Priority 1 Proof/Notes",
    "Priority 2 Status",
    "Priority 2 Proof/Notes",
    "Priority 3 Status",
    "Priority 3 Proof/Notes",
    "Blockers/Issues",
    "Recovery Plan (if needed)"
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setBackground("#ea4335")
    .setFontColor("white")
    .setFontWeight("bold");

  // Formatting
  sheet.setColumnWidth(1, 150);
  sheet.setColumnWidth(2, 80);
  sheet.setColumnWidth(3, 120);
  sheet.setColumnWidth(4, 100);
  sheet.setColumnWidth(5, 250);
  sheet.setColumnWidth(6, 100);
  sheet.setColumnWidth(7, 250);
  sheet.setColumnWidth(8, 100);
  sheet.setColumnWidth(9, 250);
  sheet.setColumnWidth(10, 250);
  sheet.setColumnWidth(11, 250);

  sheet.setFrozenRows(1);
}

function createStrategySheet(ss) {
  let sheet = ss.getSheetByName(SHEETS.STRATEGY);
  if (!sheet) {
    sheet = ss.insertSheet(SHEETS.STRATEGY);
  }
  sheet.clear();

  // Title
  sheet.getRange("A1").setValue("🎯 " + CONFIG.CURRENT_QUARTER + " STRATEGY - COMMANDER'S INTENT");
  sheet.getRange("A1").setFontSize(18).setFontWeight("bold");

  // Main Objective
  sheet.getRange("A3").setValue("THE MAIN OBJECTIVE");
  sheet.getRange("A3").setFontWeight("bold").setBackground("#f3f3f3");
  sheet.getRange("A4").setValue("[Define your biggest win for the next 90 days]");

  // Key Battles
  sheet.getRange("A6").setValue("THE 3 KEY BATTLES");
  sheet.getRange("A6").setFontWeight("bold").setBackground("#f3f3f3");

  const battles = [
    ["Battle", "Description", "Owner", "Success Metric"],
    ["Battle 1", "[Description]", "[Owner Name]", "[How we measure success]"],
    ["Battle 2", "[Description]", "[Owner Name]", "[How we measure success]"],
    ["Battle 3", "[Description]", "[Owner Name]", "[How we measure success]"]
  ];

  sheet.getRange(7, 1, battles.length, 4).setValues(battles);
  sheet.getRange(7, 1, 1, 4).setFontWeight("bold").setBackground("#e8f0fe");

  // The Rule
  sheet.getRange("A13").setValue("THE RULE");
  sheet.getRange("A13").setFontWeight("bold").setBackground("#f3f3f3");
  sheet.getRange("A14").setValue("If your name is on this page, you are responsible for the OUTCOME, not the effort.");
  sheet.getRange("A14").setFontStyle("italic");

  // Formatting
  sheet.setColumnWidth(1, 150);
  sheet.setColumnWidth(2, 350);
  sheet.setColumnWidth(3, 150);
  sheet.setColumnWidth(4, 250);
}

function createSettingsSheet(ss) {
  let sheet = ss.getSheetByName(SHEETS.SETTINGS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEETS.SETTINGS);
  }
  sheet.clear();

  // Title
  sheet.getRange("A1").setValue("⚙️ PULSE SYSTEM SETTINGS");
  sheet.getRange("A1").setFontSize(16).setFontWeight("bold");

  // Team Members
  sheet.getRange("A3").setValue("TEAM MEMBERS");
  sheet.getRange("A3").setFontWeight("bold").setBackground("#f3f3f3");
  sheet.getRange("A4").setValue("(Add team member names below - these appear in the form dropdown)");
  sheet.getRange("A4").setFontStyle("italic").setFontColor("#666666");

  for (let i = 0; i < CONFIG.TEAM_MEMBERS.length; i++) {
    sheet.getRange(5 + i, 1).setValue(CONFIG.TEAM_MEMBERS[i]);
  }

  // Strategic Goals
  sheet.getRange("C3").setValue("STRATEGIC GOALS");
  sheet.getRange("C3").setFontWeight("bold").setBackground("#f3f3f3");
  sheet.getRange("C4").setValue("(These appear in the Priority 1 dropdown)");
  sheet.getRange("C4").setFontStyle("italic").setFontColor("#666666");

  for (let i = 0; i < CONFIG.STRATEGIC_GOALS.length; i++) {
    sheet.getRange(5 + i, 3).setValue(CONFIG.STRATEGIC_GOALS[i].name);
  }

  // Current Week
  sheet.getRange("E3").setValue("CURRENT WEEK");
  sheet.getRange("E3").setFontWeight("bold").setBackground("#f3f3f3");
  sheet.getRange("E5").setValue(getCurrentWeekNumber());
  sheet.getRange("E4").setValue("(Auto-calculated)");
  sheet.getRange("E4").setFontStyle("italic").setFontColor("#666666");

  sheet.setColumnWidth(1, 200);
  sheet.setColumnWidth(2, 30);
  sheet.setColumnWidth(3, 300);
  sheet.setColumnWidth(4, 30);
  sheet.setColumnWidth(5, 150);
}

// ============================================
// WEB APP FUNCTIONS
// ============================================
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('The Pulse System')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getFormData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Get team members from Settings sheet
  const settingsSheet = ss.getSheetByName(SHEETS.SETTINGS);
  let teamMembers = [];
  if (settingsSheet) {
    const memberRange = settingsSheet.getRange("A5:A20").getValues();
    teamMembers = memberRange.flat().filter(m => m !== "");
  }
  if (teamMembers.length === 0) {
    teamMembers = CONFIG.TEAM_MEMBERS;
  }

  // Get strategic goals from Settings sheet
  let goals = [];
  if (settingsSheet) {
    const goalRange = settingsSheet.getRange("C5:C10").getValues();
    goals = goalRange.flat().filter(g => g !== "");
  }
  if (goals.length === 0) {
    goals = CONFIG.STRATEGIC_GOALS.map(g => g.name);
  }

  return {
    teamMembers: teamMembers,
    strategicGoals: goals,
    currentWeek: getCurrentWeekNumber(),
    companyName: CONFIG.COMPANY_NAME
  };
}

function submitMondayPromise(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.MONDAY_PROMISES);

  if (!sheet) {
    return { success: false, message: "Sheet not found. Please run setup first." };
  }

  const row = [
    new Date(),
    data.week,
    data.name,
    data.priority1,
    data.linkedGoal,
    data.priority2,
    data.priority3,
    data.notes || "",
    "Submitted"
  ];

  sheet.appendRow(row);

  // Send notification if configured
  if (CONFIG.NOTIFICATION_EMAIL) {
    sendNotificationEmail("Monday Promise", data);
  }

  return {
    success: true,
    message: "Your Monday Promise has been submitted successfully!"
  };
}

function submitFridayProof(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.FRIDAY_PROOF);

  if (!sheet) {
    return { success: false, message: "Sheet not found. Please run setup first." };
  }

  const row = [
    new Date(),
    data.week,
    data.name,
    data.priority1Status,
    data.priority1Proof,
    data.priority2Status,
    data.priority2Proof,
    data.priority3Status,
    data.priority3Proof,
    data.blockers || "",
    data.recoveryPlan || ""
  ];

  sheet.appendRow(row);

  // Send notification if configured
  if (CONFIG.NOTIFICATION_EMAIL) {
    sendNotificationEmail("Friday Proof", data);
  }

  return {
    success: true,
    message: "Your Friday Proof has been submitted successfully!"
  };
}

function updateScoreboard(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.SCOREBOARD);

  if (!sheet) {
    return { success: false, message: "Scoreboard sheet not found." };
  }

  // Find the goal row
  const goals = sheet.getRange(2, 1, 10, 1).getValues().flat();
  const goalIndex = goals.findIndex(g => g === data.goal);

  if (goalIndex === -1) {
    return { success: false, message: "Goal not found on scoreboard." };
  }

  // Update the cell (row = goalIndex + 2, column = week + 2)
  const cell = sheet.getRange(goalIndex + 2, parseInt(data.week) + 2);
  cell.setValue(data.status);

  // Set background color
  const colors = {
    "🟢": "#b7e1cd",
    "🟡": "#fce8b2",
    "🔴": "#f4c7c3"
  };
  cell.setBackground(colors[data.status] || "white");

  return { success: true, message: "Scoreboard updated!" };
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function getCurrentWeekNumber() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const diff = now - startOfYear;
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.ceil(diff / oneWeek);
}

function sendNotificationEmail(type, data) {
  if (!CONFIG.NOTIFICATION_EMAIL) return;

  const subject = `[Pulse] ${type} from ${data.name}`;
  let body = `${type} Submission\n\n`;
  body += `Name: ${data.name}\n`;
  body += `Week: ${data.week}\n\n`;

  if (type === "Monday Promise") {
    body += `Priority 1: ${data.priority1}\n`;
    body += `Linked Goal: ${data.linkedGoal}\n`;
    body += `Priority 2: ${data.priority2}\n`;
    body += `Priority 3: ${data.priority3}\n`;
  } else {
    body += `Priority 1: ${data.priority1Status} - ${data.priority1Proof}\n`;
    body += `Priority 2: ${data.priority2Status} - ${data.priority2Proof}\n`;
    body += `Priority 3: ${data.priority3Status} - ${data.priority3Proof}\n`;
    if (data.blockers) body += `\nBlockers: ${data.blockers}\n`;
    if (data.recoveryPlan) body += `Recovery Plan: ${data.recoveryPlan}\n`;
  }

  MailApp.sendEmail(CONFIG.NOTIFICATION_EMAIL, subject, body);
}

function createMenu() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🎯 Pulse System')
    .addItem('📊 Go to Scoreboard', 'goToScoreboard')
    .addItem('📝 Go to Monday Promises', 'goToMondayPromises')
    .addItem('✅ Go to Friday Proofs', 'goToFridayProofs')
    .addSeparator()
    .addItem('🔄 Re-run Setup', 'setupPulseSystem')
    .addItem('📋 Get Form URL', 'showFormUrl')
    .addToUi();
}

function onOpen() {
  createMenu();
}

function goToScoreboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setActiveSheet(ss.getSheetByName(SHEETS.SCOREBOARD));
}

function goToMondayPromises() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setActiveSheet(ss.getSheetByName(SHEETS.MONDAY_PROMISES));
}

function goToFridayProofs() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setActiveSheet(ss.getSheetByName(SHEETS.FRIDAY_PROOF));
}

function showFormUrl() {
  const ui = SpreadsheetApp.getUi();
  ui.alert(
    'Form URL',
    'To get your form URL:\n\n' +
    '1. Go to Deploy > Manage deployments\n' +
    '2. Click on the active deployment\n' +
    '3. Copy the Web app URL\n\n' +
    'Share this URL with your team!',
    ui.ButtonSet.OK
  );
}
