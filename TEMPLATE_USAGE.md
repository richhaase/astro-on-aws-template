# Template Usage Guide

This document explains how to use the Astro + AWS Infrastructure Template.

## For Template Users

### Creating a New Project from Template

1. **Create from GitHub Template**
   - Visit the template repository on GitHub
   - Click "Use this template" button
   - Choose "Create a new repository"
   - Name your new repository and create it

2. **Clone and Setup**
   ```bash
   git clone https://github.com/YOUR_USERNAME/your-new-project.git
   cd your-new-project
   npm run setup
   ```

3. **Follow the Interactive Prompts**
   The setup script will ask you to configure:
   - Project name and description
   - Domain name
   - Site type (landing page, docs, blog, etc.)
   - Author information
   - AWS region

4. **Start Development**
   ```bash
   pnpm install
   pnpm run dev
   ```

## Template Variables

The following placeholders are automatically replaced during setup:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{PROJECT_NAME}}` | Project name (kebab-case) | `my-awesome-site` |
| `{{PROJECT_TITLE}}` | Human-readable title | `My Awesome Site` |
| `{{PROJECT_DESCRIPTION}}` | Brief description | `An amazing website` |
| `{{DOMAIN_NAME}}` | Primary domain | `example.com` |
| `{{AUTHOR_NAME}}` | Author name | `Jane Doe` |
| `{{AUTHOR_EMAIL}}` | Author email (optional) | `jane@example.com` |
| `{{AUTHOR_TWITTER}}` | Twitter handle (optional) | `janedoe` |
| `{{SITE_TYPE}}` | Site type | `landing-page` |
| `{{AWS_REGION}}` | AWS region | `us-east-1` |

## Files with Template Variables

The following files contain placeholders that are replaced during setup:

- `package.json` - Project metadata
- `site/package.json` - Site-specific package info
- `site/astro.config.mjs` - Astro configuration with site URL
- `infra/terraform.tfvars` - Infrastructure variables
- `site/src/pages/index.astro` - Main page metadata
- `.envrc.example` - Environment configuration example

## For Template Maintainers

### Adding New Template Variables

1. **Add to Configuration**
   Update `template.config.js`:
   ```javascript
   VARIABLE_NAME: {
     type: 'string',
     required: true,
     description: 'Description for users',
     validate: (value) => /regex/.test(value), // optional
     example: 'example-value'
   }
   ```

2. **Add to Template Files**
   Add `{{VARIABLE_NAME}}` placeholders in relevant files

3. **Update Template Files List**
   Add any new files to `templateFiles` array in `template.config.js`

### Testing Changes

1. Make changes to template files
2. Test with a fresh clone:
   ```bash
   git clone template-repo test-project
   cd test-project
   npm run setup
   ```
3. Verify all placeholders are replaced correctly
4. Test that the generated project builds and runs

## Post-Setup Cleanup

The setup script automatically:
- Removes `template.config.js`
- Removes `scripts/setup.js`  
- Removes `TEMPLATE_USAGE.md`
- Runs `pnpm install`
- Initializes git repository
- Creates initial commit

## Troubleshooting

**Setup script fails:**
- Check Node.js version (18+ required)
- Ensure pnpm is installed
- Verify file permissions

**Missing placeholders:**
- Check that files are listed in `templateFiles` array
- Verify placeholder syntax: `{{VARIABLE_NAME}}`

**Build errors after setup:**
- Run `pnpm run clean && pnpm install`
- Check that all template variables were replaced

## GitHub Template Configuration

The repository includes `.github/template.yml` which configures:
- Template metadata and description
- Labels and topics for discoverability
- Files to include in new repositories
- Template visibility settings