const fs = require('fs');
const path = require('path');

function updateCustomer(logoSource, websiteUrl) {
    if (!logoSource || !websiteUrl) {
        console.error('Usage: node scripts/update-customer.js <logo_path> <website_url>');
        process.exit(1);
    }

    const publicDir = path.join(__dirname, '../public');
    const dataFile = path.join(__dirname, '../src/data/customer.json');
    const ext = path.extname(logoSource).toLowerCase();

    if (!['.png', '.svg', '.jpg', '.jpeg'].includes(ext)) {
        console.error('Error: Logo must be PNG, SVG, or JPG.');
        process.exit(1);
    }

    const targetLogoName = `customer-logo${ext}`;
    const targetLogoPath = path.join(publicDir, targetLogoName);

    try {
        // Remove old customer logos to avoid confusion
        const files = fs.readdirSync(publicDir);
        files.forEach(file => {
            if (file.startsWith('customer-logo.')) {
                fs.unlinkSync(path.join(publicDir, file));
            }
        });

        // Copy new logo
        fs.copyFileSync(logoSource, targetLogoPath);
        console.log(`Successfully copied logo to: ${targetLogoPath}`);

        // Update JSON config
        const config = {
            logoPath: `/${targetLogoName}`,
            websiteUrl: websiteUrl
        };
        fs.writeFileSync(dataFile, JSON.stringify(config, null, 2));
        console.log(`Successfully updated configuration: ${dataFile}`);

    } catch (error) {
        console.error('Error during update:', error.message);
        process.exit(1);
    }
}

const [, , logo, url] = process.argv;
updateCustomer(logo, url);
