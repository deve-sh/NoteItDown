# NoteItDown

<div style="text-align:center">
    <img src="frontend/public/logo192.png" />
</div>

A Simple Note Taking App For an Entire Team, pre-packaged with support for Google and GitHub logins with Firebase Auth, database as Firestore.

Check out `frontend` directory's README for more.

### How Subscriptions Can Be Registered For An App Like NoteItDown - Basic Approach

- Each workspace has a pricing tier, like a fixed price per user or a fixed price per month. Store status like `subscriptionDisabled` and `lastSubscriptionPaymentDetails` for each workspace. When a workspace is created, the first parameter is null and the date of last payment is set to the date of workspace creation.
- Run a CRON Job every day to check which workspaces have their previous paid dates over 30 days old.
- Create a payment link with the calculated price for the workspaces and send it to all the admins of the workspace.
- If any one of the admins pays through the payment link, don't disable the subscription. Save the payment details in the `lastSubscriptionPaymentDetails`. The users of the workspace continue using the service without any interruption.

If the subscription payment link isn't paid:
- Run another CRON Job to check for expiry of payment links and the workspaces they are associated with, once the payment link is more than 5 days old and the payment hasn't come through for the link, disable the workspace subscription.
- On the frontend, mention to the users that the workspace is no longer active and add a pay button to enable the workspace again.

Please note that the fields have to be locked down in the security rules of the database and no user besides the Admin SDK in the backend has access to edit those fields for a workspace.

Also note that there are other services offered by Stripe and Razorpay that make this process extremely frictionless and remove the need for CRON Jobs.