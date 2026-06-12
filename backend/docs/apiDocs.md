# UniBrandConnect API Documentation

Base URL:
http://localhost:5000/api

---

## 🔐 Authentication

### Register
POST /auth/register

Body:
{
  "name": "Ali",
  "email": "ali@test.com",
  "password": "123456",
  "role": "student"
}

---

### Login
POST /auth/login

Body:
{
  "email": "ali@test.com",
  "password": "123456"
}

Returns JWT Token.

---

## 🎯 Campaigns

### Create Campaign (Brand)
POST /campaigns
Authorization: Bearer TOKEN

Body:
{
  "title": "Nike Shoes",
  "description": "Promote shoes",
  "commissionRate": 10,
  "totalBudget": 5000
}

---

### Get Approved Campaigns (Student)
GET /campaigns

---

## 📩 Applications

### Apply to Campaign (Student)
POST /applications
Body:
{
  "campaignId": "ID"
}

---

## 🔗 Referrals

### Generate Referral (Student)
POST /referrals

---

### Track Click (Public)
GET /referrals/r/:code

---

## 💰 Wallet

### Get Wallet (Student)
GET /wallet/my-wallet

---

## 💳 Withdrawals

### Request Withdrawal
POST /withdrawals

---

## 📊 Admin

### Dashboard
GET /admin/dashboard

---

## 🔔 Notifications

### Get Notifications
GET /notifications