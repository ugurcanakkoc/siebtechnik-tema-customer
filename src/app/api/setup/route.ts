import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { exec } from "child_process";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const customerName = formData.get("customerName") as string;
        const websiteUrl = formData.get("websiteUrl") as string;
        const defaultLang = formData.get("defaultLang") as string || "de";
        const logoFile = formData.get("logo") as File;

        if (!customerName || !websiteUrl || !logoFile) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Setup paths
        // Current project dir: C:\Users\UVW-U\Desktop\Web\uvp-portfolio-temp
        // Target dir: C:\Users\UVW-U\Desktop\Web\uvp-portfolio-[customerName]
        const currentProjectDir = process.cwd();
        const parentDir = path.dirname(currentProjectDir);
        const targetDirName = `uvp-portfolio-${customerName.toLowerCase().replace(/\s+/g, "-")}`;
        const targetProjectDir = path.join(parentDir, targetDirName);

        if (fs.existsSync(targetProjectDir)) {
            return NextResponse.json({ error: "Project already exists: " + targetDirName }, { status: 409 });
        }

        // 2. Copy current project to new location
        // Skip node_modules, .next, .git
        console.log(`Copying project to: ${targetProjectDir}`);
        fs.mkdirSync(targetProjectDir, { recursive: true });

        const copyRecursive = (src: string, dest: string) => {
            const stats = fs.statSync(src);
            if (stats.isDirectory()) {
                const basename = path.basename(src);
                if (['.next', '.git', 'temp', 'dist'].includes(basename)) {
                    return;
                }

                if (!fs.existsSync(dest)) {
                    fs.mkdirSync(dest);
                }

                fs.readdirSync(src).forEach(child => {
                    copyRecursive(path.join(src, child), path.join(dest, child));
                });
            } else {
                fs.copyFileSync(src, dest);
            }
        };

        copyRecursive(currentProjectDir, targetProjectDir);

        // 3. Process Logo in the NEW project
        const ext = path.extname(logoFile.name);
        const logoName = `customer-logo${ext}`;
        const publicDir = path.join(targetProjectDir, "public");

        // Remove existing customer-logo files in the target
        const files = fs.readdirSync(publicDir);
        files.forEach(file => {
            if (file.startsWith('customer-logo.')) {
                fs.unlinkSync(path.join(publicDir, file));
            }
        });

        const targetLogoPath = path.join(publicDir, logoName);
        const logoBuffer = Buffer.from(await logoFile.arrayBuffer());
        fs.writeFileSync(targetLogoPath, logoBuffer);

        // 4. Update customer.json in the NEW project
        const customerJsonPath = path.join(targetProjectDir, "src", "data", "customer.json");
        const config = {
            logoPath: `/${logoName}`,
            websiteUrl: websiteUrl,
            defaultLang: defaultLang
        };
        fs.writeFileSync(customerJsonPath, JSON.stringify(config, null, 2));

        // 5. Run npm install selectively in the NEW project (background)
        // This solves the 'having to install next.js every time' problem
        console.log(`Starting npm install in: ${targetProjectDir}`);
        exec("npm install", { cwd: targetProjectDir }, (error, stdout, stderr) => {
            if (error) {
                console.error(`npm install error for ${customerName}:`, error);
                return;
            }
            console.log(`npm install completed for ${customerName}`);
        });

        return NextResponse.json({
            success: true,
            message: `Project created successfully at ${targetProjectDir}. Installation running in background.`,
            path: targetProjectDir
        });

    } catch (error: any) {
        console.error("Setup error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
