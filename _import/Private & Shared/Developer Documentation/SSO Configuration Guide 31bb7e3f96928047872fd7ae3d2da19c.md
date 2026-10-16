# SSO Configuration Guide

## **Overview**

This guide helps 1mind customers configure SAML 2.0 Single Sign-On (SSO) with Identity Providers such as Okta, Azure AD (Microsoft Entra ID), or Google Workspace. SSO allows your team to authenticate through your organization's existing Identity Provider (IdP), providing centralized access control, enhanced security, and simplified user management.

---

## **Prerequisites**

**What the 1mind Team Completes First**

Your 1mind Customer Success team will complete these steps before sending your invitation:

- Create your organization's account
- Basic Initial configuration of your 1mind Superhuman
- Send invitation to your Genesis User (i.e first 1mind Console Admin user)
- Enable SSO Feature

**What You Need (Customer)**

- Administrative access to your Identity Provider (Okta, Azure AD, Google Workspace, etc.)
- Ability to create and configure enterprise applications in your IdP
- Invitation email from 1mind (sent after account setup is complete)

Once the Genesis User receives the invitation email, you can proceed with the setup process below.

<aside>
<img src="https://app.notion.com/icons/info-alternate_gray.svg" alt="https://app.notion.com/icons/info-alternate_gray.svg" width="40px" />

What is a Genesis User? 

A Genesis User is the first administrator user who will be in charge of configuring the initial setup of SSO. They will be the only user who will sign-in for the first time to the 1mind Console and have a password.

**If you are existing 1mind customer, you might already have users with password credential set up. Once admin configure SSO, existing users will be prompted to perform sign-in using SSO with your IdP.**

</aside>

## **Setup Process**

### **Step 1: Initial Account Setup**

The Genesis User must sign up with **email** and **password** before SSO can be configured.

**What to do:**

1. **Open the invitation email from 1mind**
    - Check your inbox for the invitation email
2. **Click the signup link**
    - You'll be redirected to the account creation page
3. **Create your account**
    - On the account creation page, enter the following:
        - **First Name:** Enter your first name
        - **Last Name:** Enter your last name
        - **Password:** Create a secure password
4. **Verify your email address**
    - An activation code will be sent to your email
    - Check your inbox (the code typically arrives within 1-2 minutes)
    - Enter the verification code on the verification page
    - Click **Submit** to complete account activation

<aside>
<img src="https://app.notion.com/icons/info-alternate_gray.svg" alt="https://app.notion.com/icons/info-alternate_gray.svg" width="40px" />

If you don't receive the code within 5 minutes, check your spam folder or reach out to your Customer Success Manager or Services contact

</aside>

1. **You will land on the 1mind Console after sign up** 

<aside>
<img src="https://app.notion.com/icons/exclamation-mark_gray.svg" alt="https://app.notion.com/icons/exclamation-mark_gray.svg" width="40px" />

The password you create serves as your fallback login if SSO experiences issues. Keep it secure.

</aside>

### **Step 2: Access SSO Configuration**

1. In the 1mind Console
2. Navigate to **Settings** (left sidebar)
3. Click the **SSO** tab

### **Step 3: Enter Your Email Domain**

1. In the **SSO** Tab, click “**Configure SSO**” 
2. In the SSO configuration screen, enter your organization's **domain only**:
    - **Correct:** `company.com`
    - **Incorrect:** `user@company.com`
3. Click “**Generate Onboarding Link”**
4. You’ll see a configuration link in a modal (valid for 1 hour)
    
    ![image.png](SSO%20Configuration%20Guide/image.png)
    
5. Click “**Log out & open link**” to be redirected to the configuration portal:

![image.png](SSO%20Configuration%20Guide/image%201.png)

1. Click “**Configure Single Sign-On**” 

### **Step 4: Configure Your Identity Provider**

You'll be presented with configuration options for your Identity Provider:

- **Microsoft Entra ID (Azure AD)**
- **Okta**
- **Google**
- **Generic SAML IdP**

![Configuration options ](SSO%20Configuration%20Guide/image%202.png)

Configuration options 

**Select your Identity Provider and follow the step-by-step instructions provided in the SSO integration documentation.**

The configuration wizard will guide you through:

- Creating an Application
- Configuring Service Provider (SP) values in your IdP
- Setting up the SAML connection
- Setting up attribute mapping

![Example: Microsoft Entra ID configuration wizard ](SSO%20Configuration%20Guide/image%203.png)

Example: Microsoft Entra ID configuration wizard 

Once you complete the configuration steps, you can now test SSO.

### **Step 5: Test your SSO configuration**

1. Click “**Test sign-in**” in the last step of the configuration wizard 

![image.png](SSO%20Configuration%20Guide/image%204.png)

1. You’ll be redirected to 1mind sign-up page. 

![1mind sign-up page](SSO%20Configuration%20Guide/image%205.png)

1mind sign-up page

1. Since you are a Genesis User (already having account with 1mind), Click “**Sign-In**” and you will be redirected to a Sign In page. 

![1mind sign-in page](SSO%20Configuration%20Guide/image%206.png)

1mind sign-in page

1. Enter your **company email** (i.e john.doe@company.com) and click “**Continue”**
2. On the next page, click “**Sign in with** **`{configured_identity_provider}`**”

![image.png](SSO%20Configuration%20Guide/image%207.png)

1. You will be redirected to your IdP’s sign in screen

![Example: Microsoft Entra ID Sign in page](SSO%20Configuration%20Guide/image%208.png)

Example: Microsoft Entra ID Sign in page

1. Sign in using your credentials (e.g, johndoe@company.com) in your IdP.
2. Once you’ve successfully authenticate through your IdP, you will be redirected to the 1mind.
    1. The genesis user will be prompted to enter their 1mind password after being redirected back from the IdP. This links their SSO credentials to their existing 1mind account. Enter the password you created in [Step 1](https://app.notion.com/p/internal-SSO-Configuration-Guide-v2-375b7e3f96928078a545c0385d75640d?pvs=21).
        
        ![image.png](SSO%20Configuration%20Guide/image%209.png)
        
3. After adding your existing password with 1mind account. Your SSO credentials will be linked with identity with existing password credentials and redirected to 1mind console. This step is only required once. All sub-sequent login will only require authentication with your IdP going forward.

![image.png](SSO%20Configuration%20Guide/image%2010.png)

1mind Console

### Step 6: Inviting Users to 1mind

Welcome! You’ve successfully configured your IdP for SSO. Now, you are ready invite your team. 

1. Make sure you are logged into the 1mind Console
2. In the 1mind Console, go to **Settings**
3. Go to the **User Management Tab**
4. Click “**Add User**” 
5. Enter your team’s work email (i.e, the one they can sign in with using your IdP) 
6. Your team member will now get a invitation link sent to their work email
7. You team member will have to click the invitation link to sign in via SSO for the first time. 
8. That’s it 🎉

<aside>
<img src="https://app.notion.com/icons/info-alternate_gray.svg" alt="https://app.notion.com/icons/info-alternate_gray.svg" width="40px" />

When existing users with password credential set tries to sign in for the first time after SSO setup, they will also be prompted to specify their password once as part of credential merge similar to Genesis user.

</aside>

<aside>
<img src="https://app.notion.com/icons/info-alternate_gray.svg" alt="https://app.notion.com/icons/info-alternate_gray.svg" width="40px" />

If you are having issues inviting your team, please contact your 1mind Customer Success Manager or Services contact

</aside>

## **Frequently Asked Questions**

**Q: The configuration link expired. How do I get a new one?**

A: Configuration links are valid for 1 hour only. Go back to 1mind Console and go to: Settings > SSO > Configure SSO to generate a new link. Complete the setup within the time limit.

**Q: I can't see the SSO tab in Settings. Why not?**

A: Either SSO isn't enabled for your account, or you don't have Admin permissions. Contact your 1mind Customer Success Manager or Services contact to enable the feature.

**Q: SSO was working but now it's not. What happened?**

A: The most common cause is an expired IdP certificate. Check your Identity Provider's certificate expiration date and upload a new one if needed.

**Q: What should I do if SSO login fails?**

A: First, confirm that the Assertion Consumer Service (ACS) URL and SP Entity ID in your IdP match exactly what’s shown in the 1mind configuration wizard. Check for extra spaces and typos. Then verify that the Identity Provider metadata (certificate, SSO URL, Issuer) uploaded to 1mind matches your current IdP configuration. If the issue persists, contact your 1mind representative and include screenshots of the error and details about when the failure occurs.

**Q: I’ve invited users in the 1mind console. They can sign in through SSO, but get an "access denied" or "unauthorized" error. What's wrong?**

**A:** This means your users have successfully authenticated with your identity provider (IdP), but their account hasn't been granted access to 1mind yet. An IT administrator needs to assign them to the 1mind application in the [IdP name, e.g., Okta/Azure AD/Google Workspace]. Contact your IT team and ask them to add users to the 1mind application group.