import { Metadata } from "next";
import "../../(app)/global.css";


export const metadata: Metadata = {
    title: "Hackathon",
    description: "Hackathon",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <div>
                    {children}
                </div>
            </body>
        </html>
    );
}