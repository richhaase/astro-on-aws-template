# GitHub Repository Prominence Enhancement Plan

**Date**: 2025-09-06  
**Goal**: Make the GitHub repository more prominent on the Plonk landing page beyond the current small footer icon

## Goal & Constraints
- **Goal**: Make the GitHub repository more prominent on the Plonk landing page beyond the current small footer icon
- **Constraints**: Follow CLAUDE.md directives (plan before coding, small diffs, respect boundaries), maintain Astro static site architecture, preserve existing design aesthetic
- **Scope**: Enhance GitHub visibility for developer audience without compromising current user flow or visual hierarchy
- **Out of scope**: Complete redesign, architectural changes to build/deploy pipeline

## Current State (paths only)
- `/Users/rdh/src/plonk-site/site/src/components/Hero.astro` - Main landing section with CTA buttons (lines 49-69)
- `/Users/rdh/src/plonk-site/site/src/components/Footer.astro` - Current GitHub link location (lines 6-13)
- `/Users/rdh/src/plonk-site/site/src/layouts/Layout.astro` - Base layout for script injection
- `/Users/rdh/src/plonk-site/scripts/deploy.js` - Deployment pipeline (no changes needed)
- **Repository URL**: `https://github.com/richhaase/plonk`

## Options & Trade-offs
- **Option A — Hero CTA Enhancement**: Add "View on GitHub" as third CTA button alongside existing "Try It Out" and "Learn More" buttons
  - *Why it fits*: Natural extension of existing CTA pattern, high visibility, developer expectation
  - *Complexity*: Low (modify existing button group)
  - *Blast radius*: Small (single component change)
  - *Performance*: No impact
  - *Migration cost*: None

- **Option B — GitHub Badges Integration**: Add shields.io badges (stars, build status, version) below key stats section
  - *Why it fits*: Industry standard for open source projects, provides social proof
  - *Complexity*: Medium (external service dependency)
  - *Blast radius*: Medium (potential external service failures)
  - *Performance*: Minor impact (external image requests)
  - *Migration cost*: Low

- **Option C — Dynamic GitHub API Integration**: JavaScript-powered live stats (star count, contributors) with fallback badges
  - *Why it fits*: Real-time social proof, professional appearance
  - *Complexity*: High (API integration, error handling, rate limiting)
  - *Blast radius*: Medium-High (API failures could break functionality)
  - *Performance*: Higher impact (API calls on page load)
  - *Migration cost*: Medium (new dependencies)

**Recommendation:** Combine Option A + Option B for maximum impact with controlled complexity. Start with static badges for immediate social proof, then enhance CTA section for better conversion.

## Design Sketch (recommended)
- **Interfaces/contracts**: 
  - New GitHub CTA button component in Hero.astro (lines 49-69)
  - New badges section in Hero.astro after key stats (line 85)
  - Optional: GitHub stats utility function in layouts/Layout.astro

- **Data/schema**: 
  - Static shields.io URLs for badges (no schema changes)
  - GitHub repository constant: `richhaase/plonk`

- **Error & boundaries**: 
  - Shields.io badge fallback to text if images fail to load
  - GitHub link opens in new tab with security attributes
  - Mobile-responsive badge sizing

- **Compatibility**: 
  - Maintains existing CTA button styling and behavior
  - Preserves all current functionality and navigation
  - No breaking changes to existing components

## Plan (≤7 steps)
1. **Enhance Hero CTA section** - Add "View on GitHub" button as third CTA with consistent styling but secondary visual priority
2. **Add GitHub badges section** - Insert shields.io badges below key stats showing stars, last commit, and build status
3. **Optimize badge responsiveness** - Ensure badges scale properly on mobile devices with appropriate sizing
4. **Update Footer GitHub link** - Enhance existing footer link with better styling and star count indicator
5. **Add mobile-first CSS** - Implement responsive design for new GitHub elements across all screen sizes
6. **Test accessibility** - Ensure all new GitHub links have proper ARIA labels and keyboard navigation
7. **Deploy and validate** - Build, deploy, and verify functionality across devices and browsers

## Test Plan
- **Unit**: 
  - Hero.astro renders new GitHub CTA button correctly
  - Shields.io badges load and display properly
  - Links have correct href attributes and security attributes
  - File locations: `site/src/components/Hero.astro`, `site/src/components/Footer.astro`

- **Integration**: 
  - Full page render with all GitHub elements visible
  - Mobile responsive behavior testing
  - External badge service integration (shields.io)
  - Cross-browser compatibility (Chrome, Firefox, Safari, Edge)

- **Regression**: 
  - Existing "Try It Out" and "Learn More" buttons maintain functionality
  - Footer GitHub link continues to work
  - Page load performance not significantly impacted
  - Original design aesthetic preserved

- **Performance**: 
  - Page load time increase <200ms with badge images
  - Lighthouse accessibility score maintains >90
  - Core Web Vitals unchanged (LCP, FID, CLS)

## Observability & Rollout
- **Metrics to watch**:
  - GitHub link click-through rates from different sections
  - Page load performance metrics
  - Badge image load success rates
  - Mobile vs desktop engagement patterns

- **Rollout strategy**: 
  - Standard deployment (not feature-flagged due to low risk)
  - Monitor CloudFront logs for GitHub link clicks
  - Track 404s or failed image loads for badges

## Docs & Comms
- **Files to update**:
  - `README.md` - Add note about GitHub integration enhancements
  - `site/src/components/README.md` - Document new GitHub component patterns (if exists)

- **Decision Log entry**: 
  *"Enhanced GitHub repository visibility on landing page with prominent CTA button and social proof badges to improve developer engagement and repository discovery."*

## Risks & Mitigations
- **Risk**: Shields.io service outage causing broken badge images
  - *Detection*: Monitor image load failures, visual regression testing
  - *Mitigation*: Use alt text fallbacks, consider self-hosted alternatives

- **Risk**: CTA section becomes too cluttered with three buttons
  - *Detection*: User testing, conversion rate monitoring
  - *Mitigation*: A/B test button priorities, adjust spacing/sizing

- **Risk**: Mobile layout breaks with additional elements
  - *Detection*: Responsive design testing, mobile analytics
  - *Mitigation*: Progressive enhancement, mobile-first CSS approach

## Backout Plan
- **Exact revert steps**:
  1. `git revert <commit-hash>` for the GitHub enhancement commit
  2. `pnpm run build && pnpm run deploy` to restore previous version
  3. **Files to revert**: `site/src/components/Hero.astro`, `site/src/components/Footer.astro`
  4. **No database/infrastructure changes** to rollback

## Acceptance Checklist
- [ ] New "View on GitHub" CTA button visible and functional in hero section
- [ ] GitHub badges (stars, last commit, build status) display correctly below key stats
- [ ] All GitHub links open in new tabs with proper security attributes
- [ ] Mobile responsive design works on iOS and Android devices
- [ ] Page load performance maintains <3s on 3G connections
- [ ] Accessibility score remains >90 in Lighthouse audit
- [ ] Footer GitHub link enhanced with better visual prominence
- [ ] Cross-browser testing passed (Chrome, Firefox, Safari, Edge)
- [ ] GitHub repository receives increased traffic from landing page

## Implementation Priority
**Immediate**: Hero CTA Enhancement + GitHub Badges  
**Next**: Footer Enhancement + Mobile Optimization  
**Future**: Dynamic GitHub API Integration (if needed)