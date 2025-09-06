# AWS Route 53 Domain Transfer Guide

**Domain:** plonk.sh  
**Current Registrar:** Hover  
**Target:** AWS Route 53  
**Date:** 2025-09-03

## Overview

This guide walks through transferring the plonk.sh domain from Hover to AWS Route 53 for centralized management alongside our infrastructure.

**Current Status:**
- Domain: plonk.sh (registered with Hover)
- Current nameservers: ns1.hover.com, ns2.hover.com
- Infrastructure: Ready in `/infra/` with Route 53 domain resource configured

## Benefits of Transfer

- **Unified Management**: Domain and DNS in same AWS account
- **Infrastructure as Code**: Terraform can manage domain lifecycle
- **Cost**: $12/year for .sh domains (competitive with other registrars)
- **Integration**: Better integration with other AWS services

## Step-by-Step Transfer Process

### Step 1: Prepare Domain at Hover

1. **Log into Hover account** at https://hover.com
2. **Navigate to domain list** and find plonk.sh
3. **Unlock the domain**:
   - Look for "Domain Lock" or "Lock" setting
   - **Turn OFF** the domain lock (required for transfer)
   - Status should show "Unlocked"

4. **Generate authorization code**:
   - Look for "Transfer", "Auth Code", or "EPP Code" option
   - Click to generate/reveal the authorization code
   - **Copy and save** this code securely - you'll need it for AWS

### Step 2: Initiate Transfer in AWS Route 53

1. **Open AWS Console** and navigate to Route 53
2. **Click "Registered domains"** in the left sidebar
3. **Click "Transfer domain"** button
4. **Enter domain information**:
   - Domain name: `plonk.sh`
   - Authorization code: (paste code from Step 1)
   - Auto-renew: **Enable** (recommended)
   - Privacy protection: **Enable** (recommended)

5. **Complete contact information**:
   - Must be accurate and match domain registration
   - Will be used for transfer confirmation
   - Ensure email address is accessible

6. **Review transfer details**:
   - Domain: plonk.sh
   - Duration: 1 year (added to current expiration)
   - Cost: ~$12 USD
   - Contact information

7. **Submit transfer request**

### Step 3: Confirm Transfer

1. **Check email** (admin contact address)
2. **Look for AWS transfer confirmation email**
3. **Click confirmation link** to approve transfer
4. **Monitor for Hover release email** (they may also send confirmation)

### Step 4: Monitor Transfer Progress

- **Timeline**: 5-7 days maximum, often completes in 1-3 days
- **Check status**: AWS Route 53 → Registered domains
- **Transfer statuses**:
  - `Pending`: Transfer initiated, waiting for confirmation
  - `In progress`: Transfer approved, waiting for registrar release
  - `Complete`: Domain successfully transferred

### Step 5: Post-Transfer Verification

Once transfer completes:

1. **Verify in Route 53**: Domain appears in "Registered domains"
2. **Check nameservers**: Still showing hover.com (normal)
3. **Confirm auto-renewal**: Enabled in domain settings
4. **Update billing**: Domain charges now on AWS bill

## Important Notes

### During Transfer
- **No downtime**: DNS continues to work normally
- **Current nameservers remain**: hover.com nameservers stay active
- **Website accessibility**: No interruption to site access
- **Email delivery**: No impact on existing email routing

### After Transfer
- **Domain control**: Full control now in AWS Route 53
- **Renewal**: Handled automatically by AWS (if enabled)
- **Infrastructure deployment**: Can proceed with `tofu apply`
- **Nameserver change**: Will happen when we deploy Route 53 hosted zone

### Troubleshooting

**If transfer is rejected:**
- Verify domain is unlocked at Hover
- Check authorization code is correct and not expired
- Ensure contact email is accessible
- Contact AWS support if needed

**If transfer is slow:**
- Normal for some TLDs (.sh can take up to 7 days)
- Check with both Hover and AWS support if stuck
- Hover may auto-approve after 5 days

## Next Steps After Transfer

1. **Wait for transfer completion** (email confirmation)
2. **Deploy infrastructure**: `cd infra && tofu apply` 
3. **Update nameservers**: Will happen automatically via Terraform
4. **Verify website**: Test https://plonk.sh after deployment
5. **Monitor DNS propagation**: May take 24-48 hours globally

## Rollback Plan

If issues arise during transfer:
- **Before confirmation**: Simply don't click email confirmation link
- **During transfer**: Contact AWS support to cancel
- **After transfer**: Domain can be transferred back (another 60-day cycle)

## Cost Impact

- **Hover renewal cost**: Saved (no longer needed)
- **AWS Route 53**: $12/year for domain + $0.50/month for hosted zone
- **Net change**: Roughly equivalent, may be slightly cheaper

---

**Status**: Ready to begin  
**Timeline**: 5-7 days for completion  
**Risk**: Low (no downtime expected)