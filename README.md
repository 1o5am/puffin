# Project Title
Puffin: Your personal financial advisor to help you reach your goals and build wealth!

## Overview

Puffin is an application that empowers you with knowledge of your personal finance. It asks you about your goals and analyzes your data to show you how you are pacing against your goals and what you'd need to do to get on track for your goals. It combines the natural language power of LLMs with your data to provide you detailed insights into the complicated world of personal finance. 

### Problem Space

With the ability to have many bank accounts, individuals struggle to effectively manage their finances and achieve their financial goals due to several key challenges:

1. Difficulty in categorizing and understanding spending patterns across multiple accounts
2. Lack of personalized financial guidance that takes into account individual circumstances and goals
3. Time-consuming manual tracking and analysis of financial data
4. Gap between having financial goals and knowing the specific steps needed to achieve them

Puffin aims to address these pain points automating the analysis process and providing personalized, actionable guidance based on real financial data.

### User Profile

The primary users will be individuals who:
- Are on the market looking for a financial advosir
- Have multiple bank accounts and credit cards
- Want to improve their financial health but need guidance
- Are comfortable sharing their financial data for analysis
- Seek personalized financial advice without the cost of a human financial advisor

Special considerations include ensuring robust security measures for sensitive financial data and making complex financial concepts accessible to users with varying levels of financial literacy.


### Features

1. User Onboarding and Goal Setting
   - Users complete an initial questionnaire about their financial goals and current financial status
   - System collects information about income, desired savings, and financial priorities

2. Financial Data Integration
   - Users can securely upload bank statements in CSV format
   - Automatic data validation and error handling

3. AI Analysis System
   - Automatic categorization of expenses
   - Pattern recognition in spending habits
   - Analysis on comparing spending habits to user inputted goals
   - Provide feedback on where user stands against their goals

4. Recommendation Engine
   - Personalized saving and spending recommendations
   - Specific action items to achieve goals
   - Monthly budget proposals
   - Expense reduction suggestions


## Implementation

**Frontend Architecture:**
- Vite for build tooling and development environment
- React.js for user interface development
- SASS for advanced styling capabilities
- JavaScript for client-side logic
- NPM for package management

**Backend Systems:**
- Node.js with Express framework for API development
- SQL database for data persistence
- Knex.js for SQL query building and migrations
- Postman for testing APIs

### APIs

OpenAI API for analysis

### Sitemap

1. Landing/Login Page (/)
   └── Login/Register forms
   └── Brief app description

2. Goals Setup (/goals)
   └── Single-page financial questionnaire
   └── Income and savings inputs

3. Data Upload (/upload)
   └── CSV upload interface
   └── Upload status

4. Dashboard (/dashboard)
   └── Spending analysis
   └── AI recommendations

### Data

1. Users
   - id (PK)
   - email
   - password_hash

2. Goals
   - id (PK)
   - user_id (FK to Users)
   - monthly_income
   - savings_target
   - primary_goal (text)

3. Transactions
   - id (PK)
   - user_id (FK to Users)
   - date
   - amount
   - description
   - category (assigned by AI)


### Endpoints

```javascript

// User login
POST /api/login              
Parameters:
  - email: string
  - password: string
Response: {
  user_id: number,
  token: string
}

// // Save financial goals
POST /api/goals                   
Parameters:
  - monthly_income: number
  - savings_target: number
  - primary_goal: string
Response: {
  goal_id: number,
  status: "success"
}

// Retreive user's current goals for API
GET /api/goals                    
Response: {
  monthly_income: number,
  savings_target: number,
  primary_goal: string,
  created_at: timestamp
}

// Upload data via CSV
POST /api/transactions/upload     
Parameters:
  - file: CSV file (FormData)
Response: {
  processed_rows: number,
  status: "success"
}

// Get financial data
GET /api/transactions
Response: {
  transactions: [
    {
      date: string,
      amount: number,
      description: string,
      category: string
    }
  ]
}

// Analysis & Recommendations

 // Get spending analysis from AI API
GET /api/analysis             
Response: {
  monthly_spending: {
    categories: string[],
    amounts: number[]
  },
  savings_analysis: {
    current_rate: number,
    target_rate: number
  },
  recommendations: [
    {
      type: string,
      description: string,
      potential_impact: number
    }
  ]
}
```

## Roadmap

### Foundation - 1 day
* Project setup (Vite + React)
* Express backend setup
* Database setup with Knex
* Basic routing setup

### Core Features - 4 days

#### Front End
* Pages:
- Landing Page
- Goal Setup Page
- Analysis Page

* Componenets:
- Login / Register form
- Gaol Setup Form
- Data Upload form
- Analysis componenet

### Back end

* Data Setup
- Building table
- Parsing CSV

* Controller Setup

* Router Setup

* index.js setup

* API setup

### AI Integration - 1 day

* OpenAI API integration
* Transaction categorization
* Basic analysis implementation
* Recommendation generation

### Testing - 1 day

* Testing
* Bug fixes


---

## Future Implementations

1. Authentication
2. Ability to add more data
3. More visualizations
4. More insights and detailed analysis
5. More focus on how insights are generated

