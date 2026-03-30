import api from '../lib/api';
import auth from '../lib/auth';

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('PayGrade extension installed');
  
  if (details.reason === 'install') {
    // Show welcome page on first install
    chrome.tabs.create({
      url: chrome.runtime.getURL('welcome.html'),
    });
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message in service worker:', request);

  switch (request.type) {
    case 'LOOKUP_SALARY':
      handleSalaryLookup(request, sendResponse);
      break;
    case 'SUBMIT_SALARY':
      handleSalarySubmission(request, sendResponse);
      break;
    case 'CHECK_AUTH':
      handleCheckAuth(request, sendResponse);
      break;
    case 'LOGIN':
      handleLogin(request, sendResponse);
      break;
    case 'LOGOUT':
      handleLogout(request, sendResponse);
      break;
    default:
      sendResponse({ error: 'Unknown message type' });
  }

  return true; // Keep message channel open for async responses
});

async function handleSalaryLookup(request: any, sendResponse: any) {
  try {
    const response = await api.lookupSalary(request.params);
    sendResponse({ success: true, data: response.data });
  } catch (error: any) {
    console.error('Salary lookup error:', error);
    sendResponse({ 
      success: false, 
      error: error.error || 'Failed to lookup salary',
      code: error.code || 500 
    });
  }
}

async function handleSalarySubmission(request: any, sendResponse: any) {
  try {
    const response = await api.submitSalary(request.data);
    sendResponse({ success: true, data: response });
  } catch (error: any) {
    console.error('Salary submission error:', error);
    sendResponse({ 
      success: false, 
      error: error.error || 'Failed to submit salary',
      code: error.code || 500 
    });
  }
}

async function handleCheckAuth(request: any, sendResponse: any) {
  try {
    const authenticated = await auth.isAuthenticated();
    if (authenticated) {
      const user = auth.getUser();
      sendResponse({ 
        success: true, 
        authenticated: true, 
        user: user 
      });
    } else {
      sendResponse({ 
        success: true, 
        authenticated: false, 
        user: null 
      });
    }
  } catch (error: any) {
    console.error('Auth check error:', error);
    sendResponse({ 
      success: false, 
      error: error.error || 'Failed to check authentication',
      code: error.code || 500 
    });
  }
}

async function handleLogin(request: any, sendResponse: any) {
  try {
    const result = await auth.login(request.email);
    sendResponse({ success: result });
  } catch (error: any) {
    console.error('Login error:', error);
    sendResponse({ 
      success: false, 
      error: error.error || 'Failed to login',
      code: error.code || 500 
    });
  }
}

async function handleLogout(request: any, sendResponse: any) {
  try {
    await auth.logout();
    sendResponse({ success: true });
  } catch (error: any) {
    console.error('Logout error:', error);
    sendResponse({ 
      success: false, 
      error: error.error || 'Failed to logout',
      code: error.code || 500 
    });
  }
}

// Handle periodic background tasks
chrome.alarms.create('checkAuth', { periodInMinutes: 60 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkAuth') {
    auth.isAuthenticated().then((authenticated) => {
      if (!authenticated) {
        console.log('User session expired');
      }
    });
  }
});

// Listen for tab updates to detect when job pages are loaded
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Check if this is a supported job board
    const supportedDomains = [
      'linkedin.com', 'indeed.com', 'glassdoor.com', 'careers24.com',
      'pnet.co.za', 'jobmail.co.za', 'seek.com.au', 'reed.co.uk',
      'totaljobs.com', 'monster.com', 'ziprecruiter.com', 'greenhouse.io',
      'lever.co', 'workday.com'
    ];

    const isJobBoard = supportedDomains.some(domain => 
      tab.url?.includes(domain)
    );

    if (isJobBoard) {
      console.log('Detected supported job board:', tab.url);
    }
  }
});